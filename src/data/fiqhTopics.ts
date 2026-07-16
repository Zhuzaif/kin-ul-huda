import type { LucideIcon } from 'lucide-react';
import { Droplets, Sparkles, Moon, Heart, BookOpen, Scale } from 'lucide-react';

export type FiqhTopic = {
  id: string;
  category: string;
  title: string;
  summary: string;
  readMinutes: number;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  content: string[];
};

export const FIQH_CATEGORIES = ['Purity & Blood', 'Worship', 'Fasting & Daily Life'] as const;

export const fiqhTopics: FiqhTopic[] = [
  {
    id: 'types-of-blood',
    category: 'Purity & Blood',
    title: 'Types of Blood in Fiqh',
    summary: 'Understanding Hayd (menstruation), Nifas (post-natal), and Istihada (irregular bleeding).',
    readMinutes: 4,
    icon: Droplets,
    iconBg: 'bg-soft-pink',
    iconColor: 'text-soft-pink-dark',
    content: [
      'In Islamic jurisprudence, not all bleeding is the same. The ruling for prayer, fasting, and intimacy depends on which type of blood you are experiencing.',
      'Hayd (menstruation) is natural bleeding at regular intervals. During Hayd, salah is not obligatory, fasting is not valid, and certain acts of worship are paused. The minimum period and maximum duration vary by madhab.',
      'Nifas is bleeding after childbirth. Similar rulings to Hayd apply until the bleeding stops or the maximum post-natal period ends according to your school of thought.',
      'Istihada is irregular or prolonged bleeding outside normal Hayd. A woman in Istihada is still considered pure for worship in many cases but must perform wudu for each prayer. Always consult a qualified scholar for your specific situation.',
    ],
  },
  {
    id: 'ghusl',
    category: 'Purity & Blood',
    title: 'Rules of Ghusl',
    summary: 'When ghusl is required and how to perform it correctly.',
    readMinutes: 5,
    icon: Sparkles,
    iconBg: 'bg-soft-mint',
    iconColor: 'text-[#2B604A]',
    content: [
      'Ghusl (ritual bath) is required after Hayd and Nifas end, after marital relations, and after certain other states of major impurity.',
      'The essential steps include intention, washing the entire body with water reaching the skin, including the hair roots. Many scholars recommend starting with wudu, then pouring water over the head three times, then the rest of the body.',
      'After a valid ghusl, you resume salah, reading the Quran (according to your madhab), and fasting if applicable. Combine ghusl with sincere dua when returning to worship.',
    ],
  },
  {
    id: 'salah-haiz',
    category: 'Worship',
    title: 'Salah During Hayd',
    summary: 'What is paused, what remains encouraged, and gentle alternatives.',
    readMinutes: 3,
    icon: Moon,
    iconBg: 'bg-muted-gold-light',
    iconColor: 'text-muted-gold',
    content: [
      'Salah is not obligatory during Hayd and should not be performed. There is no qada (make-up) for missed prayers from menstruation.',
      'This is a mercy, not a deprivation. Use the time for dhikr, listening to Quran, dua, and learning. Many women find deeper connection through reflection and remembrance.',
      'Touching or carrying the mushaf may differ by madhab; listening to recitation and reading translation is widely permitted. When Hayd ends, perform ghusl and resume your regular prayer routine.',
    ],
  },
  {
    id: 'fasting-rules',
    category: 'Fasting',
    title: 'Fasting & Hayd',
    summary: 'Ramadan, make-up fasts, and what to do if bleeding begins while fasting.',
    readMinutes: 4,
    icon: BookOpen,
    iconBg: 'bg-light-peach',
    iconColor: 'text-[#D98A5B]',
    content: [
      'Fasting is not valid during Hayd. If your period begins during a fast in Ramadan, that day is invalidated and must be made up after Ramadan.',
      'You are not required to fast on days you were menstruating, but you must complete qada for each missed Ramadan fast once you are pure.',
      'Between cycles, fasting is encouraged. If bleeding is Istihada rather than Hayd, rulings differ — seek personalised guidance from a scholar.',
    ],
  },
  {
    id: 'wudu-ghusl-daily',
    category: 'Worship',
    title: 'Wudu, Makeup & Daily Purity',
    summary: 'Practical purity for everyday life and common questions.',
    readMinutes: 3,
    icon: Heart,
    iconBg: 'bg-soft-pink',
    iconColor: 'text-soft-pink-dark',
    content: [
      'Wudu must be valid for salah. Anything preventing water from reaching the skin (certain waterproof coatings) may affect validity depending on madhab.',
      'Nail polish and some makeup products are discussed by scholars; water-permeable options or removal before wudu is often recommended.',
      'Discharge other than Hayd/Nifas/Istihada does not usually break wudu according to many opinions, but when unsure, refresh wudu for peace of mind.',
    ],
  },
  {
    id: 'seeking-rulings',
    category: 'Fasting & Daily Life',
    title: 'When to Ask a Scholar',
    summary: 'Complex cases deserve personal fatwa — how to prepare your question.',
    readMinutes: 2,
    icon: Scale,
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-600',
    content: [
      'This app offers general education, not personal fatwa. Irregular cycles, medical conditions, and conflicting symptoms need a qualified Aalima or scholar.',
      'When asking, note: cycle pattern, bleeding colour/duration, current medications, and your madhab if known.',
      'Use Ask Aalima for introductory guidance, then follow up with a trusted teacher for binding rulings.',
    ],
  },
];
