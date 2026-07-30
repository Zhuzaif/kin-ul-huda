import { useEffect, useState, useRef } from 'react';
import { Reply, Image as ImageIcon, Send, X, ShieldAlert, Tag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { parseChatMessage, stringifyChatMessage, compressImage } from '../utils/chatUtils';

type ChatUser = {
  id: string;
  name: string;
  lastMessageAt: string;
  category: string; // 'normal', 'spam', 'important'
  hasUnread: boolean;
};

export default function AalimaModeration() {
  const [chats, setChats] = useState<ChatUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  
  const [inputText, setInputText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [replyingToMsg, setReplyingToMsg] = useState<any | null>(null);
  
  const [filterType, setFilterType] = useState<'all' | 'spam' | 'important' | 'pics'>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      fetchMessages(selectedUserId);
      
      const channel = supabase
        .channel('admin-chat')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'aalima_queries', filter: `user_id=eq.${selectedUserId}` },
          () => { fetchMessages(selectedUserId); }
        )
        .subscribe();
        
      return () => { supabase.removeChannel(channel); };
    }
  }, [selectedUserId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  async function fetchChats() {
    const { data, error } = await supabase
      .from('aalima_queries')
      .select('id, user_id, status, created_at, nisa_users(full_name)');
      
    if (error) {
      console.error(error);
      return;
    }
    
    // Group by user_id
    const userMap = new Map<string, ChatUser>();
    
    data.forEach((row: any) => {
      const uid = row.user_id;
      if (!uid) return;
      
      const existing = userMap.get(uid);
      const rowDate = new Date(row.created_at).getTime();
      const existDate = existing ? new Date(existing.lastMessageAt).getTime() : 0;
      
      let category = 'normal';
      if (row.status === 'spam') category = 'spam';
      else if (row.status === 'important') category = 'important';
      
      // If we already have this user, just update lastMessageAt and status if it's a newer message
      if (!existing || rowDate > existDate) {
        userMap.set(uid, {
          id: uid,
          name: row.nisa_users?.full_name || 'Anonymous',
          lastMessageAt: row.created_at,
          category: category,
          hasUnread: row.status === 'pending'
        });
      }
      
      // If any message in thread is spam/important, mark the whole chat as such (simple heuristic)
      if (existing) {
        if (row.status === 'spam') existing.category = 'spam';
        if (row.status === 'important' && existing.category !== 'spam') existing.category = 'important';
        if (row.status === 'pending') existing.hasUnread = true;
      }
    });
    
    const sorted = Array.from(userMap.values()).sort((a, b) => 
      new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    );
    setChats(sorted);
  }

  async function fetchMessages(userId: string) {
    const { data, error } = await supabase
      .from('aalima_queries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
      
    if (error) {
      console.error(error);
      return;
    }
    setMessages(data || []);
  }

  async function handleSend() {
    if (!selectedUserId) return;
    if (!inputText.trim() && !imageFile) return;

    let base64Image = undefined;
    if (imageFile) {
      base64Image = await compressImage(imageFile);
    }

    const payload = stringifyChatMessage({
      text: inputText.trim(),
      image: base64Image,
      replyToId: replyingToMsg?.id
    });

    const { error } = await supabase.from('aalima_queries').insert({
      user_id: selectedUserId,
      question: '', // Workaround for DB constraint
      admin_reply: payload,
      status: 'admin_replied'
    });

    if (error) {
      alert('Failed to send message.');
    } else {
      // -------------------------------------------------------------
      // Push Notification Automation
      // Fetch the specific user's token and trigger direct push
      // -------------------------------------------------------------
      try {
        const { data: userTokens } = await supabase
          .from('nisa_users')
          .select('push_token')
          .eq('id', selectedUserId)
          .single();

        if (userTokens && userTokens.push_token) {
          await fetch('http://localhost:5000/api/send-direct', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              token: userTokens.push_token,
              title: 'New Reply from Aalima',
              body: 'You have a new message. Tap to view.',
              // We cannot send base64Image in push payload since FCM requires HTTPS URL
              data: { screen: 'nisa' } // This drives the deep link
            })
          });
        }
      } catch (err) {
        console.error('Failed to trigger direct push notification', err);
      }

      setInputText('');
      setImageFile(null);
      setImagePreview(null);
      setReplyingToMsg(null);
      fetchMessages(selectedUserId);
      fetchChats(); // Update last message time
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const setChatCategory = async (userId: string, category: string) => {
    const { error } = await supabase
      .from('aalima_queries')
      .update({ status: category })
      .eq('user_id', userId);
      
    if (!error) {
      fetchChats();
    }
  };

  const displayedChats = chats.filter(c => {
    if (filterType === 'all') return true;
    if (filterType === 'spam') return c.category === 'spam';
    if (filterType === 'important') return c.category === 'important';
    return true; // Handle pics separately or combine
  });

  return (
    <div className="h-full flex flex-col -mx-4 -mt-4">
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Chat List */}
        <div className="w-80 bg-white border-r border-gray-100 flex flex-col shadow-sm z-10">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
              {['all', 'important', 'spam'].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t as any)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize whitespace-nowrap transition-colors ${
                    filterType === t 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {displayedChats.map(chat => (
              <div 
                key={chat.id} 
                onClick={() => setSelectedUserId(chat.id)}
                className={`p-4 border-b border-gray-50 cursor-pointer transition-colors relative group flex items-start gap-3 ${
                  selectedUserId === chat.id 
                    ? 'bg-emerald-50/80 border-l-4 border-l-emerald-500' 
                    : chat.hasUnread 
                      ? 'bg-emerald-50/20 hover:bg-emerald-50/40 border-l-4 border-l-transparent' 
                      : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <h3 className={`font-medium truncate ${chat.hasUnread ? 'text-gray-900 font-bold' : 'text-gray-700'}`}>
                        {chat.name}
                      </h3>
                      {chat.hasUnread && <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0"></span>}
                    </div>
                    <span className={`text-[10px] shrink-0 ${chat.hasUnread ? 'text-emerald-600 font-medium' : 'text-gray-400'}`}>
                      {new Date(chat.lastMessageAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2">
                    {chat.category === 'important' && <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-medium">Important</span>}
                    {chat.category === 'spam' && <span className="bg-rose-100 text-rose-700 text-[10px] px-2 py-0.5 rounded-full font-medium">Spam</span>}
                  </div>
                </div>
                
                {/* Category Actions Dropdown on Hover */}
                <div className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button onClick={(e) => { e.stopPropagation(); setChatCategory(chat.id, 'important'); }} className="p-1.5 hover:bg-white rounded shadow-sm text-amber-500" title="Mark Important">
                    <Tag className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setChatCategory(chat.id, 'spam'); }} className="p-1.5 hover:bg-white rounded shadow-sm text-rose-500" title="Mark Spam">
                    <ShieldAlert className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setChatCategory(chat.id, 'pending'); }} className="p-1.5 hover:bg-white rounded shadow-sm text-gray-400" title="Clear Tag">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Active Chat */}
        <div className="flex-1 bg-gray-50/30 flex flex-col">
          {selectedUserId ? (
            <>
              {/* Chat Header */}
              <div className="h-16 bg-white border-b border-gray-100 px-6 flex items-center shadow-sm z-10">
                <h3 className="font-semibold text-gray-800">
                  {chats.find(c => c.id === selectedUserId)?.name || 'User'}
                </h3>
              </div>
              
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map(msg => {
                  const isUser = !!msg.question;
                  const rawContent = msg.question || msg.admin_reply || msg.ai_answer || '';
                  const parsed = parseChatMessage(rawContent);
                  
                  // Find quoted message text if replyToId exists
                  let quotedText = '';
                  if (parsed?.replyToId) {
                    const quotedMsg = messages.find(m => m.id === parsed.replyToId);
                    if (quotedMsg) {
                      const quotedParsed = parseChatMessage(quotedMsg.question || quotedMsg.admin_reply || quotedMsg.ai_answer);
                      quotedText = quotedParsed?.text || 'Image attachment';
                    }
                  }

                  return (
                    <div key={msg.id} className={`flex flex-col ${isUser ? 'items-start' : 'items-end'}`}>
                      <div className={`max-w-[70%] group relative ${isUser ? 'mr-12' : 'ml-12'}`}>
                        
                        {/* Reply Button (Hover) */}
                        <button 
                          onClick={() => setReplyingToMsg(msg)}
                          className={`absolute top-1/2 -translate-y-1/2 p-1.5 bg-white shadow-sm border border-gray-100 rounded-full text-gray-400 hover:text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity ${isUser ? '-right-10' : '-left-10'}`}
                        >
                          <Reply className="w-4 h-4" />
                        </button>

                        {/* Quoted Message Box */}
                        {parsed?.replyToId && (
                          <div className={`text-[11px] p-2 mb-1 rounded-md border-l-2 ${isUser ? 'bg-white text-gray-500 border-gray-300' : 'bg-emerald-700/20 text-emerald-100 border-emerald-300'}`}>
                            Replying to: {quotedText.length > 50 ? quotedText.slice(0, 50) + '...' : quotedText}
                          </div>
                        )}

                        {/* Actual Message Bubble */}
                        <div className={`p-3 rounded-2xl overflow-hidden ${
                          isUser 
                            ? 'bg-white border border-gray-100 text-gray-800 shadow-sm rounded-tl-sm' 
                            : 'bg-emerald-600 text-white rounded-tr-sm shadow-md'
                        }`}>
                          {parsed?.image && (
                            <img 
                              src={parsed.image} 
                              alt="attachment" 
                              className="rounded-xl mb-2 max-w-full max-h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity" 
                              onClick={() => setFullscreenImage(parsed.image!)}
                            />
                          )}
                          <p className="text-[13px] whitespace-pre-wrap break-words leading-relaxed">{parsed?.text}</p>
                        </div>
                        <div className={`text-[10px] text-gray-400 mt-1 ${isUser ? 'text-left ml-1' : 'text-right mr-1'}`}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="bg-white border-t border-gray-100 p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.02)] z-10">
                {replyingToMsg && (
                  <div className="flex items-center justify-between bg-gray-50 p-2 rounded-t-lg border-x border-t border-gray-100 text-xs text-gray-500 mb-[-1px] relative z-0">
                    <div className="flex items-center gap-2">
                      <Reply className="w-3.5 h-3.5" />
                      Replying to a message...
                    </div>
                    <button onClick={() => setReplyingToMsg(null)} className="hover:text-gray-700"><X className="w-3.5 h-3.5" /></button>
                  </div>
                )}
                
                {imagePreview && (
                  <div className="relative inline-block mb-3 bg-gray-50 p-2 rounded-lg border border-gray-200">
                    <img src={imagePreview} alt="Preview" className="h-20 rounded-md object-cover" />
                    <button 
                      onClick={() => { setImageFile(null); setImagePreview(null); }}
                      className="absolute -top-2 -right-2 bg-gray-900 text-white p-1 rounded-full shadow-sm"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                
                <div className="flex items-end gap-3 relative z-10">
                  <label className="p-3 text-gray-400 hover:text-emerald-600 bg-gray-50 hover:bg-emerald-50 rounded-xl cursor-pointer transition-colors border border-gray-100">
                    <ImageIcon className="w-5 h-5" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                  
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type a message..."
                    rows={1}
                    className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                  />
                  
                  <button 
                    onClick={handleSend}
                    disabled={!inputText.trim() && !imageFile}
                    className="p-3 bg-emerald-600 text-white rounded-xl shadow-md hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 bg-white">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                  <Send className="w-6 h-6 text-gray-300" />
                </div>
                <p>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setFullscreenImage(null)}
        >
          <button 
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            onClick={() => setFullscreenImage(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={fullscreenImage} 
            alt="Fullscreen" 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
          />
        </div>
      )}
    </div>
  );
}
