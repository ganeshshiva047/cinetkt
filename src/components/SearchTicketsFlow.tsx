import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Search, 
  Film, 
  Clock, 
  Ticket as TicketIcon, 
  Sparkles, 
  ChevronRight, 
  ArrowLeft, 
  ShieldCheck, 
  Compass, 
  Bell, 
  Check, 
  Navigation,
  Building2
} from 'lucide-react';
import { Theatre, Movie, ResaleTicket, UserLocationState } from '../types';
import { STANDARD_SHOWTIMES } from '../data/mockData';
import { TicketDetailsModal } from './TicketDetailsModal';

interface SearchTicketsFlowProps {
  theatres: Theatre[];
  movies: Movie[];
  tickets: ResaleTicket[];
  locationState: UserLocationState;
  onOpenLocationModal: () => void;
  onDetectGPS: () => void;
  onSelectTicketToBuy: (ticket: ResaleTicket) => void;
  onSwitchToSell: () => void;
}

export const SearchTicketsFlow: React.FC<SearchTicketsFlowProps> = ({
  theatres,
  movies,
  tickets,
  locationState,
  onOpenLocationModal,
  onDetectGPS,
  onSelectTicketToBuy,
  onSwitchToSell,
}) => {
  // Step state: 1 = Location, 2 = Theatre, 3 = Movie, 4 = Time, 5 = Available Tickets
  const [selectedTheatreId, setSelectedTheatreId] = useState<string | null>(null);
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('All');
  const [activeTicketModal, setActiveTicketModal] = useState<ResaleTicket | null>(null);
  const [alertSetMessage, setAlertSetMessage] = useState<string | null>(null);
  const [theatreSearchQuery, setTheatreSearchQuery] = useState('');

  // Selected entities
  const selectedTheatre = useMemo(
    () => theatres.find((t) => t.id === selectedTheatreId) || null,
    [theatres, selectedTheatreId]
  );

  const selectedMovie = useMemo(
    () => movies.find((m) => m.id === selectedMovieId) || null,
    [movies, selectedMovieId]
  );

  // Filtered theatres based on search query
  const filteredTheatres = useMemo(() => {
    if (!theatreSearchQuery.trim()) return theatres;
    const q = theatreSearchQuery.toLowerCase();
    return theatres.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.city.toLowerCase().includes(q) ||
        t.address.toLowerCase().includes(q) ||
        t.chain.toLowerCase().includes(q)
    );
  }, [theatres, theatreSearchQuery]);

  // Current active tickets for selection
  const availableTickets = useMemo(() => {
    return tickets.filter((t) => {
      if (t.status !== 'available') return false;
      if (selectedTheatreId && t.theatreId !== selectedTheatreId) return false;
      if (selectedMovieId && t.movieId !== selectedMovieId) return false;
      if (selectedTime !== 'All' && !t.showtime.includes(selectedTime)) return false;
      return true;
    });
  }, [tickets, selectedTheatreId, selectedMovieId, selectedTime]);

  // Determine current active step (1 to 5)
  const currentStep = !locationState.enabled
    ? 1
    : !selectedTheatreId
    ? 2
    : !selectedMovieId
    ? 3
    : 4; // If theatre and movie are selected, time & ticket results are visible in step 4/5

  const handleSetAlert = () => {
    setAlertSetMessage('Alert activated! We will notify you the moment someone lists a ticket for this show.');
    setTimeout(() => setAlertSetMessage(null), 4000);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Breadcrumb Steps Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold tracking-wider text-amber-500 uppercase">
              Buyer Journey
            </div>
            <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
              Search Spare Cinema Tickets
            </h1>
          </div>
          
          <button
            onClick={onSwitchToSell}
            className="hidden sm:flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-xs font-medium text-neutral-300 hover:border-amber-500/50 hover:text-white transition-colors"
          >
            <span>Have a spare ticket?</span>
            <span className="text-amber-400 font-semibold">Sell online →</span>
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="mt-6 flex items-center justify-between border-b border-neutral-800 pb-4 overflow-x-auto text-xs">
          <button
            onClick={() => {
              if (selectedTheatreId) setSelectedTheatreId(null);
            }}
            className={`flex items-center gap-2 whitespace-nowrap px-2 py-1 ${
              locationState.enabled ? 'text-emerald-400 font-medium' : 'text-amber-400 font-bold'
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-800 text-[11px]">
              {locationState.enabled ? '✓' : '1'}
            </span>
            <span>Turn ON Location</span>
          </button>

          <span className="text-neutral-700">/</span>

          <button
            onClick={() => {
              setSelectedTheatreId(null);
              setSelectedMovieId(null);
            }}
            disabled={!locationState.enabled}
            className={`flex items-center gap-2 whitespace-nowrap px-2 py-1 ${
              selectedTheatre
                ? 'text-emerald-400 font-medium'
                : currentStep === 2
                ? 'text-amber-400 font-bold'
                : 'text-neutral-500'
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-800 text-[11px]">
              {selectedTheatre ? '✓' : '2'}
            </span>
            <span>{selectedTheatre ? selectedTheatre.name.slice(0, 16) + '...' : 'Select Theatre'}</span>
          </button>

          <span className="text-neutral-700">/</span>

          <button
            onClick={() => setSelectedMovieId(null)}
            disabled={!selectedTheatreId}
            className={`flex items-center gap-2 whitespace-nowrap px-2 py-1 ${
              selectedMovie
                ? 'text-emerald-400 font-medium'
                : currentStep === 3
                ? 'text-amber-400 font-bold'
                : 'text-neutral-500'
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-800 text-[11px]">
              {selectedMovie ? '✓' : '3'}
            </span>
            <span>{selectedMovie ? selectedMovie.title : 'Select Movie'}</span>
          </button>

          <span className="text-neutral-700">/</span>

          <span
            className={`flex items-center gap-2 whitespace-nowrap px-2 py-1 ${
              selectedTheatreId && selectedMovieId ? 'text-amber-400 font-bold' : 'text-neutral-500'
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-800 text-[11px]">
              4
            </span>
            <span>Show Time & Available Tickets</span>
          </span>
        </div>
      </div>

      {/* STEP 1: Turn ON Location (Prompt if not enabled) */}
      {!locationState.enabled && (
        <div className="mb-10 rounded-3xl border border-cyan-500/40 bg-gradient-to-br from-cyan-950/40 via-[#07070f] to-blue-950/30 p-6 sm:p-8 text-center shadow-[0_0_35px_rgba(6,182,212,0.2)] backdrop-blur-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] mb-4">
            <MapPin className="h-7 w-7 animate-bounce drop-shadow-[0_0_8px_#22d3ee]" />
          </div>
          <h2 className="font-display text-xl font-bold text-white sm:text-2xl">
            Step 1: Turn ON Location to find nearby theatres
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-neutral-300">
            CinePass matches you with cinema halls within walking and driving distance so you can grab a spare ticket before showtime starts!
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onDetectGPS}
              disabled={locationState.loading}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 text-sm font-extrabold text-black hover:from-cyan-300 hover:to-blue-400 transition-all shadow-[0_0_20px_rgba(34,211,238,0.6)]"
            >
              <Navigation className="h-4 w-4" />
              <span>{locationState.loading ? 'Detecting GPS...' : 'Enable Current GPS Location'}</span>
            </button>

            <button
              onClick={onOpenLocationModal}
              className="rounded-xl border border-cyan-500/30 bg-neutral-900/80 px-5 py-3 text-sm font-semibold text-cyan-200 hover:border-cyan-400 hover:bg-neutral-800 transition-colors"
            >
              Choose City / Metro Area
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Select Nearby Theatre (Visible once location enabled, or if no theatre chosen) */}
      {locationState.enabled && !selectedTheatreId && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase">
                <Compass className="h-4 w-4" />
                <span>Detected near {locationState.city || 'Your Location'}</span>
              </div>
              <h2 className="font-display text-xl font-bold text-white sm:text-2xl mt-1">
                Select your nearby theatre
              </h2>
              <p className="text-xs text-neutral-400">
                Sorted by closest distance to you. Pick where you want to watch the movie.
              </p>
            </div>

            <div className="w-full sm:w-72">
              <input
                type="text"
                placeholder="Search cinema by name..."
                value={theatreSearchQuery}
                onChange={(e) => setTheatreSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-xs text-white placeholder-neutral-400 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Theatres Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTheatres.map((theatre) => {
              const activeCount = tickets.filter(
                (t) => t.theatreId === theatre.id && t.status === 'available'
              ).length;

              return (
                <div
                  key={theatre.id}
                  onClick={() => setSelectedTheatreId(theatre.id)}
                  className="group relative cursor-pointer rounded-2xl border border-cyan-500/25 bg-[#090912]/85 p-5 transition-all hover:border-cyan-400 hover:bg-[#0c0c17] hover:shadow-[0_0_25px_rgba(6,182,212,0.35)] text-left backdrop-blur-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="rounded-lg bg-neutral-900 border border-neutral-800 px-2 py-0.5 text-[11px] font-semibold text-neutral-300">
                      {theatre.chain}
                    </div>
                    {theatre.distanceKm !== undefined && (
                      <span className="font-mono text-xs font-bold text-cyan-400 tabular-nums drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]">
                        {theatre.distanceKm} km away
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-base font-bold text-white group-hover:text-cyan-300 transition-colors mt-2.5">
                    {theatre.name}
                  </h3>

                  <p className="text-xs text-neutral-400 mt-1 line-clamp-1">
                    {theatre.address}, {theatre.city}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] text-neutral-400">
                    {theatre.formats.map((f) => (
                      <span key={f} className="rounded bg-black/70 px-1.5 py-0.5 border border-cyan-500/20 text-cyan-200">
                        {f}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-neutral-800/80 pt-3 text-xs">
                    <span className="text-neutral-400">
                      {activeCount > 0 ? (
                        <strong className="text-cyan-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.4)]">{activeCount} spare ticket{activeCount > 1 ? 's' : ''} available</strong>
                      ) : (
                        <span className="text-neutral-400">Check showtimes</span>
                      )}
                    </span>
                    <span className="flex items-center text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
                      Select <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 3: Select Movie/Show (When Theatre is selected, but movie is not) */}
      {selectedTheatre && !selectedMovieId && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedTheatreId(null)}
              className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Theatres</span>
            </button>
            <div className="text-xs text-neutral-400">
              Selected: <strong className="text-white">{selectedTheatre.name}</strong> ({selectedTheatre.distanceKm} km away)
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wide">
              Step 3: Select Movie
            </div>
            <h2 className="font-display text-xl font-bold text-white sm:text-2xl mt-1">
              What do you want to watch at {selectedTheatre.name}?
            </h2>
            <p className="text-xs text-neutral-400">
              Select any movie to inspect available resale tickets and show timings.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {movies.map((movie) => {
              const ticketsForMovie = tickets.filter(
                (t) =>
                  t.theatreId === selectedTheatre.id &&
                  t.movieId === movie.id &&
                  t.status === 'available'
              );

              return (
                <div
                  key={movie.id}
                  onClick={() => setSelectedMovieId(movie.id)}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 transition-all hover:border-amber-500/80 hover:shadow-2xl hover:shadow-amber-500/15 text-left"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-950">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent" />
                    
                    <div className="absolute top-3 left-3 rounded-md bg-neutral-950/80 px-2 py-0.5 text-[11px] font-bold text-amber-400 border border-neutral-800">
                      {movie.rating}
                    </div>

                    {ticketsForMovie.length > 0 && (
                      <div className="absolute top-3 right-3 rounded-full bg-emerald-500 px-2.5 py-0.5 text-xs font-bold text-black shadow-lg">
                        {ticketsForMovie.length} Ticket{ticketsForMovie.length > 1 ? 's' : ''} Ready!
                      </div>
                    )}

                    <div className="absolute bottom-3 left-4 right-4">
                      <div className="text-xs text-neutral-300 font-medium">
                        {movie.genre.join(' · ')}
                      </div>
                      <h3 className="font-display text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                        {movie.title}
                      </h3>
                      <div className="text-xs text-neutral-400">{movie.duration} · {movie.language}</div>
                    </div>
                  </div>

                  <div className="p-4 border-t border-neutral-800/80 flex items-center justify-between">
                    <span className="text-xs text-neutral-400">
                      {ticketsForMovie.length > 0 ? (
                        <span className="text-emerald-400 font-medium">
                          From ${Math.min(...ticketsForMovie.map((t) => t.resalePrice))}
                        </span>
                      ) : (
                        'Select to see showtimes'
                      )}
                    </span>
                    <span className="text-xs font-semibold text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      View Tickets <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 4 & 5: Select Show Time & Available Tickets View */}
      {selectedTheatre && selectedMovie && (
        <div className="space-y-8">
          {/* Back buttons / context pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-4">
            <button
              onClick={() => setSelectedMovieId(null)}
              className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Movies</span>
            </button>
            <div className="flex items-center gap-3 text-xs text-neutral-300">
              <span>Theatre: <strong className="text-white">{selectedTheatre.name}</strong></span>
              <span>·</span>
              <span>Movie: <strong className="text-amber-400">{selectedMovie.title}</strong></span>
            </div>
          </div>

          {/* Movie Banner Strip */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
            <img
              src={selectedMovie.posterUrl}
              alt={selectedMovie.title}
              referrerPolicy="no-referrer"
              className="h-20 w-14 rounded-lg object-cover border border-neutral-700 shrink-0"
            />
            <div className="flex-1 text-left">
              <h3 className="font-display text-xl font-bold text-white">
                {selectedMovie.title}
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                {selectedMovie.duration} · {selectedMovie.genre.join(', ')} · Rated {selectedMovie.rating}
              </p>
              <p className="text-xs text-neutral-300 mt-1 line-clamp-1">
                {selectedMovie.synopsis}
              </p>
            </div>
          </div>

          {/* STEP 4: Select Show Time */}
          <div className="text-left space-y-3">
            <div>
              <div className="text-xs font-semibold text-amber-400 uppercase tracking-wide">
                Step 4: Select Show Time
              </div>
              <h3 className="font-display text-lg font-bold text-white">
                Filter by Screening Time
              </h3>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => setSelectedTime('All')}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  selectedTime === 'All'
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.6)]'
                    : 'border border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-cyan-500/50'
                }`}
              >
                All Timings
              </button>
              {STANDARD_SHOWTIMES.map((time) => {
                const countForTime = tickets.filter(
                  (t) =>
                    t.theatreId === selectedTheatre.id &&
                    t.movieId === selectedMovie.id &&
                    t.showtime.includes(time) &&
                    t.status === 'available'
                ).length;

                return (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                      selectedTime === time
                        ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.6)]'
                        : 'border border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-cyan-500/50'
                    }`}
                  >
                    <Clock className="h-3.5 w-3.5" />
                    <span>{time}</span>
                    {countForTime > 0 && (
                      <span className={`ml-1 rounded-full px-1.5 text-[10px] ${selectedTime === time ? 'bg-black text-cyan-300' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'}`}>
                        {countForTime}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 5: Available Tickets? YES -> Tap Ticket */}
          <div className="text-left space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-cyan-400 uppercase tracking-wide drop-shadow-[0_0_6px_rgba(34,211,238,0.6)]">
                  Step 5: Available Tickets
                </div>
                <h3 className="font-display text-xl font-bold text-white">
                  {availableTickets.length > 0
                    ? `Available Spare Tickets (${availableTickets.length})`
                    : 'No Spare Tickets For This Slot'}
                </h3>
              </div>
              {availableTickets.length > 0 && (
                <div className="text-xs text-cyan-300/80">
                  Tap any ticket to inspect seats & buy
                </div>
              )}
            </div>

            {/* Alert banner if simulated */}
            {alertSetMessage && (
              <div className="flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-950/40 p-3 text-xs text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
                <Check className="h-4 w-4 shrink-0 text-cyan-400" />
                <span>{alertSetMessage}</span>
              </div>
            )}

            {/* If Tickets are Available: Render list */}
            {availableTickets.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {availableTickets.map((ticket) => {
                  const savings = ticket.originalPrice - ticket.resalePrice;

                  return (
                    <div
                      key={ticket.id}
                      onClick={() => setActiveTicketModal(ticket)}
                      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-cyan-500/30 bg-[#090912]/90 p-5 transition-all hover:border-cyan-400 hover:bg-[#0c0c17] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] active:scale-99 text-left backdrop-blur-sm"
                    >
                      {/* Top row: Screen & Verified Badge */}
                      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
                        <div className="flex items-center gap-1.5 text-xs text-cyan-200 font-medium">
                          <TicketIcon className="h-4 w-4 text-cyan-400 drop-shadow-[0_0_4px_#22d3ee]" />
                          <span>{ticket.screen}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-cyan-300 font-semibold bg-cyan-950/60 px-2.5 py-0.5 rounded-md border border-cyan-400/40 shadow-[0_0_8px_rgba(34,211,238,0.3)]">
                          <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                          <span>Verified Seller</span>
                        </div>
                      </div>

                      {/* Middle row: Timing and Seats */}
                      <div className="my-3 flex items-start justify-between">
                        <div>
                          <div className="text-xs text-neutral-400">Showtime & Date</div>
                          <div className="font-display text-base font-bold text-white mt-0.5">
                            {ticket.showtime} · {ticket.showDate}
                          </div>
                          <div className="mt-1 text-xs text-amber-400 font-semibold drop-shadow-[0_0_4px_rgba(251,191,36,0.5)]">
                            {ticket.section}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs text-neutral-400">Seats Reserved</div>
                          <div className="font-mono text-base font-bold text-white mt-0.5">
                            {ticket.seats.join(', ')}
                          </div>
                          <div className="text-[11px] text-neutral-400">
                            {ticket.quantity} ticket{ticket.quantity > 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>

                      {/* Seller Reason snippet */}
                      <div className="rounded-xl bg-black/60 p-2.5 text-xs text-neutral-300 italic border border-neutral-800/80 line-clamp-1">
                        "{ticket.reason}"
                      </div>

                      {/* Bottom Pricing & Tap Prompt */}
                      <div className="mt-4 flex items-center justify-between border-t border-neutral-800/80 pt-3">
                        <div className="flex items-baseline gap-2">
                          <span className="font-display text-2xl font-extrabold text-cyan-400 tabular-nums drop-shadow-[0_0_10px_rgba(34,211,238,0.7)]">
                            ${ticket.resalePrice}
                          </span>
                          <span className="text-xs text-neutral-500 line-through tabular-nums">
                            ${ticket.originalPrice}
                          </span>
                          {savings > 0 && (
                            <span className="text-[11px] text-cyan-300 font-bold">
                              (Save ${savings})
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-xs font-extrabold text-black transition-all hover:from-cyan-300 hover:to-blue-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                        >
                          <span>Tap Ticket</span>
                          <ChevronRight className="h-3.5 w-3.5 stroke-[2.5]" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* If No tickets available for that specific showtime */
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-800 text-neutral-400 mb-3">
                  <TicketIcon className="h-6 w-6" />
                </div>
                <h4 className="font-display text-lg font-bold text-white">
                  No tickets listed for this specific time slot
                </h4>
                <p className="mx-auto mt-1 max-w-md text-xs text-neutral-400">
                  Nobody has listed a spare ticket for {selectedTime !== 'All' ? selectedTime : 'this movie'} yet. You can set a real-time alert or switch showtimes.
                </p>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={handleSetAlert}
                    className="flex items-center gap-1.5 rounded-xl border border-amber-500/50 bg-amber-500/10 px-4 py-2.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-colors"
                  >
                    <Bell className="h-4 w-4" />
                    <span>Set Alert For This Show</span>
                  </button>

                  <button
                    onClick={() => setSelectedTime('All')}
                    className="rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
                  >
                    View All Showtimes
                  </button>

                  <button
                    onClick={onSwitchToSell}
                    className="rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-black hover:bg-amber-400 transition-colors"
                  >
                    Got a spare ticket? Sell it here
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ticket Details & Checkout Modal */}
      <TicketDetailsModal
        ticket={activeTicketModal}
        onClose={() => setActiveTicketModal(null)}
        onBuySuccess={(t) => {
          onSelectTicketToBuy(t);
        }}
      />
    </div>
  );
};
