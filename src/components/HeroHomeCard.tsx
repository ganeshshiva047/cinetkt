import React from 'react';
import { Search, Ticket, MapPin, CheckCircle2, Clapperboard, Compass, Sparkles } from 'lucide-react';
import { UserLocationState, Theatre } from '../types';

interface HeroHomeCardProps {
  locationState: UserLocationState;
  onEnableLocation: () => void;
  onSearchTickets: () => void;
  onSellTicket: () => void;
  nearbyTheatresCount: number;
  availableTicketsCount: number;
  closestTheatre?: Theatre;
}

export const HeroHomeCard: React.FC<HeroHomeCardProps> = ({
  locationState,
  onEnableLocation,
  onSearchTickets,
  onSellTicket,
  nearbyTheatresCount,
  availableTicketsCount,
  closestTheatre,
}) => {
  return (
    <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-cyan-500/35 bg-[#07070d]/95 p-6 shadow-[0_0_50px_rgba(6,182,212,0.2)] backdrop-blur-2xl sm:p-10">
      {/* Ambient neon projector light rays */}
      <div className="pointer-events-none absolute -top-28 left-1/2 h-64 w-80 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-10 h-52 w-52 rounded-full bg-amber-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -top-10 -left-10 h-40 w-40 rounded-full bg-rose-500/15 blur-3xl" />

      {/* Top laser accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee]" />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* 🎬 Logo Header with Neon Ring */}
        <div className="mb-4 flex items-center justify-center">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-600 text-black shadow-[0_0_25px_rgba(34,211,238,0.7)]">
            <Clapperboard className="h-8 w-8 stroke-[2.4]" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300 opacity-80"></span>
              <span className="relative inline-flex h-4 w-4 rounded-full bg-cyan-300 shadow-[0_0_8px_#22d3ee]"></span>
            </span>
          </div>
        </div>

        <div className="mb-1 text-xs font-bold tracking-widest text-cyan-400 uppercase drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">
          Live Cinema Ticket Resale Exchange
        </div>

        {/* Primary Headline and Tagline matching the brief */}
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-4xl text-balance">
          Don't let your movie ticket <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-cyan-300 via-teal-200 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(34,211,238,0.5)]">
            go to waste!
          </span>
        </h1>

        <p className="mt-3 text-base text-neutral-300 sm:text-lg">
          Find someone who can use it in minutes.
        </p>

        {/* 📍 Location Status Area */}
        <div className="mt-7 w-full max-w-md rounded-2xl border border-cyan-500/25 bg-black/70 p-4 transition-all hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <div className="flex items-center gap-2.5 text-left">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  locationState.enabled
                    ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.4)]'
                    : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                <MapPin className={`h-5 w-5 ${locationState.enabled ? 'animate-bounce drop-shadow-[0_0_6px_#22d3ee]' : ''}`} />
              </div>
              <div>
                <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                  Location Status
                </div>
                <div className="text-sm font-medium text-white">
                  {locationState.loading ? (
                    <span className="text-cyan-400 animate-pulse">Detecting your location...</span>
                  ) : locationState.enabled ? (
                    <span className="flex items-center gap-1.5 text-cyan-300 font-semibold drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">
                      <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                      {locationState.city || 'Location Enabled'}
                    </span>
                  ) : (
                    <span className="text-neutral-400">📍 Not enabled</span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={onEnableLocation}
              disabled={locationState.loading}
              className={`w-full sm:w-auto shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                locationState.enabled
                  ? 'border border-cyan-500/40 bg-cyan-950/30 text-cyan-200 hover:bg-cyan-900/50 hover:border-cyan-400'
                  : 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:from-cyan-300 hover:to-blue-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] active:scale-95'
              }`}
            >
              {locationState.loading
                ? 'Locating...'
                : locationState.enabled
                ? 'Change Location'
                : 'Enable Location'}
            </button>
          </div>

          {locationState.enabled && closestTheatre && (
            <div className="mt-3 flex items-center justify-between border-t border-neutral-800/80 pt-2.5 text-xs text-neutral-400">
              <span className="flex items-center gap-1">
                <Compass className="h-3.5 w-3.5 text-cyan-400 drop-shadow-[0_0_4px_#22d3ee]" />
                Nearest: <strong className="text-neutral-200">{closestTheatre.name}</strong>
              </span>
              <span className="font-mono text-cyan-300 font-semibold tabular-nums drop-shadow-[0_0_4px_rgba(34,211,238,0.5)]">
                {closestTheatre.distanceKm} km away
              </span>
            </div>
          )}
        </div>

        {/* 2 Primary Choice Options matching prompt diagram */}
        <div className="mt-8 flex w-full max-w-md flex-col gap-3.5 sm:gap-4">
          {/* Option 1: Search Tickets with intense Neon Cyan glow */}
          <button
            onClick={onSearchTickets}
            className="group relative flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-500 px-6 py-4 text-base font-extrabold text-black shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-all hover:from-cyan-300 hover:to-cyan-200 hover:shadow-[0_0_45px_rgba(34,211,238,0.85)] hover:-translate-y-0.5 active:translate-y-0"
          >
            <Search className="h-5 w-5 stroke-[2.6] text-black transition-transform group-hover:scale-110" />
            <span className="font-display text-lg tracking-wide uppercase">
              Search Tickets
            </span>
            <span className="absolute right-4 rounded-full bg-black/20 border border-black/30 px-2.5 py-0.5 text-xs font-bold text-black">
              {availableTicketsCount} Available
            </span>
          </button>

          {/* Option 2: Sell Ticket Online with Neon Amber glow */}
          <button
            onClick={onSellTicket}
            className="group relative flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-amber-400/80 bg-neutral-950/90 px-6 py-4 text-base font-extrabold text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.25)] transition-all hover:border-amber-300 hover:bg-amber-950/30 hover:text-amber-200 hover:shadow-[0_0_35px_rgba(251,191,36,0.6)] hover:-translate-y-0.5 active:translate-y-0"
          >
            <Ticket className="h-5 w-5 stroke-[2.4] text-amber-400 transition-transform group-hover:rotate-12 drop-shadow-[0_0_6px_#fbbf24]" />
            <span className="font-display text-lg tracking-wide uppercase">
              Sell My Ticket
            </span>
            <span className="absolute right-4 hidden rounded-full border border-amber-500/30 bg-neutral-900 px-2 py-0.5 text-xs font-medium text-amber-400 sm:inline">
              Fair Resale
            </span>
          </button>
        </div>

        {/* Live Marketplace Highlights */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-neutral-400">
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400 drop-shadow-[0_0_4px_#22d3ee]" />
            <span className="text-neutral-300">Anti-scalping fair price guarantee</span>
          </span>
          <span aria-hidden="true" className="text-cyan-500/40">·</span>
          <span className="text-neutral-300">{nearbyTheatresCount} cinemas in range</span>
          <span aria-hidden="true" className="text-cyan-500/40">·</span>
          <span className="text-neutral-300">Instant digital pass handoff</span>
        </div>
      </div>
    </div>
  );
};
