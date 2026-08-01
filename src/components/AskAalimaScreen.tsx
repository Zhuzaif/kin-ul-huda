import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Send, Bot, Loader2, Image as ImageIcon, X, Reply } from 'lucide-react';
import { motion } from 'motion/react';
import { useProfile } from '../contexts/ProfileContext';
import { supabase } from '../lib/supabase';
import { parseChatMessage, stringifyChatMessage, compressImage } from '../utils/chatUtils';

type Message = { 
  id?: string;
  role: 'user' | 'assistant'; 
  text: string;
  image?: string;
  replyToId?: string;
};

interface AskAalimaScreenProps {
  onBack: () => void;
}

export default function AskAalimaScreen({ onBack }: AskAalimaScreenProps) {
  const { profile, updateProfile } = useProfile();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'As-salamu alaikum. I am the Aalima, your guide for women\'s fiqh. Ask about purity, salah, fasting, or daily worship — I will answer your questions as soon as possible.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [replyingToMsg, setReplyingToMsg] = useState<Message | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profile?.userId) return;

    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from('aalima_queries')
        .select('*')
        .eq('user_id', profile.userId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching chat history', error);
        return;
      }

      if (data && data.length > 0) {
        const historyMsgs: Message[] = [];
        data.forEach((q) => {
          if (q.question) {
            const parsed = parseChatMessage(q.question);
            historyMsgs.push({ id: q.id, role: 'user', ...parsed });
          }
          if (q.admin_reply) {
            const parsed = parseChatMessage(q.admin_reply);
            historyMsgs.push({ id: q.id + '-r', role: 'assistant', ...parsed });
          } else if (q.ai_answer && q.status !== 'pending') {
            const parsed = parseChatMessage(q.ai_answer);
            historyMsgs.push({ id: q.id + '-ai', role: 'assistant', ...parsed });
          }
        });
        
        setMessages(prev => [prev[0], ...historyMsgs]);
      }
    };

    fetchHistory();

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT for new replies, UPDATE for older style)
          schema: 'public',
          table: 'aalima_queries',
          filter: `user_id=eq.${profile.userId}`,
        },
        () => {
          fetchHistory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.userId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, loading]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const sendMessage = async () => {
    const q = input.trim();
    if ((!q && !imageFile) || loading) return;

    setLoading(true);

    try {
      let currentUserId = profile?.userId;
      
      if (!currentUserId) {
        const { data, error } = await supabase.from('nisa_users').insert([
          {
            full_name: profile?.name || 'Anonymous',
            email: `anon_${Date.now()}@anonymous.local`,
            madhab: profile?.madhab || 'hanafi',
            country: profile?.locationCoords ? `${profile.locationCoords.lat},${profile.locationCoords.lng}` : 'Unknown'
          }
        ]).select().single();
        
        if (error || !data) throw new Error('Unable to create local user profile.');
        currentUserId = data.id;
        updateProfile({ userId: data.id });
      }

      let base64Image = undefined;
      if (imageFile) {
        base64Image = await compressImage(imageFile);
      }

      const payload = stringifyChatMessage({
        text: q,
        image: base64Image,
        replyToId: replyingToMsg?.id
      });

      // Optimistic update
      const tempId = `temp-${Date.now()}`;
      setMessages(prev => [...prev, { id: tempId, role: 'user', text: q, image: base64Image, replyToId: replyingToMsg?.id }]);
      setInput('');
      setImageFile(null);
      setImagePreview(null);
      setReplyingToMsg(null);

      const { error } = await supabase.from('aalima_queries').insert([
        { 
          user_id: currentUserId, 
          question: payload,
          status: 'pending' 
        }
      ]);

      if (error) {
        setMessages(prev => prev.filter(m => m.id !== tempId));
        throw error;
      }
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Unable to send your message right now. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 bg-theme-surface z-50 flex flex-col animate-in fade-in duration-300">
      <div className="sticky top-0 z-10 bg-theme-surface/90 backdrop-blur-md px-6 py-4 flex items-center gap-3 border-b border-theme-border">
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-theme-surface-card shadow-sm border border-theme-border active:scale-95 transition-all"
        >
          <ChevronLeft className="w-5 h-5 text-text-secondary" />
        </button>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-soft-pink-dark to-[#D98A5B] flex items-center justify-center shadow-md flex-shrink-0">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-text-primary tracking-tight leading-tight">Ask Aalima</h1>
            <p className="text-[11px] font-medium text-[#D98A5B]">Your trusted fiqh advisor</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar px-4 sm:px-6 py-4">
        <div className="flex flex-col gap-4">
          {messages.map((msg, i) => {
            let quotedText = '';
            if (msg.replyToId) {
              const quotedMsg = messages.find(m => m.id === msg.replyToId || m.id?.startsWith(msg.replyToId!));
              quotedText = quotedMsg?.text || (quotedMsg?.image ? 'Image attachment' : '');
            }

            return (
              <motion.div
                key={msg.id || i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className={`max-w-[85%] group relative flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  
                  {/* Reply Button inside the app */}
                  <button 
                    onClick={() => setReplyingToMsg(msg)}
                    className={`absolute top-1/2 -translate-y-1/2 p-2 bg-theme-surface-card backdrop-blur shadow-sm rounded-full text-text-tertiary active:scale-95 transition-all z-10 ${
                      msg.role === 'user' ? '-left-12' : '-right-12'
                    }`}
                  >
                    <Reply className="w-4 h-4" />
                  </button>

                  {/* Quoted Reply box */}
                  {msg.replyToId && quotedText && (
                    <div className={`text-[11px] px-2 py-1 mb-1 rounded-lg border-l-2 max-w-full truncate ${
                      msg.role === 'user' 
                        ? 'bg-[#1E4334] text-white/80 border-[#3D8566]' 
                        : 'bg-theme-surface-card text-text-tertiary border-theme-border-strong'
                    }`}>
                      {quotedText.length > 40 ? quotedText.slice(0, 40) + '...' : quotedText}
                    </div>
                  )}

                  <div className={`rounded-2xl px-4 py-3 text-[13px] leading-relaxed relative ${
                    msg.role === 'user'
                      ? 'bg-theme-accent text-white font-medium rounded-tr-sm shadow-md'
                      : 'bg-theme-surface-card border border-theme-border text-text-secondary shadow-sm rounded-tl-sm'
                  }`}>
                    {msg.image && (
                      <img src={msg.image} alt="Attachment" className="max-w-full rounded-lg mb-2" />
                    )}
                    {msg.text}
                  </div>
                </div>
              </motion.div>
            )
          })}
          
          {loading && (
            <div className="flex justify-end">
              <div className="bg-theme-accent/70 text-white rounded-[22px] px-4 py-3 flex items-center gap-2 text-[13px]">
                <Loader2 className="w-4 h-4 animate-spin text-white/80" />
                Sending...
              </div>
            </div>
          )}
        </div>
        <div ref={bottomRef} className="h-4" />
      </div>

      <div className="px-4 sm:px-6 pb-6 pt-3 border-t border-theme-border bg-theme-surface/95 backdrop-blur-sm relative">
        
        {/* Reply To Preview Box */}
        {replyingToMsg && (
          <div className="absolute -top-12 left-4 right-4 bg-theme-surface-card backdrop-blur-md rounded-t-xl px-4 py-2 shadow-sm border border-theme-border flex items-center justify-between z-0">
            <div className="flex items-center gap-2 overflow-hidden">
              <Reply className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs text-text-secondary truncate">
                {replyingToMsg.text ? (replyingToMsg.text.length > 40 ? replyingToMsg.text.slice(0,40)+'...' : replyingToMsg.text) : 'Image'}
              </span>
            </div>
            <button onClick={() => setReplyingToMsg(null)} className="text-text-muted hover:text-gray-700 p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Image Preview Box */}
        {imagePreview && (
          <div className="absolute bottom-[100%] left-4 mb-2 bg-theme-surface-card p-2 rounded-xl shadow-lg border border-theme-border max-w-[120px]">
            <button 
              onClick={() => { setImageFile(null); setImagePreview(null); }}
              className="absolute -top-2 -right-2 bg-gray-900 text-white p-1 rounded-full shadow-sm"
            >
              <X className="w-3 h-3" />
            </button>
            <img src={imagePreview} alt="Preview" className="w-full h-auto rounded-lg object-cover" />
          </div>
        )}

        <div className="flex gap-2 items-end relative z-10">
          <label className="w-12 h-12 flex items-center justify-center rounded-full bg-theme-surface-card shadow-sm border border-theme-border text-text-muted hover:text-[#D98A5B] active:scale-95 transition-all cursor-pointer shrink-0">
            <ImageIcon className="w-5 h-5" />
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, 1000))}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 bg-theme-surface-card rounded-[20px] px-4 py-3.5 text-[13px] text-text-secondary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-soft-pink-dark/30 border border-theme-border resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button
            onClick={sendMessage}
            disabled={(!input.trim() && !imageFile) || loading}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-soft-pink-dark to-[#D98A5B] flex items-center justify-center shadow-md active:scale-95 transition-all disabled:opacity-40 shrink-0"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
