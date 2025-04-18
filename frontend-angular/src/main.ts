import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app/app-routing.module'; // Import routes

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Provide the routes
    provideHttpClient()    // Provide HttpClient
  ]
}).catch(err => console.error(err));