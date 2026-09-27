import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, MapPin, Calendar, Clock, Ticket as TicketIcon, QrCode, Sparkles, Download, ArrowRight, Printer } from 'lucide-react';
import { ResaleTicket } from '../types';
import { downloadTicketPass } from '../utils/downloadTicket';

interface TicketDetailsModalProps {
  ticket: ResaleTicket | null;
  onClose: () => void;
  onBuySuccess: (ticket: ResaleTicket) => void;
}

export const TicketDetailsModal: React.FC<TicketDetailsModalProps> = ({
  ticket,
  onClose,
  onBuySuccess,
}) => {
  const [step, setStep] = useState<'details' | 'checkout' | 'success'>('details');
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'apple_pay' | 'card' | 'upi'>('apple_pay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!ticket) return null;

  const totalSavings = Math.max(0, (ticket.originalPrice - ticket.resalePrice) * ticket.quantity);
  const totalAmount = ticket.resalePrice * ticket.quantity;

  const handleProcessPayment = () => {
    if (!buyerName || !buyerEmail) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
      onBuySuccess(ticket);
    }, 1200);
  };

  const handleDownloadTicket = () => {
    if (ticket) {
      const ok = downloadTicketPass(ticket, buyerName || 'Verified Patron');
      if (ok) {
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 5000);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl border border-cyan-500/35 bg-[#080811] shadow-[0_0_60px_rgba(6,182,212,0.3)] overflow-hidden my-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 rounded-full bg-neutral-950/70 p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {step === 'details' && (
          <div>
            {/* Poster Banner Header */}
            <div className="relative h-48 w-full overflow-hidden bg-neutral-950 sm:h-56">
              <img
                src={ticket.moviePoster}
                alt={ticket.movieTitle}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover opacity-40 blur-sm scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/60 to-transparent" />
              
              <div className="absolute bottom-4 left-6 right-6 flex items-end gap-4">
                <img
                  src={ticket.moviePoster}
                  alt={ticket.movieTitle}
                  referrerPolicy="no-referrer"
                  className="h-28 w-20 shrink-0 rounded-xl border-2 border-neutral-700/80 object-cover shadow-xl sm:h-32 sm:w-24"
                />
                <div className="text-left">
                  <div className="text-xs font-semibold text-amber-400 uppercase tracking-wide">
                    {ticket.movieGenre.join(' · ')}
                  </div>
                  <h3 className="font-display text-xl font-extrabold text-white sm:text-2xl">
                    {ticket.movieTitle}
                  </h3>
                  <div className="mt-1 flex items-center gap-2 text-xs text-neutral-300">
                    <span className="flex items-center gap-1 font-medium text-emerald-400">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Verified Spare Ticket
                    </span>
                    <span>·</span>
                    <span className="text-neutral-400">Ref: {ticket.bookingRef}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Body Content */}
            <div className="p-6 sm:p-7 space-y-5 text-left">
              {/* Theatre & Screening Details */}
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                      <MapPin className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      <span>{ticket.theatreName}</span>
                    </div>
                    <div className="text-xs text-neutral-400 pl-5">{ticket.theatreAddress}</div>
                  </div>
                  <div className="rounded-lg bg-neutral-900 px-2.5 py-1 text-xs font-mono text-amber-300 font-semibold shrink-0">
                    {ticket.screen}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 border-t border-neutral-800/80 pt-3 text-xs">
                  <div>
                    <span className="text-neutral-400">Show Date:</span>
                    <div className="font-medium text-white flex items-center gap-1 mt-0.5">
                      <Calendar className="h-3.5 w-3.5 text-amber-400" />
                      {ticket.showDate}
                    </div>
                  </div>
                  <div>
                    <span className="text-neutral-400">Showtime:</span>
                    <div className="font-medium text-white flex items-center gap-1 mt-0.5">
                      <Clock className="h-3.5 w-3.5 text-amber-400" />
                      {ticket.showtime}
                    </div>
                  </div>
                </div>
              </div>

              {/* Seating & Quantity */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-4">
                  <span className="text-xs text-neutral-400">Seats Reserved</span>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-mono text-lg font-bold text-white tracking-wide">
                      {ticket.seats.join(', ')}
                    </span>
                    <span className="text-xs text-neutral-400">({ticket.quantity} seat{ticket.quantity > 1 ? 's' : ''})</span>
                  </div>
                  <div className="mt-0.5 text-xs text-amber-400 font-medium">{ticket.section}</div>
                </div>

                <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-4">
                  <span className="text-xs text-neutral-400">Asking Price</span>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-display text-2xl font-extrabold text-emerald-400 tabular-nums">
                      ${ticket.resalePrice}
                    </span>
                    <span className="text-xs text-neutral-400 line-through tabular-nums">
                      ${ticket.originalPrice}
                    </span>
                    <span className="text-xs text-neutral-400">/ ticket</span>
                  </div>
                  {totalSavings > 0 && (
                    <div className="mt-0.5 text-xs text-emerald-400 font-medium">
                      You save ${totalSavings} total!
                    </div>
                  )}
                </div>
              </div>

              {/* Seller's Reason for Selling */}
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs">
                <div className="font-semibold text-amber-300 flex items-center gap-1.5 mb-1">
                  <span>Seller Note from {ticket.sellerName}</span>
                </div>
                <p className="text-neutral-300 italic">
                  "{ticket.reason}"
                </p>
                <div className="mt-2 text-neutral-400">
                  Listed {ticket.createdAt} · Verified genuine booking
                </div>
              </div>

              {/* Guaranteed Transfer Terms */}
              <div className="rounded-xl border border-neutral-800/80 bg-neutral-950/40 p-3 text-xs text-neutral-400 flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
                <span>
                  <strong>100% Entry Guarantee:</strong> Instant digital barcode and QR code pass are generated immediately upon confirmation.
                </span>
              </div>

              {/* Bottom Action: Continue / Buy */}
              <div className="flex items-center justify-between border-t border-neutral-800 pt-4">
                <div>
                  <div className="text-xs text-neutral-400">Total Purchase:</div>
                  <div className="font-display text-2xl font-bold text-white tabular-nums">
                    ${totalAmount}
                  </div>
                </div>

                <button
                  onClick={() => setStep('checkout')}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3.5 text-sm font-extrabold text-black shadow-[0_0_20px_rgba(34,211,238,0.6)] hover:from-cyan-300 hover:to-blue-400 active:scale-95 transition-all"
                >
                  <span>Continue / Buy Ticket</span>
                  <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step: Checkout / Buy Confirmation */}
        {step === 'checkout' && (
          <div className="p-6 sm:p-8 text-left">
            <h3 className="font-display text-xl font-bold text-white">
              Complete Your Cinema Pass Transfer
            </h3>
            <p className="mt-1 text-xs text-neutral-400">
              {ticket.movieTitle} at {ticket.theatreName} · {ticket.showtime}
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Your Full Name (Ticket Holder)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-white placeholder-neutral-400 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Email Address for Instant Ticket Pass
                </label>
                <input
                  type="email"
                  placeholder="alex.morgan@gmail.com"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-white placeholder-neutral-400 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-2">
                  Select Secure Payment
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`rounded-xl border p-2.5 text-xs font-semibold transition-all ${
                      paymentMethod === 'apple_pay'
                        ? 'border-amber-500 bg-amber-500/15 text-amber-300'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-300'
                    }`}
                  >
                     Pay / GPay
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`rounded-xl border p-2.5 text-xs font-semibold transition-all ${
                      paymentMethod === 'card'
                        ? 'border-amber-500 bg-amber-500/15 text-amber-300'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-300'
                    }`}
                  >
                    Credit / Debit
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`rounded-xl border p-2.5 text-xs font-semibold transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-amber-500 bg-amber-500/15 text-amber-300'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-300'
                    }`}
                  >
                    Instant Transfer
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-xs space-y-2">
                <div className="flex justify-between text-neutral-400">
                  <span>Seats:</span>
                  <span className="font-mono text-white font-semibold">{ticket.seats.join(', ')}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal ({ticket.quantity} × ${ticket.resalePrice}):</span>
                  <span className="font-mono text-white">${totalAmount}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Service Fee:</span>
                  <span className="text-emerald-400 font-semibold">$0.00 (Zero Fee Launch)</span>
                </div>
                <div className="border-t border-neutral-800 pt-2 flex justify-between font-bold text-white text-sm">
                  <span>Total Due:</span>
                  <span className="text-amber-400">${totalAmount}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="rounded-xl border border-neutral-800 px-4 py-3 text-xs font-semibold text-neutral-400 hover:text-white"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleProcessPayment}
                  disabled={!buyerName || !buyerEmail || isProcessing}
                  className="flex-1 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 text-sm font-extrabold text-black shadow-[0_0_20px_rgba(34,211,238,0.6)] hover:from-cyan-300 hover:to-blue-400 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <span>Securing Pass...</span>
                  ) : (
                    <>
                      <span>Pay ${totalAmount} & Get Ticket Pass</span>
                      <CheckCircle className="h-4 w-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step: Success / Instant QR Pass Generation */}
        {step === 'success' && (
          <div className="p-6 sm:p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 mb-3">
              <CheckCircle className="h-8 w-8 stroke-[2.2]" />
            </div>

            <div className="text-xs font-bold tracking-wider text-emerald-400 uppercase">
              Transfer Confirmed
            </div>
            <h3 className="font-display text-2xl font-extrabold text-white mt-1">
              Your Cinema Pass is Ready!
            </h3>
            <p className="mt-1 text-xs text-neutral-400">
              Present this digital QR pass at the theatre entry gate or auditorium scanner.
            </p>

            {/* Cinema Pass Voucher Box */}
            <div className="mt-6 rounded-2xl border-2 border-dashed border-cyan-400/60 bg-[#06060c] shadow-[0_0_30px_rgba(6,182,212,0.25)] p-6 text-left relative overflow-hidden">
              <div className="flex justify-between items-start border-b border-neutral-800 pb-3">
                <div>
                  <div className="text-xs text-cyan-400 font-semibold drop-shadow-[0_0_6px_rgba(34,211,238,0.6)]">{ticket.theatreName}</div>
                  <div className="font-display text-lg font-bold text-white">{ticket.movieTitle}</div>
                </div>
                <div className="rounded-lg bg-neutral-900 border border-cyan-500/30 px-2.5 py-1 text-xs font-mono text-cyan-300">
                  {ticket.showtime}
                </div>
              </div>

              <div className="my-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-xs">
                  <div>
                    <span className="text-neutral-400">Auditorium: </span>
                    <strong className="text-white">{ticket.screen}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-400">Seats: </span>
                    <strong className="font-mono text-cyan-300 text-sm drop-shadow-[0_0_6px_rgba(34,211,238,0.6)]">{ticket.seats.join(', ')}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-400">Pass Holder: </span>
                    <span className="text-neutral-200">{buyerName}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400">Booking Ref: </span>
                    <span className="font-mono text-neutral-400">{ticket.bookingRef}</span>
                  </div>
                </div>

                {/* Simulated QR Code */}
                <div className="flex flex-col items-center bg-white p-3 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                  <div className="h-28 w-28 bg-neutral-900 rounded p-1 flex items-center justify-center">
                    <QrCode className="h-24 w-24 text-cyan-400" />
                  </div>
                  <span className="mt-1 text-[10px] font-mono text-black font-bold tracking-widest">
                    GATE SCAN READY
                  </span>
                </div>
              </div>

              <div className="border-t border-neutral-800 pt-3 text-[11px] text-neutral-400 flex items-center justify-between">
                <span>Transferred from seller {ticket.sellerName}</span>
                <span className="text-cyan-400 font-semibold drop-shadow-[0_0_4px_#22d3ee]">Verified Active Pass</span>
              </div>
            </div>

            {/* Download Status Toast / Confirmation */}
            {downloadSuccess && (
              <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-cyan-400/50 bg-cyan-950/60 p-3 text-xs font-bold text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.4)] animate-in fade-in">
                <CheckCircle className="h-4 w-4 text-cyan-400 shrink-0" />
                <span>Ticket pass downloaded as PNG to your device! Also saved in History.</span>
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleDownloadTicket}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-500 px-6 py-3.5 text-xs font-extrabold text-black shadow-[0_0_25px_rgba(34,211,238,0.7)] hover:from-cyan-300 hover:to-blue-400 active:scale-95 transition-all"
              >
                <Download className="h-4 w-4 stroke-[2.5]" />
                <span>Download Ticket Pass (PNG / Image)</span>
              </button>

              <button
                onClick={() => {
                  window.print();
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-950/30 px-4 py-3.5 text-xs font-bold text-cyan-300 hover:bg-cyan-900/50 hover:border-cyan-400 transition-all"
              >
                <Printer className="h-4 w-4" />
                <span>Print Pass</span>
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto rounded-xl border border-neutral-800 px-5 py-3.5 text-xs font-semibold text-neutral-300 hover:bg-neutral-800 hover:text-white"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
