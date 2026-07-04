export type Genre =
  | "Action"
  | "Comedy"
  | "Horror"
  | "Drama"
  | "Thriller"
  | "Sci-Fi"
  | "Romance"
  | "Animation"
  | "Documentary"
  | "Adventure"
  | "Fantasy"
  | "Mystery";

export interface Movie {
  id: string;
  title: string;
  description: string;
  poster: string;
  backdrop: string;
  videoUrl: string;
  genres: Genre[];
  runtime: number; // minutes
  rating: number; // 0-10
  year: number;
  cast: string[];
  director: string;
  trending?: boolean;
  newRelease?: boolean;
  popular?: boolean;
  recommended?: boolean;
}

export interface WatchProgress {
  movieId: string;
  currentTime: number;
  duration: number;
  percent: number;
  updatedAt: number;
}
