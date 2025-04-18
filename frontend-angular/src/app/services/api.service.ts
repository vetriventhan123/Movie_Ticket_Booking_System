
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Movie, MovieDetail } from '../models/movie.model'; // Assuming MovieDetail includes showtimes etc.
import { Booking, BookingRequest, BookingConfirmation } from '../models/booking.model';

@Injectable({
  providedIn: 'root' // Service available application-wide
})
export class ApiService {
  private apiUrl = environment.apiUrl; // Get API URL from environment

  constructor(private http: HttpClient) { }

  // Fetch all movies (basic info)
  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/movies`)
      .pipe(catchError(this.handleError));
  }

  // Fetch details for a single movie
  getMovieById(id: number): Observable<MovieDetail> {
    return this.http.get<MovieDetail>(`${this.apiUrl}/movies/${id}`)
      .pipe(catchError(this.handleError));
  }
  getBookedSeats(movieId: number, showtime: string): Observable<string[]> {
    const params = new HttpParams()
      .set('movieId', movieId.toString())
      .set('showtime', showtime);
    return this.http.get<string[]>(`${this.apiUrl}/bookings/booked-seats`, { params });
  }

  // Create a new booking
  createBooking(bookingData: BookingRequest): Observable<BookingConfirmation> {
    return this.http.post<BookingConfirmation>(`${this.apiUrl}/bookings`, bookingData)
      .pipe(catchError(this.handleError));
  }

  // Get details of a specific booking
  getBookingById(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/bookings/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Basic error handling
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      errorMessage = `Server returned code ${error.status}, error message is: ${error.message}`;
      if (error.error && typeof error.error === 'object' && error.error.error) {
         errorMessage = error.error.error; // Use backend's error message if available
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage)); // Return an observable error
  }
}