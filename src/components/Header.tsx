import React from 'react';
import { MapPin, Ticket, Search, PlusCircle, History } from 'lucide-react';
import { UserLocationState } from '../types';

interface HeaderProps {
  activeView: 'home' | 'search' | 'sell' | 'my-tickets';
  setActiveView: (view: 'home' | 'search' | 'sell' | 'my-tickets') => void;
  locationState: UserLocationState;
  onOpenLocationModal: () => void;
  savedTicketsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  locationState,
  onOpenLocationModal,
  savedTicketsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/20 bg-[#050508]/90 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
      {/* Top micro laser line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Single element brand wordmark */}
        <button
          onClick={() => setActiveView('home')}
          className="group flex items-center gap-2.5 text-left focus:outline-none"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-600 text-black shadow-[0_0_15px_rgba(6,182,212,0.6)] transition-all group-hover:scale-105 group-hover:shadow-[0_0_22px_rgba(6,182,212,0.8)]">
            <Ticket className="h-5 w-5 stroke-[2.4]" />
          </div>
          <span className="font-display text-xl font-extrabold tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            pass<span className="text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.7)]">mytckt</span>
          </span>
        </button>

        {/* Zone 2: Navigation links with neon active indicators */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => setActiveView('home')}
            className={`relative py-1 transition-all ${
              activeView === 'home' 
                ? 'text-cyan-300 font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]' 
                : 'text-neutral-400 hover:text-cyan-200'
            }`}
          >
            Overview
            {activeView === 'home' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_8px_#22d3ee] rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveView('search')}
            className={`relative flex items-center gap-1.5 py-1 transition-all ${
              activeView === 'search' 
                ? 'text-cyan-300 font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]' 
                : 'text-neutral-400 hover:text-cyan-200'
            }`}
          >
            <Search className="h-4 w-4" />
            <span>Search Tickets</span>
            {activeView === 'search' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_8px_#22d3ee] rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveView('sell')}
            className={`relative flex items-center gap-1.5 py-1 transition-all ${
              activeView === 'sell' 
                ? 'text-amber-400 font-bold drop-shadow-[0_0_8px_rgba(251,191,36,0.7)]' 
                : 'text-neutral-400 hover:text-amber-200'
            }`}
          >
            <PlusCircle className="h-4 w-4" />
            <span>Sell Ticket</span>
            {activeView === 'sell' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-400 shadow-[0_0_8px_#fbbf24] rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveView('my-tickets')}
            className={`relative flex items-center gap-1.5 py-1 transition-all ${
              activeView === 'my-tickets' 
                ? 'text-cyan-300 font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]' 
                : 'text-neutral-400 hover:text-cyan-200'
            }`}
          >
            <History className="h-4 w-4" />
            <span>History</span>
            {savedTicketsCount > 0 && (
              <span className="ml-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 px-1.5 py-0.2 text-[11px] font-bold text-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                {savedTicketsCount}
              </span>
            )}
            {activeView === 'my-tickets' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_8px_#22d3ee] rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Location Selector + Action Button) */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenLocationModal}
            className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
              locationState.enabled
                ? 'border-cyan-500/50 bg-cyan-950/40 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)] hover:border-cyan-400 hover:bg-cyan-900/50'
                : 'border-neutral-800 bg-neutral-900/80 text-neutral-300 hover:border-neutral-700 hover:text-white'
            }`}
            title="Click to detect or change cinema location"
          >
            <MapPin className={`h-3.5 w-3.5 ${locationState.enabled ? 'text-cyan-400 animate-pulse drop-shadow-[0_0_6px_#22d3ee]' : 'text-amber-500'}`} />
            <span className="max-w-[130px] truncate sm:max-w-[180px]">
              {locationState.loading
                ? 'Locating...'
                : locationState.enabled
                ? locationState.city || 'Location Enabled'
                : 'Turn ON Location'}
            </span>
          </button>

          <button
            onClick={() => setActiveView('sell')}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-2 text-xs font-bold text-black transition-all hover:from-amber-300 hover:to-amber-400 hover:shadow-[0_0_18px_rgba(245,158,11,0.6)] active:scale-95 whitespace-nowrap"
          >
            <PlusCircle className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Sell Ticket</span>
          </button>
        </div>
      </div>
    </header>
  );
};
