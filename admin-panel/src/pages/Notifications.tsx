import React, { useState, useEffect } from 'react';
import { Send, Smartphone, History, ChevronDown, Image as ImageIcon, Smartphone as PhoneIcon, Plus, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Notifications() {
  const [activeStep, setActiveStep] = useState(1);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [campaignName, setCampaignName] = useState('');
  
  // Scheduling state
  const [scheduleType, setScheduleType] = useState('now');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  // Advanced options state
  const [conversionEvent, setConversionEvent] = useState('none');
  const [androidChannel, setAndroidChannel] = useState('');
  const [sound, setSound] = useState('default');
  const [expiryValue, setExpiryValue] = useState('');
  const [expiryUnit, setExpiryUnit] = useState('weeks');
  
  const [customDataList, setCustomDataList] = useState<{key: string, value: string}[]>([]);
  
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  // Status and History
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    const { data, error } = await supabase
      .from('push_notifications')
      .select('*')
      .order('sent_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching history:', error);
      return;
    }
    if (data) setHistory(data);
  }

  const handleAddCustomData = () => {
    if (newKey && newValue) {
      setCustomDataList([...customDataList, { key: newKey, value: newValue }]);
      setNewKey('');
      setNewValue('');
    }
  };

  const handleRemoveCustomData = (index: number) => {
    setCustomDataList(customDataList.filter((_, i) => i !== index));
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) {
      alert("Title and text are required");
      return;
    }
    
    let finalScheduledTime = undefined;
    if (scheduleType === 'later') {
      if (!scheduledDate || !scheduledTime) {
        alert("Please select date and time for scheduled notification.");
        return;
      }
      finalScheduledTime = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
    }
    
    setStatus('sending');

    const { data: users, error: fetchError } = await supabase
      .from('nisa_users')
      .select('push_token')
      .not('push_token', 'is', null);

    if (fetchError) {
      console.error('Error fetching users:', fetchError);
      alert('Failed to fetch users');
      setStatus('idle');
      return;
    }

    const tokens = users.map(u => u.push_token).filter(Boolean);

    if (tokens.length === 0) {
      alert('No users have enabled notifications yet!');
      setStatus('idle');
      return;
    }

    // Prepare TTL
    let ttl = undefined;
    if (expiryValue) {
      const val = parseInt(expiryValue);
      if (expiryUnit === 'weeks') ttl = val * 7 * 24 * 60 * 60;
      if (expiryUnit === 'days') ttl = val * 24 * 60 * 60;
      if (expiryUnit === 'hours') ttl = val * 60 * 60;
    }

    // Convert custom data array to object
    const customDataObject: Record<string, string> = {};
    customDataList.forEach(item => {
      customDataObject[item.key] = item.value;
    });

    const payload = {
      title,
      body,
      imageUrl: imageUrl || undefined,
      conversionEvent,
      channelId: androidChannel || undefined,
      sound: sound,
      ttl: ttl,
      customData: customDataObject
    };

    try {
      const res = await fetch('http://localhost:5000/api/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tokens,
          scheduledTime: finalScheduledTime,
          payload
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send');

      await supabase.from('push_notifications').insert([
        { 
          title: campaignName || title, 
          body: body + (scheduleType === 'later' ? ` (Scheduled for ${scheduledDate} ${scheduledTime})` : '') 
        }
      ]);
    } catch (err: any) {
      console.error('Error broadcasting:', err);
      alert('Error broadcasting: ' + err.message);
      setStatus('idle');
      return;
    }

    fetchHistory();
    setStatus('sent');
    clearForm();
    setTimeout(() => setStatus('idle'), 3000);
  };

  const clearForm = () => {
    setTitle('');
    setBody('');
    setImageUrl('');
    setCampaignName('');
    setScheduleType('now');
    setScheduledDate('');
    setScheduledTime('');
    setConversionEvent('none');
    setAndroidChannel('');
    setSound('default');
    setExpiryValue('');
    setExpiryUnit('weeks');
    setCustomDataList([]);
    setActiveStep(1);
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
      
      {/* Left side: Notification Manager Accordions */}
      <div className="flex-1 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notification Manager</h1>
          <p className="text-sm text-gray-500">Design and dispatch push campaigns to all users instantly</p>
        </div>

        <form onSubmit={handleSend} className="space-y-4 pb-12">
          
          {/* Step 1: Notification */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <button 
              type="button" 
              onClick={() => setActiveStep(activeStep === 1 ? 0 : 1)} 
              className="w-full flex items-center justify-between p-5 bg-gray-50/50 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${activeStep === 1 ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900">Notification</h3>
                  <p className="text-xs text-gray-500">Enter text details</p>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${activeStep === 1 ? 'rotate-180' : ''}`} />
            </button>
            
            {activeStep === 1 && (
              <div className="p-5 border-t border-gray-100 space-y-4 bg-white animate-in slide-in-from-top-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Notification title *</label>
                  <input
                    required
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter notification title"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Notification text *</label>
                  <textarea
                    required
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Enter notification text"
                    rows={4}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Notification image (optional)</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="e.g. https://yourdomain.com/image.png"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Campaign name (optional)</label>
                  <input
                    type="text"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="e.g. Daily Ayah - Day 4"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">This name is only shown in the admin panel history logs.</p>
                </div>
                
                <div className="flex justify-end pt-2">
                  <button type="button" onClick={() => setActiveStep(2)} className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-lg shadow-sm transition-colors">
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Target */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-opacity">
            <button type="button" onClick={() => setActiveStep(activeStep === 2 ? 0 : 2)} className="w-full flex items-center justify-between p-5 bg-gray-50/50 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${activeStep === 2 ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900">Target</h3>
                  <p className="text-xs text-gray-500">Topic: all_users</p>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${activeStep === 2 ? 'rotate-180' : ''}`} />
            </button>
            {activeStep === 2 && (
              <div className="p-5 border-t border-gray-100 bg-white animate-in slide-in-from-top-2">
                <div className="flex items-center gap-4 mb-4">
                  <label className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                    <input type="radio" checked readOnly className="text-emerald-500 focus:ring-emerald-500" /> FCM Topic
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-400">
                    <input type="radio" disabled className="text-gray-300" /> User Segment (Coming soon)
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Target Topic</label>
                  <input type="text" value="all_users" disabled className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500" />
                  <p className="text-[11px] text-gray-400 mt-1">Default is all_users. This will broadcast to all registered devices.</p>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setActiveStep(1)} className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900">Back</button>
                  <button type="button" onClick={() => setActiveStep(3)} className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-lg shadow-sm">Next</button>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Scheduling */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-opacity">
            <button type="button" onClick={() => setActiveStep(activeStep === 3 ? 0 : 3)} className="w-full flex items-center justify-between p-5 bg-gray-50/50 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${activeStep === 3 ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900">Scheduling</h3>
                  <p className="text-xs text-gray-500">{scheduleType === 'now' ? 'Send now' : `Scheduled for ${scheduledDate || '...'} ${scheduledTime}`}</p>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${activeStep === 3 ? 'rotate-180' : ''}`} />
            </button>
            {activeStep === 3 && (
              <div className="p-5 border-t border-gray-100 bg-white animate-in slide-in-from-top-2 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Send to eligible users</label>
                  <select 
                    value={scheduleType}
                    onChange={(e) => setScheduleType(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="now">Now</option>
                    <option value="later">Schedule for later</option>
                  </select>
                </div>
                
                {scheduleType === 'later' && (
                  <div className="grid grid-cols-2 gap-4 animate-in fade-in">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
                      <input 
                        type="date" 
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Time</label>
                      <input 
                        type="time" 
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setActiveStep(2)} className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900">Back</button>
                  <button type="button" onClick={() => setActiveStep(4)} className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-lg shadow-sm">Next</button>
                </div>
              </div>
            )}
          </div>

          {/* Step 4: Key events */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-opacity">
            <button type="button" onClick={() => setActiveStep(activeStep === 4 ? 0 : 4)} className="w-full flex items-center justify-between p-5 bg-gray-50/50 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${activeStep === 4 ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'}`}>4</div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900">Key events (optional)</h3>
                  <p className="text-xs text-gray-500">{conversionEvent === 'none' ? 'None selected' : conversionEvent}</p>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${activeStep === 4 ? 'rotate-180' : ''}`} />
            </button>
            {activeStep === 4 && (
              <div className="p-5 border-t border-gray-100 bg-white animate-in slide-in-from-top-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Conversion Event</label>
                  <p className="text-[11px] text-gray-400 mb-2">Select key events to measure the impact of this notification campaign.</p>
                  <select 
                    value={conversionEvent}
                    onChange={(e) => setConversionEvent(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="none">None (Send only)</option>
                    <option value="first_open">first_open</option>
                    <option value="daily_quiz_completed">daily_quiz_completed</option>
                    <option value="salah_logged">salah_logged</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setActiveStep(3)} className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900">Back</button>
                  <button type="button" onClick={() => setActiveStep(5)} className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-lg shadow-sm">Next</button>
                </div>
              </div>
            )}
          </div>
          
          {/* Step 5: Additional options */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-opacity">
            <button type="button" onClick={() => setActiveStep(activeStep === 5 ? 0 : 5)} className="w-full flex items-center justify-between p-5 bg-gray-50/50 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${activeStep === 5 ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'}`}>5</div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900">Additional options (optional)</h3>
                  <p className="text-xs text-gray-500">{customDataList.length} custom params | {androidChannel || 'Default'} channel</p>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${activeStep === 5 ? 'rotate-180' : ''}`} />
            </button>
            {activeStep === 5 && (
              <div className="p-5 border-t border-gray-100 bg-white animate-in slide-in-from-top-2 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Android Notification Channel</label>
                  <input
                    type="text"
                    value={androidChannel}
                    onChange={(e) => setAndroidChannel(e.target.value)}
                    placeholder="e.g. noorulhuda_daily_reminders"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">Reuses your Android App's configured notification channel.</p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Sound</label>
                  <select 
                    value={sound}
                    onChange={(e) => setSound(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="default">Default</option>
                    <option value="none">Disabled</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Expires (TTL)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={expiryValue}
                      onChange={(e) => setExpiryValue(e.target.value)}
                      placeholder="4"
                      min="1"
                      className="w-24 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                    />
                    <select 
                      value={expiryUnit}
                      onChange={(e) => setExpiryUnit(e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                    >
                      <option value="weeks">Weeks</option>
                      <option value="days">Days</option>
                      <option value="hours">Hours</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Custom data (Key-Value)</label>
                  <p className="text-[11px] text-gray-400 mb-2">Add custom parameters to your payload.</p>
                  
                  {customDataList.map((item, idx) => (
                    <div key={idx} className="flex gap-2 mb-2 items-center">
                      <input type="text" value={item.key} disabled className="flex-1 px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-600" />
                      <input type="text" value={item.value} disabled className="flex-1 px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-600" />
                      <button type="button" onClick={() => handleRemoveCustomData(idx)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <label className="text-[10px] text-gray-500 font-medium">KEY</label>
                      <input type="text" value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="e.g. screen" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] text-gray-500 font-medium">VALUE</label>
                      <input type="text" value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder="e.g. quran" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500" />
                    </div>
                    <button type="button" onClick={handleAddCustomData} disabled={!newKey || !newValue} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg text-sm flex items-center gap-1 disabled:opacity-50">
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setActiveStep(4)} className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900">Back</button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-4">
            <button type="button" onClick={clearForm} className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-800">Clear Form</button>
            <button 
              type="submit" 
              disabled={status !== 'idle' || !title || !body || (scheduleType === 'later' && (!scheduledDate || !scheduledTime))}
              className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-md disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {status === 'sending' ? 'Processing...' : status === 'sent' ? 'Success!' : scheduleType === 'later' ? 'Schedule Broadcast' : 'Review & Send'}
            </button>
          </div>
        </form>
      </div>

      {/* Right side: Device Preview */}
      <div className="w-full lg:w-96 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 sticky top-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <PhoneIcon className="w-5 h-5 text-emerald-500" />
              Device Preview
            </h2>
            <div className="flex gap-2 text-xs font-semibold text-gray-400">
              <span className="text-emerald-500 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">Android</span>
              <span className="px-2 py-1 hover:text-gray-600 cursor-pointer">Apple</span>
            </div>
          </div>
          
          <div className="flex justify-center mb-6">
            <div className="flex bg-gray-100 rounded-lg p-1 text-xs font-medium">
              <button className="px-4 py-1.5 bg-white shadow-sm rounded-md text-gray-800">Initial state</button>
              <button className="px-4 py-1.5 text-gray-500 hover:text-gray-700">Expanded view</button>
            </div>
          </div>

          {/* Android Phone Frame Mockup */}
          <div className="mx-auto w-[280px] h-[550px] bg-gray-900 rounded-[2.5rem] p-3 relative shadow-2xl border-8 border-gray-800 flex flex-col">
            {/* Status Bar */}
            <div className="flex justify-between items-center px-4 py-2 text-white text-[10px] font-medium tracking-wide">
              <span>03:41</span>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-white"></div>
                <div className="w-3 h-3 rounded-full bg-white"></div>
              </div>
            </div>
            
            {/* The Notification Bubble */}
            <div className="mt-4 mx-2 bg-[#2a3038] rounded-2xl shadow-xl overflow-hidden border border-white/5 backdrop-blur-md">
              <div className="p-3">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-emerald-500 rounded flex items-center justify-center">
                      <div className="w-2.5 h-2.5 border-[2px] border-[#2a3038] rounded-full"></div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-50">NISA COMPANION</span>
                  </div>
                  <span className="text-[10px] text-emerald-50/50">now</span>
                </div>
                <h4 className="text-[13px] font-bold text-white mb-1.5">{title || 'Notification title'}</h4>
                <p className="text-[12px] text-emerald-50/70 leading-snug whitespace-pre-wrap">
                  {body || 'Type a message to see the preview here...'}
                </p>
              </div>
              {imageUrl && (
                <div className="w-full h-36 bg-black/40 overflow-hidden relative border-t border-white/5">
                  <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
