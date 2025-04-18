import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { RouterLink } from '@angular/router'; // Import RouterLink
import { ApiService } from '../services/api.service';
import { Movie } from '../models/movie.model';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, RouterLink], // Add CommonModule and RouterLink
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit {
  movies$: Observable<Movie[]> | undefined;
  error: string | null = null;
  loading = true;

  private apiService = inject(ApiService); // Inject service

  ngOnInit(): void {
    this.loading = true;
    this.error = null;
    this.movies$ = this.apiService.getMovies().pipe(
      catchError(err => {
        this.error = err.message || 'Failed to load movies.';
        this.loading = false;
        return of([]); // Return empty array on error
      })
    );

    // Track loading state completion
    this.movies$.subscribe({
        complete: () => this.loading = false,
        error: () => this.loading = false // Already handled in catchError, but good practice
    });
  }
}