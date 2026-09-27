import React, { useState, useRef, useEffect } from 'react';
import { Bot, MessageSquare, X, Send, Sparkles, RefreshCw, ChevronDown, Check, HelpCircle, Film } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'duo';
  text: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  'How do I sell my spare ticket?',
  'Can I download the ticket pass?',
  'How does the gate QR scanner work?',
  'What is the anti-scalping price rule?',
  'How fast does my listing go live?',
];

export const DuoBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'duo',
      text: "Hi there! I'm **Duo**, your AI Cinema Assistant on **passmytckt**.\n\nHave questions about buying spare tickets, selling unused seats, or downloading your digital passes? Ask me anything!",
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/duo/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) {
        throw new Error('Server returned an error');
      }

      const data = await response.json();
      const duoReply: ChatMessage = {
        id: `duo-${Date.now()}`,
        sender: 'duo',
        text: data.reply || "I'm here to help with any doubts about passmytckt!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, duoReply]);
    } catch (err) {
      console.error('Failed to communicate with Duo:', err);
      const fallbackReply: ChatMessage = {
        id: `duo-${Date.now()}`,
        sender: 'duo',
        text: "I can help with that! On **passmytckt**, you can easily buy or sell spare cinema tickets at original face value or below. After buying, you can immediately download your verified Digital QR Pass to your device!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  // Simple Markdown-like renderer for bold and bullet lists
  const renderMessageContent = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-1.5 leading-relaxed text-xs sm:text-[13px]">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1.5" />;

          // Process bold tags
          const parts = line.split(/(\*\*.*?\*\*)/g);
          const renderedLine = parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-bold text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.3)]">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          });

          if (line.startsWith('• ') || line.startsWith('- ')) {
            return (
              <div key={idx} className="flex items-start gap-1.5 ml-1">
                <span className="text-cyan-400 font-bold">•</span>
                <span>{renderedLine.slice(1)}</span>
              </div>
            );
          }

          if (/^\d+\.\s/.test(line)) {
            return (
              <div key={idx} className="flex items-start gap-1.5 ml-1">
                <span className="text-amber-400 font-bold font-mono">{line.match(/^\d+\./)?.[0]}</span>
                <span>{renderedLine}</span>
              </div>
            );
          }

          return <div key={idx}>{renderedLine}</div>;
        })}
      </div>
    );
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 z-40 flex items-center gap-3">
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 rounded-full border border-cyan-400/50 bg-[#090912]/95 px-4 py-3 text-white shadow-[0_0_25px_rgba(6,182,212,0.4)] backdrop-blur-xl transition-all hover:scale-105 hover:border-cyan-300 hover:shadow-[0_0_35px_rgba(34,211,238,0.7)] active:scale-95"
            aria-label="Ask Duo AI Bot"
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-black shadow-[0_0_12px_rgba(34,211,238,0.8)]">
              <Bot className="h-4.5 w-4.5 stroke-[2.4]" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400"></span>
              </span>
            </div>
            <div className="text-left pr-1">
              <div className="flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-cyan-300">
                <span>Ask Duo</span>
                <Sparkles className="h-3 w-3 text-amber-400" />
              </div>
              <div className="text-[10px] text-neutral-400 font-medium">
                Got questions? Ask AI
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 flex h-[580px] max-h-[88vh] w-[92vw] max-w-[420px] flex-col overflow-hidden rounded-3xl border border-cyan-500/40 bg-[#07070e]/95 shadow-[0_0_50px_rgba(6,182,212,0.35)] backdrop-blur-2xl transition-all animate-in fade-in slide-in-from-bottom-5">
          {/* Top Neon Laser Line */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_#22d3ee]" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-800/80 bg-[#0a0a14] px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-600 text-black shadow-[0_0_15px_rgba(34,211,238,0.7)]">
                <Bot className="h-5 w-5 stroke-[2.4]" />
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border border-black" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-display text-sm font-extrabold text-white">
                  <span>Duo</span>
                  <span className="rounded-full bg-cyan-500/20 border border-cyan-400/40 px-1.5 py-0.2 text-[9px] font-bold text-cyan-300">
                    AI ASSISTANT
                  </span>
                </div>
                <div className="text-[11px] text-neutral-400">
                  Instant answers for passmytckt
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setMessages([
                    {
                      id: 'welcome-reset',
                      sender: 'duo',
                      text: "Chat cleared! How can I assist you with **passmytckt**?",
                      timestamp: 'Just now',
                    },
                  ]);
                }}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
                title="Clear chat"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-neutral-200 ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-semibold shadow-[0_0_15px_rgba(6,182,212,0.3)] rounded-br-xs'
                      : 'border border-cyan-500/20 bg-[#0e0e1a]/90 text-neutral-200 shadow-md shadow-black/40 rounded-bl-xs'
                  }`}
                >
                  {renderMessageContent(msg.text)}
                </div>
                <span className="mt-1 text-[10px] text-neutral-500 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 rounded-2xl border border-cyan-500/20 bg-[#0e0e1a]/90 p-3 text-neutral-400 w-fit">
                <Bot className="h-4 w-4 text-cyan-400 animate-spin" />
                <span className="text-xs text-cyan-300">Duo is answering your doubt...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompt chips */}
          <div className="border-t border-neutral-800/60 bg-[#07070e] px-3 py-2 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isLoading}
                  className="rounded-full border border-neutral-800 bg-neutral-900/80 px-2.5 py-1 text-[10px] font-semibold text-neutral-300 hover:border-cyan-400 hover:text-cyan-200 hover:bg-cyan-950/40 transition-all disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 border-t border-cyan-500/20 bg-[#0a0a14] p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Duo any question about tickets..."
              className="flex-1 rounded-xl border border-neutral-800 bg-[#050509] px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-[0_0_12px_rgba(34,211,238,0.5)] transition-all hover:from-cyan-300 hover:to-blue-400 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <Send className="h-4 w-4 stroke-[2.5]" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
