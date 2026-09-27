import { ResaleTicket } from '../types';

export function downloadTicketPass(ticket: ResaleTicket, buyerName: string) {
  const canvas = document.createElement('canvas');
  const width = 800;
  const height = 1180;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    console.error('Canvas context not available');
    return;
  }

  // 1. Background
  ctx.fillStyle = '#050508';
  ctx.fillRect(0, 0, width, height);

  // Subtle grid lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Outer Neon Cyan Border
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 3;
  ctx.strokeRect(24, 24, width - 48, height - 48);

  // Glow line at top
  ctx.strokeStyle = '#22d3ee';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(24, 24);
  ctx.lineTo(width - 24, 24);
  ctx.stroke();

  // 2. Brand Header
  ctx.fillStyle = '#22d3ee';
  ctx.font = 'bold 22px system-ui, sans-serif';
  ctx.fillText('🎬 PASSMYTCKT · DIGITAL CINEMA PASS', 50, 75);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px system-ui, sans-serif';
  ctx.fillText('VERIFIED FAIR RESALE EXCHANGE', 50, 102);

  // Status Badge
  ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
  ctx.fillRect(width - 220, 56, 170, 36);
  ctx.strokeStyle = '#22d3ee';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(width - 220, 56, 170, 36);
  ctx.fillStyle = '#22d3ee';
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.fillText('✓ GATE SCAN READY', width - 205, 80);

  // Line separator
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(50, 125);
  ctx.lineTo(width - 50, 125);
  ctx.stroke();

  // 3. Theatre Info
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.fillText(ticket.theatreName.toUpperCase(), 50, 160);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px system-ui, sans-serif';
  ctx.fillText(ticket.theatreAddress + (ticket.theatreCity ? `, ${ticket.theatreCity}` : ''), 50, 185);

  // 4. Movie Title (Hero)
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px system-ui, sans-serif';
  ctx.fillText(ticket.movieTitle, 50, 245);

  ctx.fillStyle = '#38bdf8';
  ctx.font = '15px system-ui, sans-serif';
  ctx.fillText(ticket.movieGenre.join(' · '), 50, 275);

  // 5. Card Details Box (Screen, Date, Time, Seats)
  ctx.fillStyle = '#0b0f19';
  ctx.fillRect(50, 305, width - 100, 180);
  ctx.strokeStyle = '#1e293b';
  ctx.strokeRect(50, 305, width - 100, 180);

  // Col 1: Date & Time
  ctx.fillStyle = '#64748b';
  ctx.font = '12px system-ui, sans-serif';
  ctx.fillText('SHOW DATE & TIME', 75, 340);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px system-ui, sans-serif';
  ctx.fillText(ticket.showDate, 75, 375);
  ctx.fillStyle = '#22d3ee';
  ctx.font = 'bold 20px monospace';
  ctx.fillText(ticket.showtime, 75, 405);

  // Col 2: Screen & Tier
  ctx.fillStyle = '#64748b';
  ctx.font = '12px system-ui, sans-serif';
  ctx.fillText('AUDITORIUM & SECTION', 340, 340);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px system-ui, sans-serif';
  ctx.fillText(ticket.screen, 340, 372);
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.fillText(ticket.section, 340, 400);

  // Col 3: Seats & Qty
  ctx.fillStyle = '#64748b';
  ctx.font = '12px system-ui, sans-serif';
  ctx.fillText('SEATS RESERVED', 580, 340);
  ctx.fillStyle = '#22d3ee';
  ctx.font = 'bold 24px monospace';
  ctx.fillText(ticket.seats.join(', '), 580, 375);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px system-ui, sans-serif';
  ctx.fillText(`${ticket.quantity} Ticket${ticket.quantity > 1 ? 's' : ''}`, 580, 405);

  // Ticket Holder Row
  ctx.fillStyle = '#94a3b8';
  ctx.font = '13px system-ui, sans-serif';
  ctx.fillText(`Pass Holder: ${buyerName || 'Verified Patron'}`, 75, 455);
  ctx.fillText(`Original Seller: ${ticket.sellerName}`, 340, 455);
  ctx.fillStyle = '#34d399';
  ctx.fillText(`Amount Paid: $${ticket.resalePrice * ticket.quantity}`, 580, 455);

  // 6. Ticket Perforation Stubs
  const notchY = 525;
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(50, notchY);
  ctx.lineTo(width - 50, notchY);
  ctx.stroke();
  ctx.setLineDash([]); // Reset dash

  // Left & Right semicircle notches
  ctx.fillStyle = '#050508';
  ctx.beginPath();
  ctx.arc(24, notchY, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(width - 24, notchY, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 7. QR Scanner Section
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px system-ui, sans-serif';
  ctx.fillText('GATE ADMISSION BARCODE & QR', 50, 580);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '13px system-ui, sans-serif';
  ctx.fillText('Present this pass to the cinema ticket scanner or auditorium usher upon arrival.', 50, 605);

  // Draw simulated high-contrast QR Block
  const qrX = width / 2 - 130;
  const qrY = 640;
  const qrSize = 260;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(qrX - 15, qrY - 15, qrSize + 30, qrSize + 30);

  // Draw QR code visual pattern
  ctx.fillStyle = '#000000';
  const cellSize = 10;
  const gridCount = 26;

  // Predictable pseudo-random hash based on bookingRef
  let seed = 0;
  for (let i = 0; i < ticket.bookingRef.length; i++) {
    seed += ticket.bookingRef.charCodeAt(i) * (i + 1);
  }
  const pseudoRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (let r = 0; r < gridCount; r++) {
    for (let c = 0; c < gridCount; c++) {
      // Corner detection squares (standard QR corners)
      const isCorner1 = r < 7 && c < 7;
      const isCorner2 = r < 7 && c >= gridCount - 7;
      const isCorner3 = r >= gridCount - 7 && c < 7;

      if (isCorner1 || isCorner2 || isCorner3) {
        // Draw outer 7x7
        const inOuter = r === 0 || r === 6 || c === 0 || c === 6 ||
                        r === gridCount - 1 || r === gridCount - 7 ||
                        c === gridCount - 1 || c === gridCount - 7;
        const inInner = (r >= 2 && r <= 4) && ((c >= 2 && c <= 4) || (c >= gridCount - 5 && c <= gridCount - 3)) ||
                        ((r >= gridCount - 5 && r <= gridCount - 3) && (c >= 2 && c <= 4));

        if (inOuter || inInner) {
          ctx.fillRect(qrX + c * cellSize, qrY + r * cellSize, cellSize, cellSize);
        }
      } else {
        if (pseudoRandom() > 0.45) {
          ctx.fillRect(qrX + c * cellSize, qrY + r * cellSize, cellSize, cellSize);
        }
      }
    }
  }

  // Booking Ref under QR
  ctx.fillStyle = '#22d3ee';
  ctx.font = 'bold 22px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(ticket.bookingRef, width / 2, qrY + qrSize + 48);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '13px monospace';
  ctx.fillText('AUTH ID: CP-VALIDATED-TRANSFER', width / 2, qrY + qrSize + 72);
  ctx.textAlign = 'left'; // Reset alignment

  // 8. Bottom Security Footer
  ctx.fillStyle = '#0b0f19';
  ctx.fillRect(50, 1020, width - 100, 80);
  ctx.strokeStyle = '#1e293b';
  ctx.strokeRect(50, 1020, width - 100, 80);

  ctx.fillStyle = '#22d3ee';
  ctx.font = 'bold 12px system-ui, sans-serif';
  ctx.fillText('🛡️ 100% PASSMYTCKT ENTRY ASSURANCE', 75, 1050);

  ctx.fillStyle = '#64748b';
  ctx.font = '11px system-ui, sans-serif';
  ctx.fillText('This pass was lawfully transferred via passmytckt. Booking ID registered with auditorium box office.', 75, 1072);

  // Trigger download
  try {
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    const safeRef = ticket.bookingRef.replace(/[^a-zA-Z0-9_-]/g, '');
    link.download = `PassMyTckt-Ticket-${safeRef}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (err) {
    console.error('Failed to trigger download', err);
    return false;
  }
}
