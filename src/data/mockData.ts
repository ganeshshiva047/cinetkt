import { Theatre, Movie, ResaleTicket } from '../types';

import heroImg from '../assets/images/hero_cinema_ambience_1790500685258.jpg';
import posterStarlight from '../assets/images/poster_starlight_odyssey_1790500698967.jpg';
import posterMidnight from '../assets/images/poster_midnight_protocol_1790500712251.jpg';
import posterClockwork from '../assets/images/poster_clockwork_kingdom_1790500727197.jpg';

export { heroImg, posterStarlight, posterMidnight, posterClockwork };

export const INITIAL_MOVIES: Movie[] = [
  {
    id: 'm1',
    title: 'Starlight Odyssey',
    genre: ['Sci-Fi', 'Adventure', 'IMAX'],
    duration: '2h 42m',
    rating: 'PG-13',
    language: 'English (Atmos)',
    posterUrl: posterStarlight,
    synopsis: 'A deep-space exploratory crew traverses an uncharted stellar nexus on the brink of gravitational collapse, searching for humanity’s last sanctuary.',
    releaseYear: 2026,
  },
  {
    id: 'm2',
    title: 'Midnight Protocol',
    genre: ['Neo-Noir', 'Thriller', 'Crime'],
    duration: '2h 18m',
    rating: 'R',
    language: 'English (5.1)',
    posterUrl: posterMidnight,
    synopsis: 'In a rain-drenched neon metropolis, a veteran detective uncovers a syndicate controlling digital memories before his own past is permanently deleted.',
    releaseYear: 2026,
  },
  {
    id: 'm3',
    title: 'The Clockwork Kingdom',
    genre: ['Animation', 'Fantasy', 'Family'],
    duration: '1h 52m',
    rating: 'PG',
    language: 'English (Dolby Atmos)',
    posterUrl: posterClockwork,
    synopsis: 'An ingenious apprentice clockmaker and a rogue mechanical automaton embark on a soaring quest across flying brass archipelagoes to rekindle the sun engine.',
    releaseYear: 2026,
  },
  {
    id: 'm4',
    title: 'Velocity Horizon',
    genre: ['Action', 'Motorsport', 'Drama'],
    duration: '2h 10m',
    rating: 'PG-13',
    language: 'English (Dolby Cinema)',
    posterUrl: posterStarlight,
    synopsis: 'Two rival endurance racers are forced to team up for the grueling 24-hour Trans-Continental rally across treacherous alpine passes.',
    releaseYear: 2026,
  },
];

