export interface Theatre {
  id: string;
  name: string;
  chain: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  screensCount: number;
  formats: string[]; // e.g. ['IMAX 3D', 'Dolby Cinema', '4DX', 'Prime 2D']
  distanceKm?: number;
}

export interface Movie {
  id: string;
  title: string;
  genre: string[];
  duration: string;
  rating: string;
  language: string;
  posterUrl: string;
  synopsis: string;
  releaseYear: number;
}

export interface ShowtimeSlot {
  id: string;
  time: string; // e.g. '04:15 PM'
  experience: string; // e.g. 'IMAX with Laser'
  screen: string;
}

export interface ResaleTicket {
  id: string;
  theatreId: string;
  theatreName: string;
  theatreCity: string;
  theatreAddress: string;
  movieId: string;
  movieTitle: string;
  moviePoster: string;
  movieGenre: string[];
  showtime: string;
  showDate: string; // e.g. 'Today, Sep 27'
  screen: string;
  section: string; // e.g. 'Prime Recliner', 'Balcony', 'Executive'
  seats: string[]; // e.g. ['G14', 'G15']
  quantity: number;
  originalPrice: number;
  resalePrice: number;
  sellerName: string;
  sellerContact: string;
  reason: string;
  bookingRef: string;
  verified: boolean;
  status: 'available' | 'sold';
  createdAt: string;
}

export interface UserLocationState {
  enabled: boolean;
  lat: number | null;
  lng: number | null;
  city: string;
  address: string;
  loading: boolean;
  error?: string | null;
}
