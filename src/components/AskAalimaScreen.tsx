import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Send, Bot, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { askAalima } from '../utils/askAalima';

const SUGGESTIONS = [
  'Can I read Quran during my period?',
  'When is ghusl required after Haiz?',
  'What is the difference between Haiz and Istihada?',
  'Do I make up missed fasts after my period?',
];

type Message = { role: 'user' | 'assistant'; text: string };

interface AskAalimaScreenProps {
  onBack: () => void;
}

export default function AskAalimaScreen({ onBack }: AskAalimaScreenProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'As-salamu alaikum. I am Aalima, your AI guide for women\'s fiqh. Ask about purity, salah, fasting, or daily worship — I will answer with care and clarity.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text?: string) => {
    const q = (text ?? input).trim();
    if (!q || loading) return;

    const userMsg: Message = { role: 'user', text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));
      const answer = await askAalima(q, history);
      setMessages((prev) => [...prev, { role: 'assistant', text: answer }]);
    } catch (e) {
      const err = e instanceof Error ? e.message : 'Something went wrong.';
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `I could not respond right now. ${err} Please try again or read the fiqh topics below.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 bg-warm-beige z-50 flex flex-col animate-in fade-in duration-300">
      <div className="sticky top-0 z-10 bg-warm-beige/90 backdrop-blur-md px-6 py-4 flex items-center gap-3 border-b border-gray-200/40">
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100/50 active:scale-95 transition-all"
          aria-label="Go back"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-soft-pink-dark to-[#D98A5B] flex items-center justify-center shadow-md flex-shrink-0">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-gray-800 tracking-tight leading-tight">Ask Aalima</h1>
            <p className="text-[11px] font-medium text-[#D98A5B]">AI fiqh assistant</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar px-6 py-4">
        <div className="flex flex-col gap-3">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[88%] rounded-[22px] px-4 py-3 text-[13px] leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#2B604A] text-white font-medium'
                    : 'bg-white/85 border border-white/70 text-gray-700 shadow-sm'
                }`}
              >
                {msg.role === 'assistant' && (
                  <Bot className="w-4 h-4 text-[#D98A5B] mb-1.5" />
                )}
                {msg.text}
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/85 border border-white/70 rounded-[22px] px-4 py-3 flex items-center gap-2 text-gray-500 text-[13px]">
                <Loader2 className="w-4 h-4 animate-spin text-[#D98A5B]" />
                Aalima is thinking...
              </div>
            </div>
          )}
        </div>

        {messages.length <= 1 && (
          <div className="mt-6 flex flex-col gap-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-1">
              Suggested questions
            </p>
            {SUGGESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => sendMessage(q)}
                className="text-left text-[13px] font-medium text-gray-700 bg-white/60 rounded-[18px] px-4 py-3 border border-white/70 active:scale-[0.98] transition-all hover:bg-white"
              >
                {q}
              </button>
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-6 pb-6 pt-2 border-t border-gray-200/30 bg-warm-beige/95 backdrop-blur-sm">
        <p className="text-[10px] text-gray-400 text-center mb-2 leading-relaxed">
          General guidance only — not a personal fatwa. Consult a scholar for complex cases.
        </p>
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, 600))}
            placeholder="Ask about purity, salah, fasting..."
            rows={2}
            className="flex-1 bg-white/90 rounded-[20px] px-4 py-3 text-[13px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-soft-pink-dark/30 border border-white/60 resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button
            type="button"
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-soft-pink-dark to-[#D98A5B] flex items-center justify-center shadow-md active:scale-95 transition-all disabled:opacity-40"
            aria-label="Send"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