export const INITIAL_THEATRES: Theatre[] = [
  // San Francisco / Bay Area Hub (Common dev server default)
  {
    id: 'th-sf-1',
    name: 'AMC Metreon 16 & IMAX',
    chain: 'AMC Theatres',
    address: '135 4th St #3000, Downtown',
    city: 'San Francisco',
    lat: 37.7842,
    lng: -122.4031,
    screensCount: 16,
    formats: ['IMAX 70mm', 'Dolby Cinema', 'Prime 3D'],
  },
  {
    id: 'th-sf-2',
    name: 'Alamo Drafthouse New Mission',
    chain: 'Alamo Drafthouse',
    address: '2550 Mission St, Mission District',
    city: 'San Francisco',
    lat: 37.7588,
    lng: -122.4189,
    screensCount: 5,
    formats: ['35mm Film', '4K Laser', 'Dine-In'],
  },
  {
    id: 'th-sf-3',
    name: 'Regal Stonestown Galleria ScreenX',
    chain: 'Regal Cinemas',
    address: '3251 20th Ave, Stonestown',
    city: 'San Francisco',
    lat: 37.7275,
    lng: -122.4764,
    screensCount: 12,
    formats: ['ScreenX 270°', 'RPX', 'Recliner Luxury'],
  },
  {
    id: 'th-sf-4',
    name: 'Century San Francisco Centre 9',
    chain: 'Cinemark',
    address: '845 Market St #500, Market St',
    city: 'San Francisco',
    lat: 37.7847,
    lng: -122.4067,
    screensCount: 9,
    formats: ['Cinemark XD', 'D-BOX Motion', 'RealD 3D'],
  },
  {
    id: 'th-sf-5',
    name: 'Landmark Embarcadero Center Cinema',
    chain: 'Landmark',
    address: '1 Embarcadero Ctr, Financial Dist',
    city: 'San Francisco',
    lat: 37.7951,
    lng: -122.3995,
    screensCount: 7,
    formats: ['Laser Projection', 'Curated Sound', 'Bar & Lounge'],
  },

  // New York City Hub
  {
    id: 'th-nyc-1',
    name: 'AMC Lincoln Square 13 & IMAX',
    chain: 'AMC Theatres',
    address: '1998 Broadway, Upper West Side',
    city: 'New York',
    lat: 40.7738,
    lng: -73.9818,
    screensCount: 13,
    formats: ['IMAX Dual Laser', 'Dolby Cinema', 'RealD 3D'],
  },
  {
    id: 'th-nyc-2',
    name: 'Regal Times Square 4DX',
    chain: 'Regal Cinemas',
    address: '247 W 42nd St, Times Square',
    city: 'New York',
    lat: 40.7565,
    lng: -73.9892,
    screensCount: 14,
    formats: ['4DX Motion & Effects', 'RPX', 'VIP Recliners'],
  },
  {
    id: 'th-nyc-3',
    name: 'Alamo Drafthouse Downtown Brooklyn',
    chain: 'Alamo Drafthouse',
    address: '445 Albee Square W, Brooklyn',
    city: 'New York',
    lat: 40.6908,
    lng: -73.9835,
    screensCount: 7,
    formats: ['Laser 4K', 'Dolby Atmos', 'Craft Kitchen'],
  },

  // Los Angeles Hub
  {
    id: 'th-la-1',
    name: 'TCL Chinese Theatre IMAX',
    chain: 'Independent Historic',
    address: '6925 Hollywood Blvd, Hollywood',
    city: 'Los Angeles',
    lat: 34.1022,
    lng: -118.3409,
    screensCount: 8,
    formats: ['IMAX Laser Grand Hall', 'Dolby Atmos', 'Historic VIP'],
  },
  {
    id: 'th-la-2',
    name: 'AMC Century City 15',
    chain: 'AMC Theatres',
    address: '10250 Santa Monica Blvd, Century City',
    city: 'Los Angeles',
    lat: 34.0594,
    lng: -118.4195,
    screensCount: 15,
    formats: ['Dolby Cinema', 'Prime', 'MacGuffins Bar'],
  },

  // London Hub
  {
    id: 'th-lon-1',
    name: 'BFI IMAX Waterloo',
    chain: 'BFI Cinema',
    address: '1 Charlie Chaplin Walk, South Bank',
    city: 'London',
    lat: 51.5036,
    lng: -0.1136,
    screensCount: 1,
    formats: ['12-Channel IMAX with Laser', '70mm Projection'],
  },
  {
    id: 'th-lon-2',
    name: 'Odeon Luxe Leicester Square',
    chain: 'Odeon Luxe',
    address: '24-26 Leicester Square, West End',
    city: 'London',
    lat: 51.5103,
    lng: -0.1303,
    screensCount: 5,
    formats: ['Dolby Cinema Luxe', 'Power Recliners', 'Oscar Bar'],
  },

  // Mumbai Hub
  {
    id: 'th-mum-1',
    name: 'PVR INOX Maison IMAX Jio World Drive',
    chain: 'PVR INOX',
    address: 'BKC Bandra East',
    city: 'Mumbai',
    lat: 19.0664,
    lng: 72.8688,
    screensCount: 6,
    formats: ['Laser IMAX', 'LUXE Dine-in', 'Dolby Atmos'],
  },
  {
    id: 'th-mum-2',
    name: 'PVR Phoenix Palladium 4DX & Gold',
    chain: 'PVR INOX',
    address: '462 Senapati Bapat Marg, Lower Parel',
    city: 'Mumbai',
    lat: 18.9953,
    lng: 72.8251,
    screensCount: 7,
    formats: ['4DX', 'PVR Gold Class', 'Atmos'],
  }
];

