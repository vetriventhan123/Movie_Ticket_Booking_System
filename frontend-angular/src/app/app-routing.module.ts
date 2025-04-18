import { Routes } from '@angular/router';
import { MovieListComponent } from './movie-list/movie-list.component';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { SeatSelectionComponent } from './seat-selection/seat-selection.component';
import { BookingConfirmationComponent } from './booking-confirmation/booking-confirmation.component';

export const routes: Routes = [
  { path: '', component: MovieListComponent, title: 'Movies' }, // Home route
  { path: 'movies/:id', component: MovieDetailsComponent, title: 'Movie Details' },
  // Seat selection will rely on state passed via navigation, not URL params
  { path: 'select-seats', component: SeatSelectionComponent, title: 'Select Seats' },
  // Confirmation will rely on state passed via navigation
  { path: 'booking-confirmation', component: BookingConfirmationComponent, title: 'Booking Confirmation' },
  // Wildcard route for a 404 page
  { path: '**', redirectTo: '', pathMatch: 'full' } // Redirect unknown paths to home
];