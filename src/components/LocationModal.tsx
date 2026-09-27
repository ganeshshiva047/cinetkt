import React, { useState } from 'react';
import { X, MapPin, Navigation, Check, AlertCircle, Building2 } from 'lucide-react';
import { UserLocationState } from '../types';
import { PRESET_LOCATIONS } from '../data/mockData';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  locationState: UserLocationState;
  onDetectGPS: () => void;
  onSelectPreset: (preset: { name: string; lat: number; lng: number; city: string }) => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  locationState,
  onDetectGPS,
  onSelectPreset,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredPresets = PRESET_LOCATIONS.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl border border-cyan-500/35 bg-[#080811] p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] sm:p-7">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.4)]">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white">
                Turn ON Location
              </h3>
              <p className="text-xs text-neutral-400">
                To find and list tickets for theatres right next to you
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current State Info */}
        <div className="my-4 rounded-xl border border-cyan-500/20 bg-black/60 p-3.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400">Current Status:</span>
            <span className={`font-semibold ${locationState.enabled ? 'text-cyan-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.6)]' : 'text-neutral-400'}`}>
              {locationState.enabled ? `Enabled (${locationState.city || 'Coordinates Locked'})` : 'Not enabled'}
            </span>
          </div>
          {locationState.lat && locationState.lng && (
            <div className="mt-1 text-xs text-neutral-400 font-mono">
              Coordinates: {locationState.lat.toFixed(4)}°, {locationState.lng.toFixed(4)}°
            </div>
          )}
          {locationState.error && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{locationState.error}</span>
            </div>
          )}
        </div>

        {/* Action 1: Use GPS */}
        <button
          onClick={() => {
            onDetectGPS();
          }}
          disabled={locationState.loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-3 text-sm font-extrabold text-black shadow-[0_0_20px_rgba(34,211,238,0.6)] transition-all hover:from-cyan-300 hover:to-blue-400 active:scale-98 disabled:opacity-50"
        >
          <Navigation className={`h-4 w-4 stroke-[2.5] ${locationState.loading ? 'animate-spin' : ''}`} />
          <span>{locationState.loading ? 'Detecting GPS Coordinates...' : 'Detect My Exact GPS Location'}</span>
        </button>

        {/* Divider */}
        <div className="relative my-5 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-800" />
          </div>
          <span className="relative bg-neutral-900 px-3 text-xs uppercase tracking-wider text-neutral-400">
            or select cinema metropolitan area
          </span>
        </div>

        {/* Search Filter */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="Type city (e.g. San Francisco, New York, London)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white placeholder-neutral-400 focus:border-amber-500 focus:outline-none"
          />
        </div>

        {/* Preset City Buttons */}
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {filteredPresets.map((preset) => {
            const isSelected =
              locationState.lat !== null &&
              locationState.lng !== null &&
              Math.abs(locationState.lat - preset.lat) < 0.05 &&
              Math.abs(locationState.lng - preset.lng) < 0.05;

            return (
              <button
                key={preset.name}
                onClick={() => {
                  onSelectPreset(preset);
                  onClose();
                }}
                className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-left text-xs transition-colors ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 font-semibold shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'border-neutral-800 bg-neutral-950/40 text-neutral-300 hover:border-cyan-500/40 hover:bg-neutral-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className={`h-4 w-4 ${isSelected ? 'text-cyan-400' : 'text-neutral-400'}`} />
                  <div>
                    <div className="font-semibold text-white">{preset.name}</div>
                    <div className="text-neutral-400">{preset.city} Cinema Hub</div>
                  </div>
                </div>
                {isSelected && <Check className="h-4 w-4 text-cyan-400" />}
              </button>
            );
          })}
        </div>

        <div className="mt-5 border-t border-neutral-800 pt-3 text-center">
          <button
            onClick={onClose}
            className="text-xs text-neutral-400 hover:text-white transition-colors"
          >
            Close & continue
          </button>
        </div>
      </div>
    </div>
  );
};
