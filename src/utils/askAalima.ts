import { supabase } from '../lib/supabase';

const SYSTEM_HINT =
  'You are Aalima, a compassionate Islamic guide for Muslim women. Answer questions about women\'s fiqh (hayd, nifas, istihada, ghusl, salah, fasting, purity) with warmth and clarity. Give general Hanafi-friendly guidance when madhab is unclear, mention when a scholar should be consulted, and avoid medical diagnoses. Keep answers concise (under 120 words) unless detail is needed.';

export async function askAalima(question: string, userId?: string): Promise<string> {
  if (!userId) {
    throw new Error('Unable to identify your device. Please try restarting the app.');
  }

  try {
    const { error } = await supabase.from('aalima_queries').insert([
      { 
        user_id: userId, 
        question: question, 
        ai_answer: '', 
        status: 'pending' 
      }
    ]);

    if (error) throw error;
  } catch (e) {
    console.error('Failed to log query to Supabase', e);
    throw new Error('Unable to send your question right now. Please try again later.');
  }

  return 'Jazakallah. Your question has been forwarded to our Aalima. You will receive a reply here soon.';
}
