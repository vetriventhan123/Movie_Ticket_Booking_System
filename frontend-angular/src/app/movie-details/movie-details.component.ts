import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; // Import RouterLink
import { ApiService } from '../services/api.service';
import { MovieDetail } from '../models/movie.model';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, RouterLink], // Add CommonModule and RouterLink
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit {
  movie$: Observable<MovieDetail | null> | undefined;
  error: string | null = null;
  loading = true;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(ApiService);

  ngOnInit(): void {
    this.loading = true;
    this.error = null;
    this.movie$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id || isNaN(+id)) {
          this.error = 'Invalid movie ID.';
          this.loading = false;
          return of(null); // Return null observable for invalid ID
        }
        return this.apiService.getMovieById(+id).pipe(
          catchError(err => {
            this.error = err.message || 'Failed to load movie details.';
            this.loading = false;
            return of(null); // Return null on error
          })
        );
      })
    );

     // Track loading state completion
     this.movie$.subscribe({
        next: (movie) => { if(movie) this.loading = false }, // Set loading false only if movie loaded
        complete: () => { if(!this.error) this.loading = false }, // Also set loading false on completion if no error occurred
        error: () => this.loading = false // Already handled in catchError
    });
  }

  selectShowtime(movie: MovieDetail, showtime: string): void {
    // Navigate to seat selection, passing data via state
    this.router.navigate(['/select-seats'], { state: { movie, showtime } });
  }

  goBack(): void {
    this.router.navigate(['/']); // Navigate back to the movie list
  }
}