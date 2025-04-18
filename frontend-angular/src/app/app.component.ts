import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // Import RouterOutlet and RouterLink

@Component({
  selector: 'app-root',
  standalone: true, // Make AppComponent standalone
  imports: [RouterOutlet], // Import necessary modules for standalone
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Movie Booking Angular';
}