export const STANDARD_SHOWTIMES = [
  '11:15 AM',
  '01:45 PM',
  '04:30 PM',
  '07:15 PM',
  '10:00 PM',
];

export const INITIAL_TICKETS: ResaleTicket[] = [
  {
    id: 'tkt-101',
    theatreId: 'th-sf-1',
    theatreName: 'AMC Metreon 16 & IMAX',
    theatreCity: 'San Francisco',
    theatreAddress: '135 4th St #3000, Downtown',
    movieId: 'm1',
    movieTitle: 'Starlight Odyssey',
    moviePoster: posterStarlight,
    movieGenre: ['Sci-Fi', 'Adventure', 'IMAX'],
    showtime: '07:15 PM',
    showDate: 'Tonight, Sep 27',
    screen: 'Auditorium 1 (IMAX Laser)',
    section: 'Center Prime Balcony',
    seats: ['F14', 'F15'],
    quantity: 2,
    originalPrice: 28,
    resalePrice: 19,
    sellerName: 'Marcus Chen',
    sellerContact: 'marcus.c@gmail.com',
    reason: 'Caught urgent late client review at work, cannot make the 7 PM show!',
    bookingRef: 'AMC-782914-SF',
    verified: true,
    status: 'available',
    createdAt: '25 mins ago',
  },
  {
    id: 'tkt-102',
    theatreId: 'th-sf-1',
    theatreName: 'AMC Metreon 16 & IMAX',
    theatreCity: 'San Francisco',
    theatreAddress: '135 4th St #3000, Downtown',
    movieId: 'm2',
    movieTitle: 'Midnight Protocol',
    moviePoster: posterMidnight,
    movieGenre: ['Neo-Noir', 'Thriller'],
    showtime: '04:30 PM',
    showDate: 'Today, Sep 27',
    screen: 'Auditorium 4 (Dolby Cinema)',
    section: 'Dolby Recliner',
    seats: ['D10'],
    quantity: 1,
    originalPrice: 25,
    resalePrice: 15,
    sellerName: 'Elena Rostova',
    sellerContact: 'elena.rostova@designlab.io',
    reason: 'Bought an extra single seat for a colleague who couldn’t travel into the city.',
    bookingRef: 'AMC-441029-SF',
    verified: true,
    status: 'available',
    createdAt: '40 mins ago',
  },
  {
    id: 'tkt-103',
    theatreId: 'th-sf-2',
    theatreName: 'Alamo Drafthouse New Mission',
    theatreCity: 'San Francisco',
    theatreAddress: '2550 Mission St, Mission District',
    movieId: 'm2',
    movieTitle: 'Midnight Protocol',
    moviePoster: posterMidnight,
    movieGenre: ['Neo-Noir', 'Thriller'],
    showtime: '07:15 PM',
    showDate: 'Tonight, Sep 27',
    screen: 'Theater 1 (Historic Balcony)',
    section: 'Dine-In Table Seats',
    seats: ['C4', 'C5'],
    quantity: 2,
    originalPrice: 22,
    resalePrice: 16,
    sellerName: 'David Kim',
    sellerContact: 'dkim.sf@gmail.com',
    reason: 'Flight back into SFO was delayed by 3 hours due to coastal fog.',
    bookingRef: 'ALAMO-88301-SF',
    verified: true,
    status: 'available',
    createdAt: '1 hour ago',
  },
  {
    id: 'tkt-104',
    theatreId: 'th-sf-4',
    theatreName: 'Century San Francisco Centre 9',
    theatreCity: 'San Francisco',
    theatreAddress: '845 Market St #500, Market St',
    movieId: 'm3',
    movieTitle: 'The Clockwork Kingdom',
    moviePoster: posterClockwork,
    movieGenre: ['Animation', 'Fantasy'],
    showtime: '01:45 PM',
    showDate: 'Today, Sep 27',
    screen: 'Auditorium 3 (Cinemark XD)',
    section: 'Luxury Lounger Center',
    seats: ['E8', 'E9', 'E10'],
    quantity: 3,
    originalPrice: 20,
    resalePrice: 13,
    sellerName: 'Sarah Jenkins',
    sellerContact: 'sjenkins.family@yahoo.com',
    reason: 'Kids soccer tournament ran into overtime playoffs. Great seats for a family!',
    bookingRef: 'CNMK-55921-SF',
    verified: true,
    status: 'available',
    createdAt: '15 mins ago',
  },
  {
    id: 'tkt-105',
    theatreId: 'th-sf-3',
    theatreName: 'Regal Stonestown Galleria ScreenX',
    theatreCity: 'San Francisco',
    theatreAddress: '3251 20th Ave, Stonestown',
    movieId: 'm1',
    movieTitle: 'Starlight Odyssey',
    moviePoster: posterStarlight,
    movieGenre: ['Sci-Fi', 'Adventure'],
    showtime: '10:00 PM',
    showDate: 'Tonight, Sep 27',
    screen: 'ScreenX 270° Auditorium',
    section: 'VIP Recliner Row H',
    seats: ['H12', 'H13'],
    quantity: 2,
    originalPrice: 26,
    resalePrice: 18,
    sellerName: 'Liam O’Connor',
    sellerContact: 'liam.oc@outlook.com',
    reason: 'Wife came down with a bad cold, letting these go for cheap rather than wasted.',
    bookingRef: 'REGAL-19034-SF',
    verified: true,
    status: 'available',
    createdAt: '2 hours ago',
  },
  {
    id: 'tkt-106',
    theatreId: 'th-nyc-1',
    theatreName: 'AMC Lincoln Square 13 & IMAX',
    theatreCity: 'New York',
    theatreAddress: '1998 Broadway, Upper West Side',
    movieId: 'm1',
    movieTitle: 'Starlight Odyssey',
    moviePoster: posterStarlight,
    movieGenre: ['Sci-Fi', 'IMAX'],
    showtime: '07:15 PM',
    showDate: 'Tonight, Sep 27',
    screen: 'IMAX 70mm Laser Screen',
    section: 'Row K Sweet Spot',
    seats: ['K18', 'K19'],
    quantity: 2,
    originalPrice: 32,
    resalePrice: 22,
    sellerName: 'Jordan Vance',
    sellerContact: 'jvance.nyc@gmail.com',
    reason: 'Unexpected subway line maintenance will make getting uptown in time impossible.',
    bookingRef: 'AMC-NYC-99382',
    verified: true,
    status: 'available',
    createdAt: '50 mins ago',
  },
];

