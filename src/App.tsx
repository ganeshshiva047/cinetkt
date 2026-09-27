/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  HeroHomeCard 
} from './components/HeroHomeCard';
import { 
  SearchTicketsFlow 
} from './components/SearchTicketsFlow';
import { 
  SellTicketFlow 
} from './components/SellTicketFlow';
import { 
  MyTicketsView 
} from './components/MyTicketsView';
import { 
  LocationModal 
} from './components/LocationModal';
import { 
  DuoBot 
} from './components/DuoBot';
import { 
  Theatre, 
  Movie, 
  ResaleTicket, 
  UserLocationState 
} from './types';
import { 
  INITIAL_MOVIES, 
  INITIAL_THEATRES, 
  loadTickets, 
  saveTicket, 
  markTicketAsSold, 
  calculateDistanceKm,
  heroImg 
} from './data/mockData';
import { 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Ticket as TicketIcon, 
  Compass, 
  ArrowRight,
  TrendingDown,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<'home' | 'search' | 'sell' | 'my-tickets'>('home');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Tickets state
  const [tickets, setTickets] = useState<ResaleTicket[]>(() => loadTickets());
  const [purchasedTickets, setPurchasedTickets] = useState<ResaleTicket[]>(() => {
    try {
      const saved = localStorage.getItem('cinepass_purchased_passes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // User location state
  const [locationState, setLocationState] = useState<UserLocationState>({
    enabled: true, // Auto-provisioned with standard city hub for seamless instant testing
    lat: 37.7842,
    lng: -122.4031,
    city: 'San Francisco, CA',
    address: 'Downtown Hub',
    loading: false,
    error: null,
  });

  // Theatres with dynamic distance calculation based on user lat/lng
  const theatresWithDistance = useMemo(() => {
    return INITIAL_THEATRES.map((theatre) => {
      let distanceKm: number | undefined = undefined;
      if (locationState.lat !== null && locationState.lng !== null) {
        distanceKm = calculateDistanceKm(
          locationState.lat,
          locationState.lng,
          theatre.lat,
          theatre.lng
        );
      }
      return {
        ...theatre,
        distanceKm,
      };
    }).sort((a, b) => {
      if (a.distanceKm !== undefined && b.distanceKm !== undefined) {
        return a.distanceKm - b.distanceKm;
      }
      return 0;
    });
  }, [locationState.lat, locationState.lng]);

  const closestTheatre = theatresWithDistance[0];

  // Detect GPS coordinates via browser Geolocation API
  const handleDetectGPS = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationState((prev) => ({
        ...prev,
        error: 'Geolocation is not supported by your browser.',
        loading: false,
      }));
      return;
    }

    setLocationState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLocationState({
          enabled: true,
          lat,
          lng,
          city: 'Your GPS Location',
          address: `${lat.toFixed(3)}°, ${lng.toFixed(3)}°`,
          loading: false,
          error: null,
        });
        setIsLocationModalOpen(false);
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        // Graceful fallback to default active location so user isn't stuck
        setLocationState({
          enabled: true,
          lat: 37.7842,
          lng: -122.4031,
          city: 'San Francisco (Default Hub)',
          address: 'Downtown Cinema District',
          loading: false,
          error: 'GPS permission denied or unavailable. Switched to Downtown Hub.',
        });
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  }, []);

  const handleSelectPreset = (preset: { name: string; lat: number; lng: number; city: string }) => {
    setLocationState({
      enabled: true,
      lat: preset.lat,
      lng: preset.lng,
      city: preset.city,
      address: preset.name,
      loading: false,
      error: null,
    });
  };

  // Handlers for ticket transactions
  const handlePublishSuccess = (newTicket: ResaleTicket) => {
    saveTicket(newTicket);
    setTickets(loadTickets());
  };

  const handleBuyTicketSuccess = (boughtTicket: ResaleTicket) => {
    markTicketAsSold(boughtTicket.id);
    const updated = loadTickets();
    setTickets(updated);

    const newPurchased = [{ ...boughtTicket, status: 'sold' as const }, ...purchasedTickets];
    setPurchasedTickets(newPurchased);
    try {
      localStorage.setItem('cinepass_purchased_passes', JSON.stringify(newPurchased));
    } catch (e) {
      console.error(e);
    }
  };

  const availableTicketsCount = tickets.filter((t) => t.status === 'available').length;

  return (
    <div className="min-h-screen bg-[#050508] bg-neon-grid text-neutral-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* Universal Top Bar */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        locationState={locationState}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        savedTicketsCount={purchasedTickets.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeView === 'home' && (
          <div className="relative">
            {/* Cinematic Hero Backdrop with Scrim & Neon Aura */}
            <div className="absolute inset-0 top-0 h-[720px] w-full overflow-hidden pointer-events-none">
              <img
                src={heroImg}
                alt="Cinema Hall"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover object-center opacity-20 filter blur-[1px]"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#050508]/40 via-[#050508]/85 to-[#050508]" />
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[350px] w-[600px] bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent blur-3xl pointer-events-none" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 mx-auto max-w-7xl px-4 pt-10 pb-20 sm:px-6 lg:px-8">
              
              {/* Centerpiece Hero Card faithfully implementing user mockup */}
              <div className="pt-4 sm:pt-8">
                <HeroHomeCard
                  locationState={locationState}
                  onEnableLocation={() => setIsLocationModalOpen(true)}
                  onSearchTickets={() => setActiveView('search')}
                  onSellTicket={() => setActiveView('sell')}
                  nearbyTheatresCount={theatresWithDistance.length}
                  availableTicketsCount={availableTicketsCount}
                  closestTheatre={closestTheatre}
                />
              </div>

              {/* Live spare tickets spotlight reel */}
              <section className="mt-20">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
                  <div>
                    <div className="text-xs font-bold tracking-wider text-cyan-400 uppercase drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">
                      Live Near You
                    </div>
                    <h2 className="font-display text-2xl font-bold text-white sm:text-3xl mt-1">
                      Spare Tickets Ready for Pickup
                    </h2>
                    <p className="text-xs text-neutral-400 mt-1">
                      Verified seats being passed on by moviegoers who couldn't attend tonight.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveView('search')}
                    className="mt-3 sm:mt-0 flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.5)] transition-all"
                  >
                    <span>View all {availableTicketsCount} tickets</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Tickets grid with neon edges */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {tickets.filter((t) => t.status === 'available').slice(0, 3).map((t) => {
                    const savings = t.originalPrice - t.resalePrice;

                    return (
                      <div
                        key={t.id}
                        onClick={() => setActiveView('search')}
                        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-cyan-500/20 bg-[#090912]/85 p-5 transition-all hover:border-cyan-400 hover:bg-[#0d0d1a] hover:shadow-[0_0_25px_rgba(6,182,212,0.35)] text-left backdrop-blur-sm"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="rounded-lg bg-neutral-900 border border-neutral-800 px-2 py-0.5 text-[11px] font-semibold text-neutral-300">
                            {t.theatreName}
                          </span>
                          <span className="rounded-full bg-cyan-500/15 border border-cyan-400/40 px-2.5 py-0.5 text-[11px] font-bold text-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.4)]">
                            Save ${savings}
                          </span>
                        </div>

                        <div className="mt-3.5 flex gap-3.5">
                          <img
                            src={t.moviePoster}
                            alt={t.movieTitle}
                            referrerPolicy="no-referrer"
                            className="h-20 w-14 shrink-0 rounded-lg object-cover border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                          />
                          <div>
                            <h3 className="font-display text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                              {t.movieTitle}
                            </h3>
                            <div className="mt-0.5 text-xs text-neutral-400">
                              {t.showtime} · {t.showDate}
                            </div>
                            <div className="mt-1 text-xs text-amber-400 font-semibold drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]">
                              {t.seats.join(', ')} ({t.quantity} seat{t.quantity > 1 ? 's' : ''})
                            </div>
                          </div>
                        </div>

                        <p className="mt-3.5 rounded-lg bg-black/60 p-2.5 text-[11px] text-neutral-300 italic line-clamp-1 border border-neutral-800/80">
                          "{t.reason}"
                        </p>

                        <div className="mt-3.5 flex items-center justify-between border-t border-neutral-800/80 pt-2.5">
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-display text-lg font-bold text-cyan-400 tabular-nums drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]">
                              ${t.resalePrice}
                            </span>
                            <span className="text-xs text-neutral-500 line-through tabular-nums">
                              ${t.originalPrice}
                            </span>
                          </div>
                          <span className="flex items-center gap-1 text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
                            Tap to View <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Cinema Trust Features */}
              <section className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="rounded-2xl border border-cyan-500/20 bg-[#090912]/60 p-6 text-left backdrop-blur-sm hover:border-cyan-400/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.5)] mb-3">
                    <Compass className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-base font-bold text-white">
                    Proximity-First Discovery
                  </h3>
                  <p className="mt-1 text-xs text-neutral-400">
                    Matches sellers and buyers based on real-time geodesic distance to cinema halls in your neighborhood.
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-500/20 bg-[#090912]/60 p-6 text-left backdrop-blur-sm hover:border-amber-400/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)] mb-3">
                    <TrendingDown className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-base font-bold text-white">
                    Anti-Scalping Fair Cap
                  </h3>
                  <p className="mt-1 text-xs text-neutral-400">
                    Resale tickets can never exceed original retail price. Built solely to prevent wasted seats and recoup costs.
                  </p>
                </div>
              </section>

            </div>
          </div>
        )}

        {/* SEARCH TICKETS VIEW */}
        {activeView === 'search' && (
          <SearchTicketsFlow
            theatres={theatresWithDistance}
            movies={INITIAL_MOVIES}
            tickets={tickets}
            locationState={locationState}
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
            onDetectGPS={handleDetectGPS}
            onSelectTicketToBuy={handleBuyTicketSuccess}
            onSwitchToSell={() => setActiveView('sell')}
          />
        )}

        {/* SELL TICKET VIEW */}
        {activeView === 'sell' && (
          <SellTicketFlow
            theatres={theatresWithDistance}
            movies={INITIAL_MOVIES}
            locationState={locationState}
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
            onDetectGPS={handleDetectGPS}
            onPublishSuccess={handlePublishSuccess}
            onSwitchToSearch={() => setActiveView('search')}
          />
        )}

        {/* MY TICKETS / PASSBOOK VIEW */}
        {activeView === 'my-tickets' && (
          <MyTicketsView
            purchasedTickets={purchasedTickets}
            listedTickets={tickets.filter((t) => t.sellerContact.includes('seller') || t.createdAt.includes('Just now'))}
            onSwitchToSearch={() => setActiveView('search')}
            onSwitchToSell={() => setActiveView('sell')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-8 text-center text-xs text-neutral-400">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display text-sm font-bold text-white">
              pass<span className="text-cyan-400">mytckt</span>
            </span>
            <span className="text-neutral-500">·</span>
            <span>Spare Movie Ticket Exchange</span>
          </div>

          <div className="text-neutral-400">
            Fair cinema resale · Zero wasted seats · 100% verified gate pass transfers
          </div>
        </div>
      </footer>

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        locationState={locationState}
        onDetectGPS={handleDetectGPS}
        onSelectPreset={handleSelectPreset}
      />

      {/* AI Bot Duo to clear user doubts */}
      <DuoBot />
    </div>
  );
}
