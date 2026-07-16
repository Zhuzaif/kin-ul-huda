import type { Connect } from 'vite';
import { GoogleGenAI } from '@google/genai';

type HistoryItem = { role: string; text: string };

function offlineAnswer(question: string): string {
  const q = question.toLowerCase();
  if (q.includes('haiz') || q.includes('period') || q.includes('menstruat')) {
    return 'During Hayd (menstruation), salah is not performed and there is no qada for those prayers. Fasting in Ramadan must be made up later. Focus on dhikr, dua, and listening to the Quran. When bleeding ends, perform ghusl and resume worship. For irregular bleeding (istihada), rulings differ — please consult a scholar.';
  }
  if (q.includes('ghusl')) {
    return 'Ghusl is required after Hayd/Nifas end and after marital relations. Intend ghusl, wash the full body including hair roots — many scholars begin with wudu then pour water over the head three times, then the body. After valid ghusl you may pray and fast (when pure).';
  }
  if (q.includes('fast') || q.includes('ramadan')) {
    return 'You cannot fast while in Hayd. Missed Ramadan fasts are made up after you are pure. If bleeding starts mid-fast, that day is broken and must be repeated later. Istihada cases need individual scholarly guidance.';
  }
  if (q.includes('quran') || q.includes('read')) {
    return 'During Hayd, touching the mushaf and reciting Quran rulings vary by madhab. Listening to recitation and reading translation is widely permitted. Check with your teacher for your school of thought.';
  }
  return 'Thank you for your question. I provide general guidance on women\'s fiqh — for a binding ruling on your situation, please speak with a qualified Aalima. You can also read the topic guides on this page. To enable full AI answers, add GEMINI_API_KEY to .env.local and restart the dev server.';
}

export async function handleAalimaRequest(body: {
  question?: string;
  history?: HistoryItem[];
  systemHint?: string;
}): Promise<{ answer: string }> {
  const question = body.question?.trim();
  if (!question) {
    throw new Error('Question is required.');
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return { answer: offlineAnswer(question) };
  }

  const ai = new GoogleGenAI({ apiKey });
  const history = body.history ?? [];
  const systemHint = body.systemHint ?? '';

  const contents = [
    ...history.slice(-6).map((m) => ({
      role: m.role === 'user' ? ('user' as const) : ('model' as const),
      parts: [{ text: m.text }],
    })),
    { role: 'user' as const, parts: [{ text: question }] },
  ];

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents,
    config: {
      systemInstruction: systemHint,
      temperature: 0.6,
      maxOutputTokens: 512,
    },
  });

  const answer = response.text?.trim();
  if (!answer) {
    return { answer: offlineAnswer(question) };
  }

  return { answer };
}

export function createAalimaMiddleware(): Connect.NextHandleFunction {
  return async (req, res, next) => {
    if (!req.url?.startsWith('/api/aalima')) {
      next();
      return;
    }

    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.end();
      return;
    }

    if (req.method !== 'POST') {
      res.statusCode = 405;
      res.end(JSON.stringify({ error: 'Method not allowed' }));
      return;
    }

    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', async () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const result = await handleAalimaRequest(parsed);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result));
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Server error';
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: message }));
      }
    });
  };
}
