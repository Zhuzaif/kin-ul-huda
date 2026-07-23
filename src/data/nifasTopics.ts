export type NifasHadith = {
  arabic: string;
  translation: string;
  narrator: string;
  reference: string;
  additionalRef?: string;
};

export type NifasTopic = {
  id: string;
  title: string;
  emoji: string;
  tagLabel: string;
  tagColor: string;
  tagBg: string;
  summary: string;
  hadith?: NifasHadith;
  explanation: string;
  keyPoints?: string[];
};

export const nifasTopics: NifasTopic[] = [
  {
    id: 'nifas-understanding',
    title: 'Understanding Nifas',
    emoji: '🌸',
    tagLabel: 'Foundation',
    tagColor: 'text-[#2B604A]',
    tagBg: 'bg-soft-mint',
    summary:
      'Nifas is the bleeding that occurs after childbirth. It is a natural condition related to the birth of a child.',
    hadith: {
      arabic:
        'عَنْ أُمِّ سَلَمَةَ رضي الله عنها قَالَتْ:\n\nكَانَتِ النُّفَسَاءُ عَلَى عَهْدِ رَسُولِ اللَّهِ ﷺ تَقْعُدُ بَعْدَ نِفَاسِهَا أَرْبَعِينَ يَوْمًا، أَوْ أَرْبَعِينَ لَيْلَةً.',
      translation:
        'Umm Salamah رضي الله عنها said:\n\n"During the time of the Messenger of Allah ﷺ, women experiencing post-natal bleeding would refrain from prayer for forty days or forty nights."',
      narrator: 'Umm Salamah (رضي الله عنها)',
      reference: 'Sunan Abi Dawud 311',
      additionalRef: 'Grading: Hasan Sahih according to al-Albani.',
    },
    explanation:
      'Nifas is the bleeding that occurs after childbirth. It is a natural condition related to the birth of a child.\n\nDuring Nifas, a woman is temporarily exempt from certain acts of worship, such as Salah and fasting, according to the relevant Islamic rulings.\n\nDuring this period:\n\n1. She does not perform Salah.\n2. She does not fast.\n3. She does not make up the missed Salah.\n4. Missed obligatory fasts, such as Ramadan fasts, are made up later.\n5. She performs Ghusl when Nifas ends.\n6. After Ghusl, she resumes Salah and fasting.\n\nThe specific details of some rulings may vary according to the fiqh school being followed.\n\nNifas does not necessarily last 40 days. The Hadith mentions that women at the time of the Prophet ﷺ would commonly refrain from prayer for 40 days or 40 nights during Nifas. However, this should not automatically be understood to mean that every woman must bleed for exactly 40 days.\n\nIf bleeding stops after 10 days → the woman performs Ghusl and resumes worship, according to the applicable fiqh ruling. If bleeding continues → the ruling may require further consideration based on the relevant fiqh principles. If bleeding becomes prolonged or unusual → it may be necessary to distinguish Nifas from Istihada.\n\nThe duration and maximum limit of Nifas are discussed differently by the schools of Islamic jurisprudence.',
    keyPoints: [
      'Nifas is the bleeding that occurs after childbirth — a natural condition',
      'During Nifas, a woman is temporarily exempt from Salah and fasting',
      'She does not make up the missed Salah',
      'Missed obligatory fasts (such as Ramadan) are made up later',
      'She performs Ghusl when Nifas ends and resumes worship',
      'Nifas does not necessarily last 40 days — if bleeding stops earlier, perform Ghusl and resume worship',
      'The duration and maximum limit of Nifas are discussed differently by the schools of Islamic jurisprudence',
    ],
  },
  {
    id: 'nifas-duration-limits',
    title: 'Duration & Limits of Nifas',
    emoji: '⏳',
    tagLabel: 'Fiqh Ruling',
    tagColor: 'text-[#D98A5B]',
    tagBg: 'bg-light-peach',
    summary:
      'The duration of Nifas has different opinions among the Sunni schools. Understanding the maximum duration, what happens when bleeding continues, and the difference between Nifas and Istihada.',
    hadith: {
      arabic:
        'عَنْ أُمِّ سَلَمَةَ رضي الله عنها قَالَتْ:\n\nكَانَتِ النُّفَسَاءُ عَلَى عَهْدِ رَسُولِ اللَّهِ ﷺ تَقْعُدُ بَعْدَ نِفَاسِهَا أَرْبَعِينَ يَوْمًا أَوْ أَرْبَعِينَ لَيْلَةً.',
      translation:
        'Umm Salamah رضي الله عنها said:\n\n"During the time of the Messenger of Allah ﷺ, women experiencing post-natal bleeding would refrain from prayer for forty days or forty nights."',
      narrator: 'Umm Salamah (رضي الله عنها)',
      reference: 'Sunan Abi Dawud 311 — graded Hasan Sahih.',
    },
    explanation:
      'Nifas does not always last 40 days. 40 days is not a requirement for every woman.\n\nIf bleeding stops earlier, the woman should follow the relevant fiqh ruling regarding purity, perform Ghusl, and resume worship. In the Hanafi school, there is no minimum duration, while the maximum is 40 days.\n\nExample:\nBleeding stops after 10 days → Nifas may end before 40 days.\nBleeding continues for 40 days → 40 days is the maximum according to the Hanafi school.\nBleeding continues beyond 40 days → the ruling may become Istihada, with details depending on the woman\'s previous pattern.\n\nThe duration of Nifas has different opinions among the Sunni schools:\n\n1. Hanafi: Maximum 40 days\n2. Shafi\'i: Maximum 60 days\n3. Other schools have their own detailed positions.\n\nIf bleeding continues beyond the maximum period according to the fiqh school being followed, the extra bleeding may be treated as Istihada, not Nifas.\n\nThe exact ruling can depend on: previous Nifas history, previous menstrual habit, duration of bleeding, and the fiqh school being followed.\n\nFor personal cases of prolonged bleeding, a qualified scholar should be consulted.',
    keyPoints: [
      'Nifas does not always last 40 days — 40 days is not a requirement for every woman',
      'If bleeding stops earlier, perform Ghusl and resume worship',
      'Hanafi school — Maximum Nifas: 40 days',
      'Shafi\'i school — Maximum Nifas: 60 days',
      'Other schools have their own detailed positions',
      'If bleeding continues beyond the maximum, it may be treated as Istihada',
      'The exact ruling depends on previous Nifas history, menstrual habit, and the fiqh school followed',
      'For personal cases of prolonged bleeding, consult a qualified scholar',
    ],
  },
  {
    id: 'nifas-acts-worship',
    title: 'Nifas & Acts of Worship',
    emoji: '🕌',
    tagLabel: 'Important',
    tagColor: 'text-soft-pink-dark',
    tagBg: 'bg-soft-pink',
    summary:
      'During Nifas, a woman is temporarily exempt from certain acts of worship. Understanding what is suspended and what remains permitted.',
    hadith: {
      arabic:
        'عَنْ أُمِّ سَلَمَةَ رضي الله عنها قَالَتْ:\n\nكَانَتِ النُّفَسَاءُ عَلَى عَهْدِ رَسُولِ اللَّهِ ﷺ تَقْعُدُ بَعْدَ نِفَاسِهَا أَرْبَعِينَ يَوْمًا أَوْ أَرْبَعِينَ لَيْلَةً.',
      translation:
        'Umm Salamah رضي الله عنها said:\n\n"During the time of the Messenger of Allah ﷺ, women experiencing post-natal bleeding would refrain from prayer for forty days or forty nights."',
      narrator: 'Umm Salamah (رضي الله عنها)',
      reference: 'Sunan Abi Dawud 311',
    },
    explanation:
      'During Nifas, a woman is temporarily exempt from certain acts of worship.\n\n1. Salah (Prayer): During Nifas, a woman does not perform Salah. Missed prayers do not need to be made up. After Nifas ends, she performs Ghusl and resumes Salah.\n\n2. Fasting: During Nifas, a woman does not fast. Missed Ramadan fasts must be made up later. Evidence: The same principle is established in the Hadith of \'Aishah رضي الله عنها: "We were commanded to make up the missed fasts, but we were not commanded to make up the missed prayers." (Sahih Muslim 335c; Sahih al-Bukhari 321)\n\n3. Quran, Dua & Dhikr: A woman in Nifas may make Dua, perform Dhikr, say Istighfar, send Salawat, and say Tasbeeh, Tahmeed and Takbeer. The ruling regarding reciting the Quran during menstruation and Nifas has scholarly differences. The relevant scholarly opinions should be presented separately rather than giving one universal ruling.\n\n4. Hajj & Umrah: A woman in Nifas may perform many Hajj rituals. Exception: Tawaf is not performed until purity is achieved. (Sahih al-Bukhari 305)',
    keyPoints: [
      'Salah is not performed during Nifas — missed prayers do NOT need to be made up',
      'Fasting is not performed during Nifas — missed Ramadan fasts MUST be made up later',
      'Dua, Dhikr, Istighfar, Salawat, Tasbeeh, Tahmeed and Takbeer are all permitted',
      'The ruling regarding reciting the Quran has scholarly differences',
      'Hajj rituals may be performed except Tawaf — Tawaf is not performed until purity is achieved',
      'After Nifas ends, she performs Ghusl and resumes Salah and fasting',
    ],
  },
  {
    id: 'nifas-ghusl',
    title: 'Ghusl After Nifas Ends',
    emoji: '🚿',
    tagLabel: 'Purification',
    tagColor: 'text-muted-gold',
    tagBg: 'bg-muted-gold-light',
    summary:
      'When Nifas bleeding stops and purity is established, the woman performs Ghusl before resuming Salah, fasting, and other acts of worship.',
    hadith: {
      arabic:
        'عَنْ عَائِشَةَ رضي الله عنها:\n\nأَنَّ النَّبِيَّ ﷺ قَالَ لِفَاطِمَةَ بِنْتِ أَبِي حُبَيْشٍ: «إِذَا أَقْبَلَتِ الْحَيْضَةُ فَدَعِي الصَّلَاةَ، وَإِذَا أَدْبَرَتْ فَاغْسِلِي عَنْكِ الدَّمَ ثُمَّ صَلِّي»',
      translation:
        'The Prophet ﷺ instructed women regarding purification after menstrual bleeding:\n\n"When menstruation ends, wash the blood from yourself and pray."',
      narrator: '\'Aishah (رضي الله عنها)',
      reference: 'Sahih al-Bukhari 331',
      additionalRef: 'The same principle applies when Nifas ends: the woman performs Ghusl and resumes the acts of worship that were suspended during Nifas.',
    },
    explanation:
      'When Nifas ends, the woman performs Ghusl and resumes the acts of worship that were suspended during Nifas.\n\nSteps of Ghusl After Nifas:\n\n1. Confirm Nifas Has Ended: Bleeding has stopped. Purity has been established according to the applicable fiqh ruling.\n\n2. Make the Intention: Make the intention in the heart to perform Ghusl for purification from Nifas.\n\n3. Wash Away Any Blood or Impurity: Clean any remaining blood from the body.\n\n4. Perform Wudu: Perform Wudu as for Salah.\n\n5. Wash the Head and Hair: Make sure water reaches the roots of the hair and scalp. Detailed Ghusl Method: The Prophet ﷺ described washing the head thoroughly and then washing the entire body. (Sahih Muslim 332c)\n\n6. Wash the Entire Body: Ensure water reaches all parts of the body.\n\nBraided Hair: A woman does not necessarily have to undo her braids if water can reach the roots of the hair. (Sahih Muslim 330a)\n\nAfter completing Ghusl: Salah becomes obligatory again, Ramadan fasting may be resumed if the timing allows, other acts of worship may be resumed, and marital intercourse becomes permissible.',
    keyPoints: [
      'Ghusl is performed when Nifas bleeding stops and purity is established',
      'Step 1: Confirm Nifas has ended — bleeding stopped, purity established',
      'Step 2: Make the intention in the heart for purification from Nifas',
      'Step 3: Wash away any remaining blood or impurity',
      'Step 4: Perform Wudu as for Salah',
      'Step 5: Wash the head and hair — water must reach roots (Sahih Muslim 332c)',
      'Step 6: Wash the entire body — ensure water reaches all parts',
      'Braided hair does not need to be undone if water reaches the roots (Sahih Muslim 330a)',
      'After Ghusl: resume Salah, fasting, and all paused acts of worship',
      'Marital intercourse becomes permissible after Ghusl',
    ],
  },
  {
    id: 'nifas-husband-wife',
    title: 'Husband–Wife Relations During Nifas',
    emoji: '💑',
    tagLabel: 'Marriage',
    tagColor: 'text-soft-pink-dark',
    tagBg: 'bg-soft-pink',
    summary:
      'During Nifas, sexual intercourse is prohibited. However, normal marital interaction, affection, and companionship continue as usual.',
    hadith: {
      arabic:
        'قَالَ رَسُولُ اللَّهِ ﷺ:\n\n«اصْنَعُوا كُلَّ شَيْءٍ إِلَّا النِّكَاحَ»',
      translation:
        'The Messenger of Allah ﷺ said:\n\n"Do everything except sexual intercourse."',
      narrator: 'Anas ibn Malik (رضي الله عنه)',
      reference: 'Sahih Muslim 302',
    },
    explanation:
      'During Nifas, sexual intercourse is prohibited. This ruling is similar to intercourse during menstruation. After Nifas ends and the woman performs Ghusl, intercourse becomes permissible again.\n\nQur\'an 2:222 — The prohibition of intercourse during menstruation is established in the Qur\'an, while the same ruling applies to Nifas according to Islamic jurisprudence.\n\nDuring Nifas, a husband and wife may: talk and spend time together, eat and drink together, sleep in the same bed, show normal affection, and live together normally. (Sahih Muslim 302)\n\nThe woman is not impure. Nifas does not make the woman herself impure. The Prophet ﷺ said:\n\n«إِنَّ الْمُؤْمِنَ لَا يَنْجُسُ»\n\n"Indeed, a believer is never impure." (Sahih al-Bukhari 283; Sahih Muslim 371)',
    keyPoints: [
      'Sexual intercourse is prohibited during Nifas (same ruling as Haiz)',
      'After Nifas ends and Ghusl is performed, intercourse becomes permissible again',
      'Qur\'an 2:222 — The prohibition is established in the Qur\'an',
      'Normal interaction — talking, eating, sleeping together — is all permitted',
      'The woman is NOT impure — "Indeed, a believer is never impure" (Sahih al-Bukhari 283; Sahih Muslim 371)',
      'The wife is not to be isolated or shunned during Nifas',
    ],
  },
  {
    id: 'nifas-special-cases',
    title: 'Special Cases of Nifas',
    emoji: '⚠️',
    tagLabel: 'Advanced',
    tagColor: 'text-[#D98A5B]',
    tagBg: 'bg-light-peach',
    summary:
      'Special situations related to Nifas including bleeding that stops early, bleeding beyond the maximum, bleeding that stops and returns, miscarriage, stillbirth, and the difference between Nifas and Istihada.',
    hadith: {
      arabic:
        'قَالَ رَسُولُ اللَّهِ ﷺ:\n\n«تَحَيَّضِي سِتَّةَ أَيَّامٍ أَوْ سَبْعَةَ أَيَّامٍ... ثُمَّ اغْتَسِلِي وَصَلِّي»',
      translation:
        'The Prophet ﷺ gave guidance to women who experienced prolonged bleeding:\n\n"Consider yourself menstruating for six or seven days… then perform Ghusl and pray."',
      narrator: 'Hamnah bint Jahsh (رضي الله عنها)',
      reference: 'Sunan Abi Dawud 287',
      additionalRef: 'This shows that when bleeding continues unusually, it is important to distinguish between normal blood and abnormal/prolonged bleeding.',
    },
    explanation:
      '1. Bleeding Stops Before 40 Days: If bleeding stops before the maximum period of Nifas, purity is established. The woman performs Ghusl. She resumes Salah and other acts of worship. Important: The exact ruling can vary according to the fiqh school being followed.\n\n2. Bleeding Continues Beyond the Maximum: If bleeding continues beyond the applicable maximum duration of Nifas, the additional bleeding may be considered Istihada. The woman may need to resume Salah and other worship according to the relevant fiqh rules. The exact ruling depends on her previous menstrual and Nifas patterns.\n\n3. Bleeding Stops and Then Returns: If bleeding stops temporarily and then returns, the ruling depends on the duration of the pause. The total bleeding pattern must be considered. The relevant fiqh school\'s rules should be followed. This can be a detailed issue, so personal cases should be referred to a qualified scholar.\n\n4. Miscarriage: The ruling may depend on the stage of pregnancy and whether the fetus had recognizable human features. If there is a developed fetus and bleeding occurs after its delivery, it may be treated as Nifas. In an early miscarriage, the bleeding may have a different ruling, such as Haiz or Istihada, depending on the circumstances.\n\n5. Stillbirth: If a baby is stillborn, the ruling regarding post-delivery bleeding may still be treated as Nifas according to relevant fiqh principles.\n\n6. Difference Between Nifas and Istihada:\n• Nifas is related to childbirth — Istihada is abnormal bleeding\n• Nifas has specific post-natal rulings — Istihada does not have the same rulings\n• Salah and fasting are suspended during Nifas — Salah and fasting generally continue during Istihada\n• Ghusl is performed when Nifas ends — Different purification rules apply for Istihada\n\nNot every bleeding after childbirth has exactly the same ruling. The duration, whether the bleeding stopped and returned, miscarriage circumstances, and the relevant fiqh principles may all affect the ruling.',
    keyPoints: [
      'Bleeding stops before 40 days — perform Ghusl and resume worship',
      'Bleeding beyond the maximum — extra bleeding may be Istihada',
      'Bleeding stops and returns — ruling depends on duration of pause and total pattern',
      'Miscarriage with developed fetus — may be treated as Nifas',
      'Early miscarriage — bleeding may be Haiz or Istihada depending on circumstances',
      'Stillbirth — post-delivery bleeding may still be treated as Nifas',
      'Nifas vs Istihada — different rulings for each regarding Salah, fasting, and purification',
      'Personal cases should be referred to a qualified scholar',
    ],
  },
];