// Haversine formula to compute geodesic distance in Kilometers
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Preset quick locations for simulator/fallback
export const PRESET_LOCATIONS = [
  { name: 'Downtown San Francisco', lat: 37.7842, lng: -122.4031, city: 'San Francisco' },
  { name: 'Mission District, SF', lat: 37.7588, lng: -122.4189, city: 'San Francisco' },
  { name: 'Times Square, New York', lat: 40.7580, lng: -73.9855, city: 'New York' },
  { name: 'Hollywood, Los Angeles', lat: 34.1016, lng: -118.3333, city: 'Los Angeles' },
  { name: 'Central London, UK', lat: 51.5074, lng: -0.1278, city: 'London' },
  { name: 'Bandra / BKC, Mumbai', lat: 19.0600, lng: 72.8600, city: 'Mumbai' },
];

const LOCAL_STORAGE_KEY = 'cinepass_resale_tickets_v1';

export function loadTickets(): ResaleTicket[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_TICKETS));
      return INITIAL_TICKETS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_TICKETS;
  } catch {
    return INITIAL_TICKETS;
  }
}

export function saveTicket(newTicket: ResaleTicket): void {
  const current = loadTickets();
  const updated = [newTicket, ...current];
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

export function markTicketAsSold(ticketId: string): void {
  const current = loadTickets();
  const updated = current.map(t => (t.id === ticketId ? { ...t, status: 'sold' as const } : t));
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update ticket status', e);
  }
}
