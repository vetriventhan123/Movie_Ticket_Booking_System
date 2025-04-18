import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { Router } from '@angular/router'; // Import RouterLink
import { ApiService } from '../services/api.service';
import { MovieDetail } from '../models/movie.model'; // Assuming you have this model
import { BookingRequest } from '../models/booking.model'; // Assuming you have this model
import { catchError, of } from 'rxjs'; // Import catchError and of

@Component({
  selector: 'app-seat-selection',
  standalone: true, // Mark as standalone
  imports: [
    CommonModule // Import CommonModule for directives like *ngIf, *ngFor, ngClass
  ],
  templateUrl: './seat-selection.component.html',
  styleUrls: ['./seat-selection.component.css']
})
export class SeatSelectionComponent implements OnInit {
submitSelection() {
throw new Error('Method not implemented.');
}
  movie: MovieDetail | null = null; // Use a specific type if available
  showtime: string | null = null;
  seats: string[] = []; // All seat identifiers (e.g., "S1", "S2")
  bookedSeats: string[] = []; // Seats already booked for this movie/showtime
  selectedSeats: string[] = []; // Seats currently selected by the user
  isLoadingBookedSeats = true; // Flag for loading booked seats
  isBooking = false; // Flag for booking process in progress
  bookingError: string | null = null; // To display booking errors

  // Inject services using inject() function for standalone components
  private apiService = inject(ApiService);
  private router = inject(Router);

  constructor() {
    // Get state passed from navigation (preferred way over constructor injection)
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { movie: MovieDetail, showtime: string };
    if (state?.movie && state?.showtime) {
      this.movie = state.movie;
      this.showtime = state.showtime;
      console.log('Received state:', this.movie, this.showtime); // Debug log
    } else {
      console.error('State missing in navigation:', navigation?.extras.state); // Debug log
      // Handle missing state, maybe redirect back or show an error
      // this.router.navigate(['/']); // Example redirect
    }
  }

  ngOnInit(): void {
    if (!this.movie || !this.showtime) {
      console.error("Missing movie or showtime data for seat selection. Redirecting...");
      this.router.navigate(['/']); // Redirect if state is missing
      return;
    }

    // Generate example seats (e.g., 30 seats S1 to S30)
    // In a real app, this might come from a configuration or API
    const totalSeats = 30;
    this.seats = Array.from({ length: totalSeats }, (_, i) => `S${i + 1}`);

    // Fetch already booked seats for this specific movie and showtime
    this.isLoadingBookedSeats = true;
    // REMOVED encodeURIComponent() - HttpClient handles encoding
    this.apiService.getBookedSeats(this.movie.id, this.showtime).pipe(
      catchError(err => {
        console.error("Error fetching booked seats:", err);
        this.bookingError = "Could not load booked seats information. Some seats may appear available incorrectly.";
        // Return an empty array on error so the UI doesn't break completely
        return of([]);
      })
    ).subscribe({
      next: (booked) => {
        this.bookedSeats = booked;
        console.log('Booked seats loaded:', this.bookedSeats); // For debugging
      },
      complete: () => {
        this.isLoadingBookedSeats = false; // Finish loading
      }
    });
  }

  // Toggle seat selection if available and not booked
  toggleSeat(seatNumber: string): void {
    // Prevent selection if seat is booked, a booking is in progress, or booked seats are still loading
    if (this.isSeatBooked(seatNumber) || this.isBooking || this.isLoadingBookedSeats) {
      return;
    }

    const index = this.selectedSeats.indexOf(seatNumber);
    if (index > -1) {
      this.selectedSeats.splice(index, 1); // Deselect
    } else {
      this.selectedSeats.push(seatNumber); // Select
    }
    this.bookingError = null; // Clear error on seat change
  }

  // Check if a seat is currently selected by the user
  isSeatSelected(seatNumber: string): boolean {
    return this.selectedSeats.includes(seatNumber);
  }

  // Check if a seat was already booked (based on fetched data)
  isSeatBooked(seatNumber: string): boolean {
    return this.bookedSeats.includes(seatNumber);
  }

  // Method to confirm and create the booking
  confirmBooking(): void {
    if (this.selectedSeats.length === 0) {
      this.bookingError = "Please select at least one seat.";
      return;
    }
    // Ensure movie and showtime are available (should be due to ngOnInit check)
    if (!this.movie || !this.showtime) {
        this.bookingError = "Cannot proceed without movie details or showtime.";
        console.error("Confirm booking called without movie/showtime details.");
        return;
    }

    this.bookingError = null;
    this.isBooking = true; // Indicate booking process started

    const bookingData: BookingRequest = {
      movieId: this.movie.id,
      showtime: this.showtime,
      seats: this.selectedSeats
    };

    this.apiService.createBooking(bookingData).subscribe({
      next: (response) => {
        console.log('Booking successful:', response);
        // Navigate to confirmation page, passing booking ID via state
        this.router.navigate(['/booking-confirmation'], { state: { bookingId: response.bookingId } });
      },
      error: (err) => {
        console.error('Booking failed:', err);
        // Provide more specific error if available from backend
        this.bookingError = err?.error?.error || err.message || 'Failed to create booking. Please try again.';
        this.isBooking = false; // Re-enable buttons on error
      },
      complete: () => {
        // isBooking remains true on success because we navigate away
      }
    });
  }

  // Method to cancel and go back
  cancel(): void {
     // Navigate back to the movie details page using the movie ID
     if (this.movie) {
        this.router.navigate(['/movies', this.movie.id]);
     } else {
        this.router.navigate(['/']); // Fallback to home if movie ID is somehow lost
     }
  }
}