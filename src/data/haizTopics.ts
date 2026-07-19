export type HaizHadith = {
  arabic: string;
  translation: string;
  narrator: string;
  reference: string;
  additionalRef?: string;
};

export type HaizTopic = {
  id: string;
  title: string;
  emoji: string;
  tagLabel: string;
  tagColor: string;
  tagBg: string;
  summary: string;
  hadith?: HaizHadith;
  explanation: string;
  keyPoints?: string[];
};

export const haizTopics: HaizTopic[] = [
  {
    id: 'haiz-natural-condition',
    title: 'Haiz Is a Natural Condition',
    emoji: '🌸',
    tagLabel: 'Foundation',
    tagColor: 'text-[#2B604A]',
    tagBg: 'bg-soft-mint',
    summary:
      'Menstruation is a natural condition ordained by Allah for women — it is not a punishment, a sin, or something that makes a woman personally impure.',
    hadith: {
      arabic:
        'عَنْ عَائِشَةَ رَضِيَ اللَّهُ عَنْهَا قَالَتْ:\n\nخَرَجْنَا لَا نَرَى إِلَّا الْحَجَّ، فَلَمَّا كُنَّا بِسَرِفَ حِضْتُ، فَدَخَلَ عَلَيَّ رَسُولُ اللَّهِ ﷺ وَأَنَا أَبْكِي، قَالَ: «مَا لَكِ؟ أَنَفِسْتِ؟» قُلْتُ: نَعَمْ. قَالَ: «إِنَّ هَذَا أَمْرٌ كَتَبَهُ اللَّهُ عَلَى بَنَاتِ آدَمَ، فَاقْضِي مَا يَقْضِي الْحَاجُّ، غَيْرَ أَنْ لَا تَطُوفِي بِالْبَيْتِ».',
      translation:
        'Narrated \'Aisha (رضي الله عنها):\n\n"We set out with the intention of performing Hajj. When we reached Sarif, I began menstruating. The Messenger of Allah ﷺ came to me while I was crying and said, \'What is the matter with you? Have you started menstruating?\' I said, \'Yes.\' He ﷺ said:\n\n\'Indeed, this is something which Allah has ordained for the daughters of Adam. So do everything that a pilgrim does, except perform Tawaf around the House.\'"',
      narrator: "'Aishah bint Abi Bakr (رضي الله عنها)",
      reference: 'Sahih al-Bukhari, Hadith 294\nBook 6: Menstrual Periods — Chapter 1',
      additionalRef: 'A similar narration is also recorded in Sahih Muslim 1211i.',
    },
    explanation:
      'This Hadith teaches that menstruation is a natural condition ordained by Allah for women. It is not a punishment, a sin, or something that makes a woman personally impure. During Hajj, a menstruating woman may perform the other acts of Hajj, while Tawaf around the Ka\'bah is delayed until she becomes pure and performs Ghusl, according to this narration.',
    keyPoints: [
      'Menstruation is decreed by Allah — not a sign of impurity or punishment',
      'The Prophet ﷺ consoled \'Aisha with compassion and kindness',
      'A menstruating woman can still perform all acts of Hajj except Tawaf',
      'Islam treats this as a natural part of a woman\'s life',
    ],
  },
  {
    id: 'haiz-duration-limits',
    title: 'Duration & Limits of Haiz',
    emoji: '⏳',
    tagLabel: 'Fiqh Ruling',
    tagColor: 'text-[#D98A5B]',
    tagBg: 'bg-light-peach',
    summary:
      'Understanding the minimum and maximum limits of menstruation according to Hanafi fiqh, and what happens when bleeding exceeds or falls short of these limits.',
    explanation:
      'According to the Hanafi school of thought, the minimum duration of Haiz is 3 days (72 hours) and the maximum is 10 days (240 hours). If bleeding is less than 3 days, it is considered Istihada (irregular bleeding), not Haiz. If it exceeds 10 days, the excess is also Istihada. This distinction is crucial because it determines rulings regarding Salah, fasting, and intimacy.',
    keyPoints: [
      'Minimum Haiz: 3 days and 3 nights (72 hours) — Hanafi view',
      'Maximum Haiz: 10 days and 10 nights (240 hours) — Hanafi view',
      'Bleeding less than 3 days = Istihada (not Haiz)',
      'Bleeding more than 10 days = excess is Istihada',
      'Other schools have different limits — consult your madhab',
    ],
  },
  {
    id: 'haiz-prohibited-acts',
    title: 'Acts Prohibited During Haiz',
    emoji: '🚫',
    tagLabel: 'Important',
    tagColor: 'text-soft-pink-dark',
    tagBg: 'bg-soft-pink',
    summary:
      'Certain acts of worship are paused during menstruation. Understanding these rulings brings clarity and peace of mind.',
    explanation:
      'During Haiz, a woman is excused from Salah (prayer) and Sawm (fasting). She does not need to make up missed prayers, but she must make up missed fasts after Ramadan. She should not touch the Quran without a barrier, and she should not enter the masjid. Intimate relations with the husband are also not allowed during this period. These are acts of mercy, not punishment — Allah has lightened her obligations during this time.',
    keyPoints: [
      'Salah (prayer) is paused — no need to make up missed prayers',
      'Fasting is paused — but missed fasts must be made up later',
      'Touching the Quran directly is not allowed (barrier/gloves permitted)',
      'Entering the masjid is not allowed',
      'Intimacy with husband is prohibited during Haiz',
      'Tawaf around the Ka\'bah is not allowed',
    ],
  },
  {
    id: 'haiz-permitted-acts',
    title: 'Acts Permitted During Haiz',
    emoji: '✅',
    tagLabel: 'Guidance',
    tagColor: 'text-[#2B604A]',
    tagBg: 'bg-soft-mint',
    summary:
      'A menstruating woman is still encouraged to do many acts of worship. Her spiritual journey continues.',
    explanation:
      'Even though Salah and fasting are paused, a menstruating woman can still do abundant dhikr (remembrance of Allah), make dua (supplication), send salawat upon the Prophet ﷺ, listen to Quran recitation, learn Islamic knowledge, give charity, and engage in other good deeds. She can also attend educational gatherings (outside the masjid). Her spiritual status is not diminished — she is still beloved to Allah.',
    keyPoints: [
      'Dhikr (remembrance of Allah) — SubhanAllah, Alhamdulillah, Allahu Akbar',
      'Dua (supplication) — asking Allah for anything',
      'Salawat upon the Prophet ﷺ',
      'Listening to Quran recitation',
      'Learning Islamic knowledge & reading tafseer',
      'Giving charity (Sadaqah)',
      'Making Istighfar (seeking forgiveness)',
    ],
  },
  {
    id: 'haiz-ghusl-after',
    title: 'Ghusl After Haiz Ends',
    emoji: '🚿',
    tagLabel: 'Purification',
    tagColor: 'text-muted-gold',
    tagBg: 'bg-muted-gold-light',
    summary:
      'When menstruation ends, a woman must perform Ghusl (ritual bath) before resuming prayers and other paused acts of worship.',
    explanation:
      'When a woman\'s menstruation ends (bleeding stops and she sees the sign of purity), she is required to perform Ghusl before resuming Salah, fasting, intimacy, and other paused acts. Ghusl involves washing the entire body with the intention of purification. She should ensure water reaches every part of the body, including the roots of the hair. After Ghusl, she resumes all her regular acts of worship.',
    keyPoints: [
      'Ghusl becomes obligatory once bleeding stops',
      'Signs of purity: white discharge (Qassah Baydaa) or complete dryness',
      'Make intention for Ghusl to purify from Haiz',
      'Ensure water reaches entire body including hair roots',
      'After Ghusl: resume Salah, fasting, and all paused acts',
      'If unclear whether period ended, wait and check again',
    ],
  },
  {
    id: 'haiz-salah-fasting',
    title: 'Making Up Missed Fasts',
    emoji: '🌙',
    tagLabel: 'Worship',
    tagColor: 'text-[#D98A5B]',
    tagBg: 'bg-light-peach',
    summary:
      'Understanding the difference between making up prayers vs fasts after menstruation ends.',
    hadith: {
      arabic:
        'عَنْ مُعَاذَةَ قَالَتْ: سَأَلْتُ عَائِشَةَ فَقُلْتُ: مَا بَالُ الْحَائِضِ تَقْضِي الصَّوْمَ وَلَا تَقْضِي الصَّلَاةَ؟ فَقَالَتْ: أَحَرُورِيَّةٌ أَنْتِ؟ قُلْتُ: لَسْتُ بِحَرُورِيَّةٍ، وَلَكِنِّي أَسْأَلُ. قَالَتْ: كَانَ يُصِيبُنَا ذَلِكَ فَنُؤْمَرُ بِقَضَاءِ الصَّوْمِ وَلَا نُؤْمَرُ بِقَضَاءِ الصَّلَاةِ.',
      translation:
        "Narrated Mu'adhah:\n\nI asked 'Aisha: \"Why is it that a menstruating woman makes up the fasts but not the prayers?\" She said: \"Are you a Haruri (Kharijite)?\" I said: \"No, I am just asking.\" She said: \"That used to happen to us, and we were commanded to make up the fasts but were not commanded to make up the prayers.\"",
      narrator: "Mu'adhah, narrating from 'Aisha (رضي الله عنها)",
      reference: 'Sahih Muslim, Hadith 335\nBook 3: Menstruation',
    },
    explanation:
      "This authentic hadith clarifies one of the most common questions: missed prayers during Haiz do NOT need to be made up (Qadha), but missed fasts DO need to be made up after Ramadan. This is a mercy from Allah — if a woman had to make up every missed prayer, it would be an enormous burden. 'Aisha (RA) was firm in this ruling because it was directly from the Prophet's ﷺ instruction.",
    keyPoints: [
      'Missed prayers during Haiz: NO need to make up (not required)',
      'Missed fasts during Ramadan: MUST be made up later (Qadha)',
      'This is based on the direct instruction of the Prophet ﷺ',
      'Making up fasts can be done any time before the next Ramadan',
      "It is recommended to complete Qadha fasts as soon as possible",
    ],
  },
  {
    id: 'haiz-husband-interaction',
    title: 'Interaction with Husband',
    emoji: '💑',
    tagLabel: 'Marriage',
    tagColor: 'text-soft-pink-dark',
    tagBg: 'bg-soft-pink',
    summary:
      'What is and isn\'t allowed between husband and wife during the period of menstruation.',
    hadith: {
      arabic:
        'عَنْ أَنَسِ بْنِ مَالِكٍ أَنَّ الْيَهُودَ كَانُوا إِذَا حَاضَتِ الْمَرْأَةُ فِيهِمْ لَمْ يُؤَاكِلُوهَا... فَقَالَ رَسُولُ اللَّهِ ﷺ: «اصْنَعُوا كُلَّ شَيْءٍ إِلَّا النِّكَاحَ».',
      translation:
        'Narrated Anas ibn Malik:\n\n"The Jews used to isolate their menstruating women, not eating with them or sitting with them in the house... The Messenger of Allah ﷺ said: \'Do everything except sexual intercourse.\'"',
      narrator: 'Anas ibn Malik (رضي الله عنه)',
      reference: 'Sahih Muslim, Hadith 302',
    },
    explanation:
      'Islam takes a balanced and compassionate approach. Unlike pre-Islamic practices, a menstruating woman is NOT to be isolated, shunned, or treated as untouchable. The husband can eat with her, sit with her, sleep in the same bed, and show affection — the only restriction is full sexual intercourse. This ruling protects the dignity of the woman and maintains the bond between spouses.',
    keyPoints: [
      'A menstruating woman is NOT to be isolated or shunned',
      'Husband and wife can eat together, sit together, and share the bed',
      'Physical affection (above the navel and below the knee) is permitted',
      'Only full sexual intercourse is prohibited',
      'Islam abolished the pre-Islamic practice of completely isolating women',
    ],
  },
];
