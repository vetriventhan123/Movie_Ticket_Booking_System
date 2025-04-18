// This file is needed if you are NOT using standalone components everywhere
// For standalone components bootstrapped in main.ts, this might not be strictly necessary
// but is often kept for organizing imports or future non-standalone components.

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { RouterModule } from '@angular/router'; // Import RouterModule

import { routes } from './app-routing.module'; // Import routes
import { AppComponent } from './app.component';
import { MovieListComponent } from './movie-list/movie-list.component';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { SeatSelectionComponent } from './seat-selection/seat-selection.component';
import { BookingConfirmationComponent } from './booking-confirmation/booking-confirmation.component';
// ApiService is provided in root via @Injectable

@NgModule({
  declarations: [
    // Added here because it is not standalone
    // AppComponent, // AppComponent is standalone now
    // MovieListComponent, // Standalone
    // MovieDetailsComponent, // Standalone
    // BookingConfirmationComponent // Standalone
    // If components were not standalone, declare them here
  ],
  imports: [
    BrowserModule,
    HttpClientModule, // Add HttpClientModule here
    RouterModule.forRoot(routes), // Configure routing
    // Import standalone components if needed for non-standalone modules
    AppComponent,
    SeatSelectionComponent,
    MovieListComponent,
    MovieDetailsComponent,
    BookingConfirmationComponent
  ],
  providers: [
    // Services provided in root don't need to be listed here
  ],
  // bootstrap: [AppComponent] // Bootstrap is handled in main.ts for standalone
})
export class AppModule { }