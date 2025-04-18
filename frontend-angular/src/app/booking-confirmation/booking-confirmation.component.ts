import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // Import CommonModule and DatePipe
import { Router, RouterLink } from '@angular/router'; // Import RouterLink
import { ApiService } from '../services/api.service';
import { Booking } from '../models/booking.model';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-booking-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe], // Add CommonModule, RouterLink, DatePipe
  templateUrl: './booking-confirmation.component.html',
  styleUrls: ['./booking-confirmation.component.css']
})
export class BookingConfirmationComponent implements OnInit {
  booking$: Observable<Booking | null> | undefined;
  error: string | null = null;
  loading = true;
  bookingId: number | null = null;

  private router = inject(Router);
  private apiService = inject(ApiService);

  constructor() {
    // Get state passed from navigation
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { bookingId: number };
    if (state?.bookingId) {
      this.bookingId = state.bookingId;
    }
  }

  ngOnInit(): void {
    if (!this.bookingId) {
      console.error("No booking ID found for confirmation.");
      this.error = "Booking ID is missing. Cannot display confirmation.";
      this.loading = false;
      // Optionally redirect: this.router.navigate(['/']);
      return;
    }

    this.loading = true;
    this.error = null;
    this.booking$ = this.apiService.getBookingById(this.bookingId).pipe(
      catchError(err => {
        this.error = err.message || 'Failed to load booking details.';
        this.loading = false;
        return of(null); // Return null on error
      })
    );

     // Track loading state completion
     this.booking$.subscribe({
        next: (booking) => { if(booking) this.loading = false },
        complete: () => { if(!this.error) this.loading = false },
        error: () => this.loading = false
    });
  }
}