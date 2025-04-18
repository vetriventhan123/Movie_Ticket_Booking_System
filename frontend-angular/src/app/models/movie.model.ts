export interface Movie {
    id: number;
    title: string;
    duration?: number; // Optional as it might not be in the list view
    rating?: string;   // Optional
  }
  
  export interface MovieDetail extends Movie {
    description?: string;
    showtimes: string[]; // Expecting an array of strings from backend
  }