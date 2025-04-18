import { Request, Response, NextFunction } from 'express';
import pool from '../config/database'; // Use .js extension if using ES modules

// --- createBooking Function ---
export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
    const { movieId, showtime, seats } = req.body;

    // --- Input Validation ---
    if (!movieId || typeof movieId !== 'number') {
        return res.status(400).json({ error: 'Invalid or missing movieId (must be a number)' });
    }
    if (!showtime || typeof showtime !== 'string' || showtime.trim() === '') {
        return res.status(400).json({ error: 'Invalid or missing showtime (must be a non-empty string)' });
    }
    // Ensure seats is a non-empty array of non-empty strings
    if (!seats || !Array.isArray(seats) || seats.length === 0 || !seats.every(s => typeof s === 'string' && s.trim() !== '')) {
        return res.status(400).json({ error: 'Invalid or missing seats array (must be a non-empty array of strings)' });
    }
    // --- End Validation ---

    let connection: any; // Use 'any' or import PoolConnection type if available
    try {
        connection = await pool.getConnection(); // Get a connection from the pool
        await connection.beginTransaction(); // Start transaction

        // 1. Check if movie exists (optional but good practice)
        const [movieRows]: any = await connection.query('SELECT id FROM movies WHERE id = ?', [movieId]);
        if (movieRows.length === 0) {
            await connection.rollback(); // Rollback transaction
            connection.release(); // Release connection
            return res.status(404).json({ error: 'Movie not found' });
        }

        // 2. Check for seat conflicts (Important!)
        // Find existing bookings for the same movie and showtime
        const [existingBookings]: any = await connection.query(
            'SELECT seats FROM bookings WHERE movie_id = ? AND showtime = ?',
            [movieId, showtime]
        );

        // Aggregate already booked seats for this movie/showtime from the JSON strings
        const alreadyBookedSeats = existingBookings.reduce((acc: Set<string>, booking: { seats: string | null }) => {
            if (booking.seats) {
                try {
                    const parsedSeats = JSON.parse(booking.seats);
                    if (Array.isArray(parsedSeats)) {
                        parsedSeats.forEach(seat => acc.add(seat));
                    }
                } catch (e) {
                    console.error("Error parsing existing seats JSON:", booking.seats, e);
                }
            }
            return acc;
        }, new Set<string>());

        // Check if any requested seat is already in the set of booked seats
        const conflicts = seats.filter((seat: string) => alreadyBookedSeats.has(seat));

        if (conflicts.length > 0) {
            await connection.rollback();
            connection.release();
            return res.status(409).json({ error: `Seat conflict: The following seats are already booked: ${conflicts.join(', ')}` });
        }

        // 3. Insert the main booking record, storing seats as JSON
        const seatsJsonString = JSON.stringify(seats);
        const [result]: any = await connection.query(
            'INSERT INTO bookings (movie_id, showtime, seats) VALUES (?, ?, ?)',
            [movieId, showtime, seatsJsonString]
        );
        const bookingId = result.insertId;

        
        
        await connection.commit(); // Commit transaction
        connection.release(); // Release connection

        res.status(201).json({ bookingId, message: 'Booking created successfully' });

    } catch (err) {
        if (connection) {
            try {
                await connection.rollback(); // Rollback transaction on error
            } catch (rollbackError) {
                console.error("Error rolling back transaction:", rollbackError);
            } finally {
                connection.release(); // Always release connection
            }
        }
        console.error("Booking creation error:", err); // Log the detailed error
        next(err); // Pass error to the global error handler
    }
};

// --- getBookingById Function ---
export const getBookingById = async (req: Request, res: Response, next: NextFunction) => {
    const bookingId = req.params.id;
    if (isNaN(Number(bookingId))) {
        return res.status(400).json({ error: 'Invalid booking ID format' });
    }

    try {
        // Fetch booking details, movie title, and the seats JSON string
        const [bookingRows]: any = await pool.query(
            `SELECT b.id, b.movie_id, b.showtime, b.created_at, b.seats as seats_json, m.title as movie_title
             FROM bookings b
             JOIN movies m ON b.movie_id = m.id
             WHERE b.id = ?`,
            [bookingId]
        );

        if (bookingRows.length === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        const booking = bookingRows[0];

        // Parse the seats JSON string from the bookings table
        try {
            // Ensure parsing happens correctly, default to empty array
            booking.seats = JSON.parse(booking.seats_json || '[]');
            if (!Array.isArray(booking.seats)) { // Double check if parsing resulted in array
                 console.error("Parsed seats is not an array:", booking.seats_json);
                 booking.seats = [];
            }
        } catch (parseError) {
            console.error("Error parsing seats JSON from booking:", booking.seats_json, parseError);
            booking.seats = []; // Default to empty array on error
        }
        delete booking.seats_json; // Remove the original JSON string field from the response

        // --- Alternative: If using booking_seats table ---
        /*
        const [seatRows]: any = await pool.query(
            'SELECT seat_number FROM booking_seats WHERE booking_id = ?',
            [bookingId]
        );
        booking.seats = seatRows.map((row: any) => row.seat_number);
        */
        // --- End Alternative ---

        res.json(booking);
    } catch (err) {
        console.error("Error in getBookingById:", err);
        next(err); // Pass error to the global error handler
    }
};


// --- getBookedSeats Function (Revised) ---
export const getBookedSeats = async (req: Request, res: Response, next: NextFunction) => {
    // Log received query parameters for debugging
    console.log('Received query params for booked seats:', req.query);

    const { movieId, showtime } = req.query;

    // --- Improved Validation ---
    if (!movieId) {
        return res.status(400).json({ error: 'Missing movieId query parameter' });
    }
    if (typeof movieId !== 'string' || isNaN(Number(movieId))) {
         return res.status(400).json({ error: 'Invalid movieId query parameter: Must be a number string' });
    }
    if (!showtime) {
        return res.status(400).json({ error: 'Missing showtime query parameter' });
    }
    if (typeof showtime !== 'string' || showtime.trim() === '') {
        return res.status(400).json({ error: 'Invalid showtime query parameter: Must be a non-empty string' });
    }
    // --- End of Improved Validation ---

    const numericMovieId = Number(movieId); // Convert to number for the query

    try {
        // Fetch the 'seats' JSON strings from all relevant bookings
        const [rows]: any = await pool.query(
            'SELECT seats FROM bookings WHERE movie_id = ? AND showtime = ?',
            [numericMovieId, showtime] // Use numericMovieId here
        );

        // Aggregate all booked seats from the JSON strings into a single flat array
        const allBookedSeats = rows.reduce((acc: string[], booking: { seats: string | null }) => {
            let currentSeats: string[] = [];
            if (booking.seats) { // Check if seats string is not null
                try {
                    currentSeats = JSON.parse(booking.seats);
                    // Ensure parsed result is an array of strings
                    if (!Array.isArray(currentSeats) || !currentSeats.every(s => typeof s === 'string')) {
                        console.error("Parsed seats is not an array of strings:", booking.seats);
                        currentSeats = [];
                    }
                } catch (e) {
                    console.error("Error parsing seats JSON from booking:", booking.seats, e);
                    // Keep currentSeats as [] on error
                }
            }
            return acc.concat(currentSeats); // Add the parsed seats (or empty array) to accumulator
        }, []);

        // Remove duplicates (optional but good practice if multiple bookings could have same seat somehow)
        const uniqueBookedSeats = [...new Set(allBookedSeats)];

        res.json(uniqueBookedSeats); // Send flat array of unique booked seats

    } catch (err) {
        console.error("Error fetching booked seats:", err);
        next(err);
    }
};