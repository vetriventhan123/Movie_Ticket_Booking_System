export interface BookingRequest {
    movieId: number;
    showtime: string;
    seats: string[]; // Array of seat numbers/IDs
  }
  
  export interface BookingConfirmation {
    bookingId: number;
    message: string;
  }
  
  export interface Booking {
    id: number;
    movie_id: number; // Matches backend snake_case
    movie_title?: string; // Added from backend join
    showtime: string;
    seats: string[];
    created_at: string; // ISO date string
  }