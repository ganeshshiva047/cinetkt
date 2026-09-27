import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Building2, 
  Film, 
  Clock, 
  Ticket as TicketIcon, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  ShieldAlert, 
  Sparkles,
  Info,
  DollarSign
} from 'lucide-react';
import { Theatre, Movie, ResaleTicket, UserLocationState } from '../types';
import { STANDARD_SHOWTIMES } from '../data/mockData';

interface SellTicketFlowProps {
  theatres: Theatre[];
  movies: Movie[];
  locationState: UserLocationState;
  onOpenLocationModal: () => void;
  onDetectGPS: () => void;
  onPublishSuccess: (ticket: ResaleTicket) => void;
  onSwitchToSearch: () => void;
}

export const SellTicketFlow: React.FC<SellTicketFlowProps> = ({
  theatres,
  movies,
  locationState,
  onOpenLocationModal,
  onDetectGPS,
  onPublishSuccess,
  onSwitchToSearch,
}) => {
  // Wizard state steps: 1 = Location, 2 = Theatre, 3 = Movie, 4 = Time, 5 = Details, 6 = Published
  const [selectedTheatreId, setSelectedTheatreId] = useState<string | null>(null);
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [customMovieTitle, setCustomMovieTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState('Today, Sep 27');
  const [selectedTime, setSelectedTime] = useState('07:15 PM');
  
  // Ticket details
  const [screen, setScreen] = useState('Auditorium 1 (IMAX)');
  const [section, setSection] = useState('Prime Center Recliner');
  const [seats, setSeats] = useState('F12, F13');
  const [quantity, setQuantity] = useState(2);
  const [originalPrice, setOriginalPrice] = useState(25);
  const [resalePrice, setResalePrice] = useState(18);
  const [reason, setReason] = useState('Schedule conflict at work, cannot make this show.');
  const [sellerName, setSellerName] = useState('');
  const [sellerContact, setSellerContact] = useState('');
  const [bookingRef, setBookingRef] = useState('');

  const [publishedTicket, setPublishedTicket] = useState<ResaleTicket | null>(null);
  const [theatreQuery, setTheatreQuery] = useState('');

  // Selected entities
  const selectedTheatre = useMemo(
    () => theatres.find((t) => t.id === selectedTheatreId) || null,
    [theatres, selectedTheatreId]
  );

  const selectedMovie = useMemo(
    () => movies.find((m) => m.id === selectedMovieId) || null,
    [movies, selectedMovieId]
  );

  const filteredTheatres = useMemo(() => {
    if (!theatreQuery.trim()) return theatres;
    const q = theatreQuery.toLowerCase();
    return theatres.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.city.toLowerCase().includes(q) ||
        t.address.toLowerCase().includes(q)
    );
  }, [theatres, theatreQuery]);

  // Anti-scalping check: Resale price cannot exceed original price
  const isPriceValid = resalePrice <= originalPrice && resalePrice > 0;

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTheatre) return;

    const movieTitle = selectedMovie ? selectedMovie.title : (customMovieTitle || 'Special Feature');
    const moviePoster = selectedMovie ? selectedMovie.posterUrl : movies[0]?.posterUrl || '';
    const movieGenre = selectedMovie ? selectedMovie.genre : ['Cinema', 'Feature'];

    const newTicket: ResaleTicket = {
      id: `tkt-${Date.now()}`,
      theatreId: selectedTheatre.id,
      theatreName: selectedTheatre.name,
      theatreCity: selectedTheatre.city,
      theatreAddress: selectedTheatre.address,
      movieId: selectedMovie ? selectedMovie.id : 'custom-movie',
      movieTitle: movieTitle,
      moviePoster: moviePoster,
      movieGenre: movieGenre,
      showtime: selectedTime,
      showDate: selectedDate,
      screen: screen || 'Standard Screen',
      section: section || 'General Seating',
      seats: seats.split(',').map((s) => s.trim()).filter(Boolean),
      quantity: Number(quantity) || 1,
      originalPrice: Number(originalPrice) || 20,
      resalePrice: Number(resalePrice) || 15,
      sellerName: sellerName || 'Verified Seller',
      sellerContact: sellerContact || 'seller@cinema.io',
      reason: reason || 'Change in plans',
      bookingRef: bookingRef || `CP-${Math.floor(100000 + Math.random() * 900000)}`,
      verified: true,
      status: 'available',
      createdAt: 'Just now',
    };

    setPublishedTicket(newTicket);
    onPublishSuccess(newTicket);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold tracking-wider text-emerald-400 uppercase">
              Seller Portal
            </div>
            <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
              Sell Your Movie Ticket Online
            </h1>
          </div>
          
          <button
            onClick={onSwitchToSearch}
            className="hidden sm:flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-xs font-medium text-neutral-300 hover:border-neutral-700 hover:text-white"
          >
            <span>Looking for tickets?</span>
            <span className="text-amber-400 font-semibold">Search →</span>
          </button>
        </div>

        {/* Wizard Step Breadcrumbs */}
        <div className="mt-6 flex items-center justify-between border-b border-neutral-800 pb-4 overflow-x-auto text-xs">
          <span className={`flex items-center gap-1.5 whitespace-nowrap ${locationState.enabled ? 'text-emerald-400 font-medium' : 'text-amber-400 font-bold'}`}>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-800 text-[11px]">
              {locationState.enabled ? '✓' : '1'}
            </span>
            <span>Turn ON Location</span>
          </span>

          <span className="text-neutral-700">/</span>

          <span className={`flex items-center gap-1.5 whitespace-nowrap ${selectedTheatre ? 'text-emerald-400 font-medium' : 'text-neutral-400'}`}>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-800 text-[11px]">
              {selectedTheatre ? '✓' : '2'}
            </span>
            <span>{selectedTheatre ? selectedTheatre.name.slice(0, 15) + '...' : 'Select Theatre'}</span>
          </span>

          <span className="text-neutral-700">/</span>

          <span className={`flex items-center gap-1.5 whitespace-nowrap ${selectedMovie || customMovieTitle ? 'text-emerald-400 font-medium' : 'text-neutral-400'}`}>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-800 text-[11px]">
              {selectedMovie || customMovieTitle ? '✓' : '3'}
            </span>
            <span>{selectedMovie ? selectedMovie.title : 'Select Movie'}</span>
          </span>

          <span className="text-neutral-700">/</span>

          <span className="flex items-center gap-1.5 whitespace-nowrap text-neutral-400">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-800 text-[11px]">
              4
            </span>
            <span>Show Time & Ticket Details</span>
          </span>
        </div>
      </div>

      {/* Confirmation View If Already Published */}
      {publishedTicket ? (
        <div className="rounded-3xl border border-emerald-500/40 bg-neutral-900/90 p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 mb-4">
            <CheckCircle className="h-10 w-10 stroke-[2.2]" />
          </div>

          <div className="text-xs font-bold tracking-wider text-emerald-400 uppercase">
            Successfully Published
          </div>
          <h2 className="font-display text-2xl font-extrabold text-white mt-1">
            Your Movie Ticket is Now Live!
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-neutral-300">
            Moviegoers nearby looking for tickets at <strong className="text-white">{publishedTicket.theatreName}</strong> can now see and purchase your pass.
          </p>

          {/* Ticket Preview Card */}
          <div className="mx-auto my-6 max-w-md rounded-2xl border border-neutral-800 bg-neutral-950 p-5 text-left">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs font-semibold text-amber-400">{publishedTicket.theatreName}</div>
                <div className="font-display text-lg font-bold text-white">{publishedTicket.movieTitle}</div>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
                ${publishedTicket.resalePrice} / ticket
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-neutral-400 border-t border-neutral-800/80 pt-3">
              <span>{publishedTicket.showDate} at {publishedTicket.showtime}</span>
              <span className="font-mono text-white">Seats: {publishedTicket.seats.join(', ')}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onSwitchToSearch}
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-xs font-bold text-black hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20"
            >
              <span>See It in Search Tickets</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => {
                setPublishedTicket(null);
                setSelectedMovieId(null);
              }}
              className="rounded-xl border border-neutral-800 bg-neutral-900 px-5 py-3 text-xs font-semibold text-neutral-300 hover:text-white"
            >
              List Another Ticket
            </button>
          </div>
        </div>
      ) : (
        /* The Sequential Selling Steps */
        <div className="space-y-8">
          
          {/* STEP 1: Turn ON Location */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6 text-left">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${locationState.enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Step 1: Turn ON Location
                  </div>
                  <h3 className="font-display text-base font-bold text-white">
                    {locationState.enabled
                      ? `Location Active (${locationState.city || 'Detected'})`
                      : 'Enable location to detect your booked theatre'}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onDetectGPS}
                  disabled={locationState.loading}
                  className={`flex-1 sm:flex-initial rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                    locationState.enabled
                      ? 'border border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                      : 'bg-amber-500 text-black hover:bg-amber-400 shadow-md shadow-amber-500/20'
                  }`}
                >
                  {locationState.loading
                    ? 'Locating...'
                    : locationState.enabled
                    ? 'Refresh Location'
                    : 'Turn ON Location'}
                </button>
                <button
                  type="button"
                  onClick={onOpenLocationModal}
                  className="rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-300 hover:text-white"
                >
                  Change City
                </button>
              </div>
            </div>
          </div>

          {/* STEP 2: Select Theatre */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6 text-left space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Step 2: Select Theatre
                </div>
                <h3 className="font-display text-lg font-bold text-white">
                  Where did you book your tickets?
                </h3>
              </div>

              <input
                type="text"
                placeholder="Search cinema..."
                value={theatreQuery}
                onChange={(e) => setTheatreQuery(e.target.value)}
                className="rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-white placeholder-neutral-400 focus:border-amber-500 focus:outline-none w-full sm:w-60"
              />
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 max-h-60 overflow-y-auto pr-1">
              {filteredTheatres.map((th) => {
                const isSelected = selectedTheatreId === th.id;
                return (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => setSelectedTheatreId(th.id)}
                    className={`flex items-start justify-between rounded-xl border p-3 text-left transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/10 shadow-md'
                        : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700 hover:bg-neutral-800'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{th.name}</div>
                      <div className="text-[11px] text-neutral-400">{th.address}, {th.city}</div>
                    </div>
                    {th.distanceKm !== undefined && (
                      <span className="font-mono text-xs font-semibold text-amber-400 shrink-0 ml-2">
                        {th.distanceKm} km
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: Select Movie */}
          {selectedTheatre && (
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6 text-left space-y-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Step 3: Select Movie
                </div>
                <h3 className="font-display text-lg font-bold text-white">
                  Which movie is your ticket for?
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {movies.map((m) => {
                  const isSelected = selectedMovieId === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => {
                        setSelectedMovieId(m.id);
                        setCustomMovieTitle('');
                      }}
                      className={`group cursor-pointer overflow-hidden rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-amber-500 ring-2 ring-amber-500/40'
                          : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'
                      }`}
                    >
                      <div className="aspect-[3/4] w-full overflow-hidden bg-neutral-950">
                        <img
                          src={m.posterUrl}
                          alt={m.title}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-2.5">
                        <div className="font-display text-xs font-bold text-white truncate">{m.title}</div>
                        <div className="text-[10px] text-neutral-400">{m.duration}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2">
                <label className="block text-xs text-neutral-400 mb-1">
                  Or enter another movie title if not listed above:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Inception / Oppenheimer / Local Premiere..."
                  value={customMovieTitle}
                  onChange={(e) => {
                    setCustomMovieTitle(e.target.value);
                    if (e.target.value) setSelectedMovieId(null);
                  }}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2 text-xs text-white placeholder-neutral-400 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 4 & 5: Select Show Time & Enter Ticket Details */}
          {selectedTheatre && (selectedMovie || customMovieTitle) && (
            <form onSubmit={handlePublish} className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6 sm:p-7 text-left space-y-6">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Step 4 & 5: Timings & Ticket Details
                </div>
                <h3 className="font-display text-lg font-bold text-white">
                  Enter Your Ticket & Seat Specifications
                </h3>
              </div>

              {/* Show Timing & Date selection */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Show Date
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Today, Sep 27">Today, Sep 27</option>
                    <option value="Tomorrow, Sep 28">Tomorrow, Sep 28</option>
                    <option value="Sunday, Sep 29">Sunday, Sep 29</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Show Time
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                  >
                    {STANDARD_SHOWTIMES.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Screen & Section */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Screen / Auditorium
                  </label>
                  <input
                    type="text"
                    value={screen}
                    onChange={(e) => setScreen(e.target.value)}
                    placeholder="e.g. Auditorium 2 (IMAX)"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white placeholder-neutral-400 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Seating Tier / Section
                  </label>
                  <input
                    type="text"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    placeholder="e.g. Prime Recliner / Balcony"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white placeholder-neutral-400 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Seats & Quantity */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Seat Number(s)
                  </label>
                  <input
                    type="text"
                    value={seats}
                    onChange={(e) => setSeats(e.target.value)}
                    placeholder="e.g. F12, F13"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs font-mono text-white placeholder-neutral-400 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Number of Tickets
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Pricing with Fair Pricing Policy */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Original Price You Paid ($ / ticket)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Your Asking Resale Price ($ / ticket)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={originalPrice}
                    value={resalePrice}
                    onChange={(e) => setResalePrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                  {!isPriceValid && (
                    <div className="mt-1 flex items-center gap-1 text-[11px] text-red-400">
                      <ShieldAlert className="h-3.5 w-3.5" />
                      <span>Resale price cannot exceed original price (anti-scalping rule).</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Reason for selling */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Reason for Selling (Helps buyers know why it's spare)
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Meeting ran late / Friend couldn't come / Bought extra pair"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white placeholder-neutral-400 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Seller details & Booking Ref */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    placeholder="e.g. Jordan Miller"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white placeholder-neutral-400 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Contact Email / Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={sellerContact}
                    onChange={(e) => setSellerContact(e.target.value)}
                    placeholder="jordan.m@gmail.com"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white placeholder-neutral-400 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Cinema Booking Ref #
                  </label>
                  <input
                    type="text"
                    value={bookingRef}
                    onChange={(e) => setBookingRef(e.target.value)}
                    placeholder="e.g. AMC-88912"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs font-mono text-white placeholder-neutral-400 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Publish Action Button */}
              <div className="border-t border-neutral-800 pt-5">
                <button
                  type="submit"
                  disabled={!isPriceValid || !sellerName || !sellerContact}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 px-6 py-4 text-base font-extrabold text-black shadow-[0_0_25px_rgba(251,191,36,0.6)] hover:shadow-[0_0_40px_rgba(251,191,36,0.85)] active:scale-98 disabled:opacity-50 transition-all"
                >
                  <Sparkles className="h-5 w-5" />
                  <span>Publish Ticket Online Now</span>
                  <ArrowRight className="h-5 w-5 stroke-[2.5]" />
                </button>
                <p className="mt-2 text-center text-[11px] text-amber-300/80">
                  Instant publishing · Passes are instantly discoverable by nearby moviegoers searching {selectedTheatre.name}
                </p>
              </div>
            </form>
          )}

        </div>
      )}

    </div>
  );
};
