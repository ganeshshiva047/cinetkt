import React, { useState } from 'react';
import { Ticket as TicketIcon, QrCode, ShieldCheck, MapPin, Calendar, Clock, CheckCircle2, Download, Search, PlusCircle, Printer } from 'lucide-react';
import { ResaleTicket } from '../types';
import { downloadTicketPass } from '../utils/downloadTicket';

interface MyTicketsViewProps {
  purchasedTickets: ResaleTicket[];
  listedTickets: ResaleTicket[];
  onSwitchToSearch: () => void;
  onSwitchToSell: () => void;
}

export const MyTicketsView: React.FC<MyTicketsViewProps> = ({
  purchasedTickets,
  listedTickets,
  onSwitchToSearch,
  onSwitchToSell,
}) => {
  const [tab, setTab] = useState<'purchased' | 'listed'>('purchased');
  const [selectedPass, setSelectedPass] = useState<ResaleTicket | null>(null);

  const activeTickets = tab === 'purchased' ? purchasedTickets : listedTickets;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold tracking-wider text-amber-500 uppercase">
            Activity & Passes
          </div>
          <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
            History
          </h1>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 rounded-xl bg-neutral-900/90 p-1 border border-cyan-500/25 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          <button
            onClick={() => setTab('purchased')}
            className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
              tab === 'purchased'
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-[0_0_12px_rgba(34,211,238,0.6)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Purchased Tickets ({purchasedTickets.length})
          </button>
          <button
            onClick={() => setTab('listed')}
            className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
              tab === 'listed'
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-[0_0_12px_rgba(34,211,238,0.6)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            My Listings ({listedTickets.length})
          </button>
        </div>
      </div>

      {activeTickets.length === 0 ? (
        <div className="rounded-3xl border border-cyan-500/20 bg-[#090912]/80 p-12 text-center backdrop-blur-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)] mb-3">
            <TicketIcon className="h-7 w-7" />
          </div>
          <h3 className="font-display text-lg font-bold text-white">
            {tab === 'purchased' ? 'No Purchased Tickets Yet' : 'No Active Ticket Listings'}
          </h3>
          <p className="mx-auto mt-1 max-w-md text-xs text-neutral-400">
            {tab === 'purchased'
              ? 'Find spare tickets for tonight’s movies at theatres near you before they start.'
              : 'Have an extra ticket you can’t use? List it in 60 seconds and recover your cost.'}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            {tab === 'purchased' ? (
              <button
                onClick={onSwitchToSearch}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2.5 text-xs font-bold text-black shadow-[0_0_15px_rgba(34,211,238,0.5)] hover:from-cyan-300 hover:to-blue-400 transition-all"
              >
                <Search className="h-4 w-4" />
                <span>Search Tickets Near You</span>
              </button>
            ) : (
              <button
                onClick={onSwitchToSell}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-2.5 text-xs font-bold text-black shadow-[0_0_15px_rgba(251,191,36,0.5)] hover:from-amber-300 hover:to-amber-400 transition-all"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Sell a Spare Ticket</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {activeTickets.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl border border-cyan-500/25 bg-[#090912]/90 p-5 text-left transition-all hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.35)] backdrop-blur-sm"
            >
              <div className="flex items-start justify-between gap-3 border-b border-neutral-800 pb-3">
                <div>
                  <div className="text-xs font-semibold text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]">{t.theatreName}</div>
                  <h3 className="font-display text-lg font-bold text-white">{t.movieTitle}</h3>
                </div>
                <span className="rounded-full bg-cyan-500/15 border border-cyan-400/40 px-2.5 py-0.5 text-xs font-mono font-bold text-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.4)]">
                  ${t.resalePrice}
                </span>
              </div>

              <div className="my-3 space-y-1.5 text-xs text-neutral-300">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{t.showDate}</span>
                  <span className="text-neutral-500">·</span>
                  <Clock className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{t.showtime}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Seats: <strong className="text-cyan-300 font-mono drop-shadow-[0_0_4px_rgba(34,211,238,0.5)]">{t.seats.join(', ')}</strong></span>
                  <span>Screen: <strong className="text-white">{t.screen}</strong></span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-neutral-800 pt-3">
                <span className="text-[11px] text-neutral-500 font-mono">
                  Ref: {t.bookingRef}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => downloadTicketPass(t, 'Verified Patron')}
                    title="Download ticket pass"
                    className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-950/40 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-900/60 hover:border-cyan-400 hover:shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download</span>
                  </button>

                  <button
                    onClick={() => setSelectedPass(t)}
                    className="flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-bold text-white hover:border-neutral-700 transition-all"
                  >
                    <QrCode className="h-3.5 w-3.5 text-cyan-400" />
                    <span>View Pass</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Pass Drawer / Modal */}
      {selectedPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-sm rounded-3xl border border-neutral-800 bg-neutral-900 p-6 text-center shadow-2xl">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wide">
              Auditorium Entry Pass
            </div>
            <h3 className="font-display text-xl font-bold text-white mt-1">
              {selectedPass.movieTitle}
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              {selectedPass.theatreName} · {selectedPass.showtime}
            </p>

            <div className="my-5 rounded-2xl border-2 border-dashed border-amber-500/40 bg-white p-4 inline-block">
              <QrCode className="h-44 w-44 text-black mx-auto" />
              <div className="mt-2 font-mono text-[11px] font-bold text-black tracking-widest uppercase">
                {selectedPass.bookingRef}
              </div>
            </div>

            <div className="space-y-1 text-xs text-neutral-300">
              <div>Seats: <strong className="font-mono text-amber-400 text-sm">{selectedPass.seats.join(', ')}</strong></div>
              <div>Auditorium: <strong className="text-white">{selectedPass.screen}</strong></div>
              <div>Holder: <span className="text-neutral-200">{selectedPass.sellerName}</span></div>
            </div>

            <div className="mt-6 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  downloadTicketPass(selectedPass, 'Verified Patron');
                }}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-500 py-3 text-xs font-extrabold text-black shadow-[0_0_20px_rgba(34,211,238,0.6)] hover:from-cyan-300 hover:to-blue-400 transition-all"
              >
                <Download className="h-4 w-4 stroke-[2.5]" />
                <span>Download Ticket Pass (Image)</span>
              </button>

              <button
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-950/30 py-2.5 text-xs font-bold text-cyan-300 hover:bg-cyan-900/50 transition-all"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Ticket</span>
              </button>

              <button
                onClick={() => setSelectedPass(null)}
                className="rounded-xl border border-neutral-800 py-2 text-xs text-neutral-400 hover:text-white transition-colors"
              >
                Close Pass
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
