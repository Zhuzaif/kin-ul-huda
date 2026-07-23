export type IstihazaHadith = {
  arabic: string;
  translation: string;
  narrator: string;
  reference: string;
  additionalRef?: string;
};

export type IstihazaTopic = {
  id: string;
  title: string;
  emoji: string;
  tagLabel: string;
  tagColor: string;
  tagBg: string;
  summary: string;
  hadith?: IstihazaHadith;
  explanation: string;
  keyPoints?: string[];
};

export const istihazaTopics: IstihazaTopic[] = [
  {
    id: 'istihaza-understanding',
    title: 'Understanding Istihaza',
    emoji: '🩸',
    tagLabel: 'Foundation',
    tagColor: 'text-[#2B604A]',
    tagBg: 'bg-soft-mint',
    summary:
      'Istihaza is abnormal or irregular vaginal bleeding that is not considered Haiz (menstruation) or Nifas (post-natal bleeding) according to the applicable Islamic rulings.',
    hadith: {
      arabic:
        'عَنْ عَائِشَةَ رضي الله عنها:\n\nأَنَّ فَاطِمَةَ بِنْتَ أَبِي حُبَيْشٍ كَانَتْ تُسْتَحَاضُ، فَقَالَ لَهَا النَّبِيُّ ﷺ: «إِنَّ دَمَ الْحَيْضِ دَمٌ أَسْوَدُ يُعْرَفُ، فَإِذَا كَانَ ذَلِكَ فَأَمْسِكِي عَنِ الصَّلَاةِ، فَإِذَا كَانَ الْآخَرُ فَتَوَضَّئِي وَصَلِّي، فَإِنَّمَا هُوَ عِرْقٌ»',
      translation:
        '\'Aishah رضي الله عنها narrated that Fatimah bint Abi Hubaysh رضي الله عنها experienced prolonged bleeding. The Prophet ﷺ said:\n\n"When it is menstrual blood, it is recognizable. When that blood comes, refrain from prayer; and when the other type of blood comes, perform Wudu and pray, for it is from a vein."',
      narrator: '\'Aishah (رضي الله عنها)',
      reference: 'Sunan Abi Dawud 286',
      additionalRef: 'Also reported in: Sunan an-Nasa\'i 215, Ibn Majah 621',
    },
    explanation:
      'Istihaza is abnormal or irregular vaginal bleeding that is not considered Haiz (menstruation) or Nifas (post-natal bleeding) according to the applicable Islamic rulings.\n\nA woman experiencing Istihaza is considered ritually pure in terms of the rulings of Haiz and Nifas, so she continues her normal acts of worship.\n\nHaiz vs. Istihaza:\n• Haiz is normal menstrual bleeding — Istihaza is abnormal/irregular bleeding\n• During Haiz, Salah is not performed — During Istihaza, Salah continues\n• During Haiz, fasting is not performed — During Istihaza, fasting continues\n• Missed Ramadan fasts are made up after Haiz — No missed fasts due to Istihaza\n• Ghusl is performed after Haiz ends — Different purification rules apply for Istihaza\n\nIstihaza may occur when: bleeding continues beyond the applicable menstrual limit, bleeding occurs outside the woman\'s normal menstrual period, a woman experiences continuous or irregular bleeding, or bleeding does not match her established menstrual pattern.\n\nThe exact ruling depends on factors such as: her usual menstrual habit, the duration of the bleeding, the characteristics of the blood, and the fiqh school being followed.\n\nDuring Istihaza, the woman performs Salah, fasts, makes Dua and Dhikr, and continues her normal worship.',
    keyPoints: [
      'Istihaza is abnormal or irregular bleeding — not Haiz or Nifas',
      'A woman experiencing Istihaza continues her normal acts of worship',
      'During Istihaza, Salah continues — unlike Haiz',
      'During Istihaza, fasting continues — unlike Haiz',
      'The ruling depends on menstrual habit, bleeding duration, blood characteristics, and fiqh school',
      'Istihaza may occur when bleeding continues beyond the menstrual limit or occurs outside the normal period',
      'Dua, Dhikr, and all acts of worship continue during Istihaza',
    ],
  },
  {
    id: 'istihaza-identification',
    title: 'Identifying Istihaza',
    emoji: '🔍',
    tagLabel: 'Identification',
    tagColor: 'text-[#D98A5B]',
    tagBg: 'bg-light-peach',
    summary:
      'How to identify whether bleeding is Haiz or Istihaza — based on menstrual habit, duration, blood characteristics, and the applicable fiqh rules.',
    hadith: {
      arabic:
        'عَنْ عَائِشَةَ رضي الله عنها:\n\nأَنَّ فَاطِمَةَ بِنْتَ أَبِي حُبَيْشٍ كَانَتْ تُسْتَحَاضُ، فَقَالَ لَهَا النَّبِيُّ ﷺ: «إِنَّ دَمَ الْحَيْضِ دَمٌ أَسْوَدُ يُعْرَفُ، فَإِذَا كَانَ ذَلِكَ فَأَمْسِكِي عَنِ الصَّلَاةِ، فَإِذَا كَانَ الْآخَرُ فَتَوَضَّئِي وَصَلِّي، فَإِنَّمَا هُوَ عِرْقٌ»',
      translation:
        'The Prophet ﷺ said to Fatimah bint Abi Hubaysh رضي الله عنها:\n\n"When it is menstrual blood, it is recognizable. When that blood comes, refrain from prayer; and when the other type of blood comes, perform Wudu and pray, for it is from a vein."',
      narrator: '\'Aishah (رضي الله عنها)',
      reference: 'Sunan Abi Dawud 286',
      additionalRef: 'Also in: Sunan an-Nasa\'i 215',
    },
    explanation:
      'Identifying Istihaza involves several factors:\n\n1. Compare It With Your Normal Menstrual Habit: What is your usual period length? Does the current bleeding continue much longer than usual? Has your normal pattern changed? A woman\'s established menstrual habit can be important in determining the ruling.\n\n2. Consider the Duration: If bleeding continues beyond the applicable maximum duration of Haiz according to the fiqh school being followed, the additional bleeding may be classified as Istihaza. The maximum duration differs among fiqh schools, so the ruling is not always identical for everyone.\n\n3. Observe the Blood: The Hadith mentions that menstrual blood can be recognizable. Scholars have discussed characteristics such as color, thickness, smell, and flow. However, blood appearance alone should not always be used to determine the ruling. A woman\'s established menstrual pattern and applicable fiqh rules may also be important.\n\n4. Continuous or Irregular Bleeding: Istihaza may be involved when bleeding continues unusually long, bleeding occurs outside the normal period, bleeding stops and starts irregularly, or the woman experiences continuous bleeding.\n\nSimple Example: A woman normally menstruates for 6 days. This month, Days 1–6 follow the applicable ruling for her normal Haiz. If bleeding continues afterward, further fiqh rules are needed to determine whether the remaining bleeding is Istihaza.\n\nThere is no single method that applies identically to every case. The ruling may depend on: previous menstrual habit (\'Adah), duration of bleeding, periods of purity, blood characteristics, and the fiqh school being followed.',
    keyPoints: [
      'Compare bleeding with your normal menstrual habit — duration, pattern, and changes',
      'If bleeding exceeds the maximum duration of Haiz, it may be Istihaza',
      'The maximum duration differs among fiqh schools — ruling is not identical for everyone',
      'Menstrual blood can be recognizable — scholars discuss color, thickness, smell, and flow',
      'Blood appearance alone should not always determine the ruling',
      'Istihaza may involve continuous, unusually long, or irregular bleeding',
      'The ruling depends on menstrual habit, duration, purity periods, blood characteristics, and fiqh school',
      'There is no single method that applies identically to every case',
    ],
  },
  {
    id: 'istihaza-duration-worship',
    title: 'Duration, Limits & Worship',
    emoji: '🕌',
    tagLabel: 'Important',
    tagColor: 'text-soft-pink-dark',
    tagBg: 'bg-soft-pink',
    summary:
      'When bleeding becomes Istihaza, and how Salah, fasting, and purification continue during Istihaza — unlike Haiz.',
    hadith: {
      arabic:
        'عَنْ عَائِشَةَ رضي الله عنها:\n\nأَنَّ فَاطِمَةَ بِنْتَ أَبِي حُبَيْشٍ كَانَتْ تُسْتَحَاضُ، فَقَالَ لَهَا النَّبِيُّ ﷺ: «إِنَّ دَمَ الْحَيْضِ دَمٌ أَسْوَدُ يُعْرَفُ، فَإِذَا كَانَ ذَلِكَ فَأَمْسِكِي عَنِ الصَّلَاةِ، فَإِذَا كَانَ الْآخَرُ فَتَوَضَّئِي وَصَلِّي، فَإِنَّمَا هُوَ عِرْقٌ»',
      translation:
        'The Prophet ﷺ said to Fatimah bint Abi Hubaysh رضي الله عنها:\n\n"When it is menstrual blood, refrain from prayer. When the other type of blood comes, perform Wudu and pray, for it is from a vein."',
      narrator: '\'Aishah (رضي الله عنها)',
      reference: 'Sunan Abi Dawud 286',
    },
    explanation:
      'When Does Bleeding Become Istihaza?\n\nIstihaza may be considered when: bleeding continues beyond the applicable limit of Haiz, bleeding occurs outside the woman\'s normal menstrual period, bleeding is continuous or irregular, or the bleeding does not follow the woman\'s usual menstrual pattern.\n\nThe ruling may depend on: usual menstrual habit (\'Adah), duration of bleeding, previous cycles, and the fiqh school being followed. The maximum duration of Haiz is not the same in all fiqh schools, so the exact ruling can differ.\n\n1. Salah During Istihaza: Unlike Haiz, a woman experiencing Istihaza performs the five daily prayers, performs missed prayers if they were missed for reasons unrelated to Haiz, and does not stop praying simply because of Istihaza bleeding.\n\n2. Fasting During Istihaza: A woman may fast during Istihaza. Ramadan fasting is valid. Voluntary fasting is also permitted. Unlike Haiz, Istihaza does not require a woman to stop fasting.\n\n3. Purification During Istihaza: A woman should clean herself as much as reasonably possible, use suitable protection to prevent blood from spreading, perform the required purification according to the fiqh school she follows, and perform Wudu according to the relevant ruling for continuous bleeding. The Hadith of Fatimah bint Abi Hubaysh establishes the instruction to perform Wudu and pray during non-menstrual bleeding.\n\nDuring Istihaza, she performs Salah, fasts, makes Dua and Dhikr, and continues her normal worship.',
    keyPoints: [
      'Istihaza may occur when bleeding exceeds the Haiz limit, occurs outside the normal period, or is continuous/irregular',
      'Salah continues during Istihaza — unlike Haiz, a woman does not stop praying',
      'Fasting continues during Istihaza — Ramadan fasting is valid, voluntary fasting is permitted',
      'A woman should clean herself and use suitable protection',
      'Wudu is performed according to the relevant ruling for continuous bleeding',
      'The maximum duration of Haiz differs among fiqh schools — exact ruling can differ',
      'Dua, Dhikr, and all acts of worship continue during Istihaza',
    ],
  },
  {
    id: 'istihaza-purification',
    title: 'Purification & Daily Management',
    emoji: '🧼',
    tagLabel: 'Purification',
    tagColor: 'text-muted-gold',
    tagBg: 'bg-muted-gold-light',
    summary:
      'How to manage purification, Wudu, and daily worship during Istihaza — practical guidance for maintaining cleanliness and continuing acts of worship.',
    hadith: {
      arabic:
        'قَالَ النَّبِيُّ ﷺ لِفَاطِمَةَ بِنْتِ أَبِي حُبَيْشٍ رضي الله عنها:\n\n«ثُمَّ تَوَضَّئِي لِكُلِّ صَلَاةٍ وَصَلِّي»',
      translation:
        'The Prophet ﷺ said to Fatimah bint Abi Hubaysh رضي الله عنها:\n\n"Then perform Wudu for every prayer and pray."',
      narrator: '\'Aishah (رضي الله عنها)',
      reference: 'Sahih al-Bukhari 228',
      additionalRef: 'Also in: Sunan Abi Dawud 286',
    },
    explanation:
      'Purification and daily management during Istihaza involves several practical steps:\n\n1. Clean the Blood: Before prayer, clean the blood from the private area as much as reasonably possible. Use a pad or suitable protection to prevent blood from spreading. Change the protection when necessary.\n\n2. Ghusl: A woman experiencing Istihaza does not normally need to perform Ghusl for every prayer. Ghusl is performed when Haiz ends. For Istihaza, the purification rules are generally related to cleanliness and Wudu. The exact details of Wudu for continuous bleeding differ among fiqh schools.\n\n3. Wudu: The Prophet ﷺ instructed the woman experiencing Istihaza to perform Wudu and pray. A woman should clean the affected area, use suitable protection, perform Wudu according to the applicable fiqh ruling, and pray.\n\n4. Continue Worship: During Istihaza, a woman may perform Salah, fast, make Dua, perform Dhikr, read and study Islam, and perform other acts of worship.\n\nIstihaza does not stop a woman from worshipping Allah. She should maintain cleanliness, follow the relevant Wudu rules, and continue Salah and other acts of worship.',
    keyPoints: [
      'Clean the blood before prayer as much as reasonably possible',
      'Use a pad or suitable protection to prevent blood from spreading',
      'Ghusl is not required for every prayer during Istihaza — Ghusl is performed when Haiz ends',
      'Wudu is performed according to the applicable fiqh ruling',
      'The Prophet ﷺ instructed: "perform Wudu for every prayer and pray"',
      'The exact details of Wudu for continuous bleeding differ among fiqh schools',
      'Continue Salah, fasting, Dua, Dhikr, and all acts of worship',
      'Istihaza does not stop a woman from worshipping Allah',
    ],
  },
  {
    id: 'istihaza-special-cases',
    title: 'Special Cases & Common Questions',
    emoji: '⚠️',
    tagLabel: 'Advanced',
    tagColor: 'text-[#D98A5B]',
    tagBg: 'bg-light-peach',
    summary:
      'Special situations including bleeding that continues after the normal period, bleeding that stops and returns, confusing patterns, and bleeding during pregnancy.',
    hadith: {
      arabic:
        'قَالَ النَّبِيُّ ﷺ لِفَاطِمَةَ بِنْتِ أَبِي حُبَيْشٍ رضي الله عنها:\n\n«ذَلِكِ عِرْقٌ وَلَيْسَتْ بِالْحَيْضَةِ، فَإِذَا أَقْبَلَتِ الْحَيْضَةُ فَدَعِي الصَّلَاةَ، وَإِذَا أَدْبَرَتْ فَاغْسِلِي عَنْكِ الدَّمَ وَصَلِّي»',
      translation:
        'The Prophet ﷺ said to Fatimah bint Abi Hubaysh رضي الله عنها:\n\n"That is a vein, not menstruation. When menstruation comes, stop praying, and when it is over, wash the blood from yourself and pray."',
      narrator: '\'Aishah (رضي الله عنها)',
      reference: 'Sahih al-Bukhari 228',
    },
    explanation:
      '1. Bleeding Continues After the Normal Period: If bleeding continues beyond a woman\'s usual menstrual days, the woman should consider her established menstrual pattern. The additional bleeding may be Istihaza. She should follow the applicable fiqh rules.\n\n2. Bleeding Stops and Then Returns: If bleeding stops temporarily, then returns, or becomes irregular, the ruling may depend on: the duration of the bleeding, the length of the pure interval, the woman\'s previous menstrual habit, and the fiqh school being followed.\n\n3. Haiz and Istihaza Occur Together: Sometimes bleeding patterns can be confusing. A woman should not decide based only on blood color, amount of blood, or one isolated day. The complete bleeding pattern and relevant fiqh rules should be considered.\n\n4. Bleeding During Pregnancy: Bleeding during pregnancy is a special case and should not automatically be classified as Haiz or Istihaza. The ruling can differ according to the circumstances. Medical advice may also be important. A qualified scholar should be consulted for the Islamic ruling.\n\n5. When Should a Scholar Be Consulted? A qualified scholar should be consulted when: bleeding is continuous, the normal cycle has changed significantly, it is difficult to distinguish Haiz from Istihaza, bleeding stops and repeatedly returns, or there is a complicated pregnancy-related case.',
    keyPoints: [
      'Bleeding beyond usual menstrual days — consider established pattern, additional bleeding may be Istihaza',
      'Bleeding stops and returns — ruling depends on duration, pure interval, habit, and fiqh school',
      'Confusing patterns — do not decide based only on blood color, amount, or one isolated day',
      'Bleeding during pregnancy — special case, should not automatically be classified as Haiz or Istihaza',
      'Medical advice may be important in pregnancy-related bleeding',
      'Consult a qualified scholar when bleeding is continuous or the normal cycle has changed significantly',
      'Consult a scholar when it is difficult to distinguish Haiz from Istihaza',
      'Consult a scholar for complicated pregnancy-related cases',
    ],
  },
];
