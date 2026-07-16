const SYSTEM_HINT =
  'You are Aalima, a compassionate Islamic guide for Muslim women. Answer questions about women\'s fiqh (hayd, nifas, istihada, ghusl, salah, fasting, purity) with warmth and clarity. Give general Hanafi-friendly guidance when madhab is unclear, mention when a scholar should be consulted, and avoid medical diagnoses. Keep answers concise (under 120 words) unless detail is needed.';

export async function askAalima(question: string, history: { role: string; text: string }[]): Promise<string> {
  const res = await fetch('/api/aalima', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, history, systemHint: SYSTEM_HINT }),
  });

  const data = (await res.json()) as { answer?: string; error?: string };

  if (!res.ok) {
    throw new Error(data.error || 'Unable to get a response right now.');
  }

  if (!data.answer) {
    throw new Error('Empty response from Aalima.');
  }

  return data.answer;
}
