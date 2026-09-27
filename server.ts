import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Server-side Gemini initialization
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      })
    : null;

  // AI Assistant "Duo" Doubt-clearing endpoint
  app.post('/api/duo/chat', async (req, res) => {
    try {
      const { message } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
      }

      const systemInstruction = `You are "Duo", the friendly and knowledgeable AI assistant for passmytckt (a real-time cinema ticket resale exchange).
Your purpose is to clear doubts for website users looking to buy or sell spare cinema tickets.

About passmytckt:
1. Core Mission: Prevent wasted cinema tickets and money when moviegoers cannot attend due to last-minute scheduling conflicts, traffic, or emergencies.
2. Anti-Scalping Guarantee: Sellers are strictly prohibited from charging above face value (resale price <= original retail price). Many tickets are discounted!
3. Buying Process:
   - Turn on GPS or select a metro city.
   - Filter by cinema hall, movie, date, format (IMAX, 3D, Dolby), and showtime.
   - Choose a verified ticket to review screen, seat numbers (e.g. F12, F13), and seller note.
   - Checkout securely (Apple Pay, Card, UPI).
   - Instantly download the high-resolution Digital QR Cinema Pass (PNG image) or print it for gate entry.
4. Selling Process:
   - Click "Sell My Ticket" or "Sell Ticket".
   - Select cinema theatre and movie title.
   - Enter showtime, auditorium/screen, seats, and original purchase price.
   - Set fair resale price (never above original price).
   - Enter booking reference and brief seller note.
   - Publish live instantly to nearby moviegoers.
5. Entry & Downloads:
   - Passes include authenticated booking IDs and high-contrast QR codes accepted at auditorium gates.
   - All purchased tickets can be re-downloaded at any time under the "History" tab (Purchased Tickets).
6. Tone: Warm, movie-lover enthusiasm, concise, helpful, and reassuring. Use bolding and concise bullet points where helpful.`;

      if (ai) {
        const prompt = `${systemInstruction}\n\nUser Question: ${message}`;
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        const reply = response.text || "I'm Duo, here to clear any doubts about passmytckt!";
        return res.json({ reply });
      } else {
        return res.json({
          reply: getFallbackAnswer(message),
        });
      }
    } catch (err: any) {
      console.error('Error in /api/duo/chat:', err);
      const fallback = getFallbackAnswer(req.body?.message || '');
      return res.json({ reply: fallback });
    }
  });

  function getFallbackAnswer(query: string): string {
    const q = query.toLowerCase();
    if (q.includes('sell') || q.includes('list') || q.includes('post')) {
      return "To sell your spare ticket on **passmytckt**:\n\n• Click **'Sell My Ticket'** in the top navigation.\n• Choose your theatre, movie, and showtime.\n• Enter your reserved seats (e.g. F12, F13) and original ticket price.\n• Set your resale price (must be equal to or lower than original face value).\n• Provide your booking reference and a quick reason for selling.\n• Tap **'Publish Ticket Online Now'** and your pass goes live immediately for nearby fans!";
    }
    if (q.includes('buy') || q.includes('search') || q.includes('find') || q.includes('get')) {
      return "To buy a spare ticket:\n\n• Turn on GPS or select your metro city in the top bar.\n• Tap **'Search Tickets'** to view available listings at local cinemas.\n• Filter by movie title, format (IMAX, 3D, Dolby), and showtime.\n• Tap any ticket to inspect seats and review the seller's verified details.\n• Complete checkout and instantly receive your **Digital QR Gate Pass**!";
    }
    if (q.includes('download') || q.includes('save') || q.includes('png') || q.includes('photo')) {
      return "Yes! When you buy a ticket, an instant **'Download Ticket Pass (PNG / Image)'** button is generated on screen. You can also re-download your digital pass anytime from the **History** tab (**Purchased Tickets**). It saves an authenticated gate-scan image directly to your phone or computer!";
    }
    if (q.includes('price') || q.includes('scalp') || q.includes('profit') || q.includes('expensive')) {
      return "**passmytckt** has a strict **Zero-Scalping Rule**: resale prices can **never** exceed the original retail face value. Every listing is either at face value or discounted by movie fans who simply want to avoid wasting an empty seat!";
    }
    if (q.includes('qr') || q.includes('gate') || q.includes('entry') || q.includes('scanner') || q.includes('work')) {
      return "Every pass issued on **passmytckt** comes with a verified **Gate Admission QR Code** and authentication reference. Simply present the QR pass on your phone screen or printed copy to the theater ticket scanner or usher at the auditorium doors for entry!";
    }
    if (q.includes('who') || q.includes('name') || q.includes('duo')) {
      return "Hi! I'm **Duo**, your AI Cinema Concierge on **passmytckt**. I'm here 24/7 to clear all your doubts about buying, selling, downloading tickets, or cinema policies!";
    }
    return "Hi, I'm **Duo**! I can help you with anything on **passmytckt**:\n\n• How to buy or sell spare cinema tickets\n• Fair resale price rules (never above face value)\n• Downloading your Digital QR Pass to your device\n• Gate scanning and entry assurance\n\nWhat can I answer for you?";
  }

  // Vite dev middleware or static production serve
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`passmytckt server listening on port ${PORT}`);
  });
}

startServer();
