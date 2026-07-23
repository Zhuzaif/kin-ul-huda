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
      'Every woman may have a different menstrual pattern. Understanding the minimum and maximum limits of menstruation, the difference between Haiz and Istihada, and what happens when bleeding is unusually long.',
    hadith: {
      arabic:
        'عَنْ حَمْنَةَ بِنْتِ جَحْشٍ، قَالَتْ:\n\nكُنْتُ أُسْتَحَاضُ حَيْضَةً كَثِيرَةً شَدِيدَةً، فَأَتَيْتُ النَّبِيَّ ﷺ أَسْتَفْتِيهِ، فَقَالَ: «فَتَحَيَّضِي سِتَّةَ أَيَّامٍ أَوْ سَبْعَةَ أَيَّامٍ فِي عِلْمِ اللَّهِ، ثُمَّ اغْتَسِلِي...»',
      translation:
        'Hamnah bint Jahsh (رضي الله عنها) said:\n\n"I used to experience very heavy and severe bleeding, so I went to the Prophet ﷺ seeking his guidance."\n\nThe Prophet ﷺ said:\n\n"Consider yourself menstruating for six or seven days—as Allah knows which is appropriate—then perform Ghusl."',
      narrator: 'Hamnah bint Jahsh (رضي الله عنها)',
      reference: 'Sunan Abi Dawud 287',
    },
    explanation:
      'Every woman may have a different menstrual pattern — some may usually menstruate for 4, 5, 6, 7 days, or another number of days. A woman\'s usual pattern is important when dealing with unusual or prolonged bleeding.\n\nThis Hadith deals with a woman who experienced very heavy and prolonged bleeding. It teaches that when bleeding continues unusually long, a woman may need to distinguish between Haiz (normal menstrual bleeding during which certain acts of worship are temporarily suspended) and Istihada (abnormal or irregular bleeding that is not treated the same way as normal menstruation). The mention of six or seven days in this Hadith should not automatically be understood as a universal fixed duration for every woman — it relates to the specific case of Hamnah (رضي الله عنها) and prolonged bleeding.\n\nRegarding minimum and maximum duration, Islamic scholars have discussed this differently. According to the Hanafi school: minimum Haiz is 3 complete days (72 hours), maximum is 10 complete days, and the minimum purity between two periods is 15 complete days. Other Sunni schools may consider the maximum menstruation up to 15 days, with other details varying by school. These are Fiqhi opinions and should not be taken as one universally accepted rule.\n\nWhen a woman becomes certain that her menstruation has ended and purity has returned, she performs Ghusl, resumes Salah, resumes fasting, and continues her normal acts of worship. For unusual or prolonged bleeding, a qualified scholar should be consulted for a personal ruling.',
    keyPoints: [
      'Every woman may have a different menstrual pattern — there is no single universal duration',
      'If bleeding continues unusually long, it may involve the rules of Istihada (abnormal bleeding)',
      'Hanafi school — Minimum Haiz: 3 complete days (72 hours)',
      'Hanafi school — Maximum Haiz: 10 complete days (240 hours)',
      'Hanafi school — Minimum purity between two periods: 15 complete days',
      'Other Sunni schools may consider maximum menstruation up to 15 days — details differ by school',
      'These are Fiqhi opinions — not one universally accepted rule',
      'A woman\'s usual menstrual habit is important in determining her situation',
      'When purity returns: perform Ghusl, resume Salah, fasting, and all acts of worship',
      'For unusual or prolonged bleeding, consult a qualified scholar',
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
      'During menstruation, Islam temporarily exempts a woman from certain acts of worship. This is not a punishment and does not mean that a menstruating woman is spiritually impure or separated from Allah.',
    hadith: {
      arabic:
        'عَنْ مُعَاذَةَ، قَالَتْ:\n\nسَأَلْتُ عَائِشَةَ فَقُلْتُ: مَا بَالُ الْحَائِضِ تَقْضِي الصَّوْمَ وَلَا تَقْضِي الصَّلَاةَ؟ فَقَالَتْ: أَحَرُورِيَّةٌ أَنْتِ؟ قُلْتُ: لَسْتُ بِحَرُورِيَّةٍ، وَلَكِنِّي أَسْأَلُ. قَالَتْ: كَانَ يُصِيبُنَا ذَلِكَ، فَنُؤْمَرُ بِقَضَاءِ الصَّوْمِ، وَلَا نُؤْمَرُ بِقَضَاءِ الصَّلَاةِ.',
      translation:
        'Mu\'adha said:\n\n"I asked \'Aishah (رضي الله عنها): \'Why does a menstruating woman make up the missed fasts but not the missed prayers?\'\n\nShe said:\n\n\'We used to experience that, and we were commanded to make up the fasts, but we were not commanded to make up the prayers.\'"',
      narrator: "Mu'adha, from 'Aishah (رضي الله عنها)",
      reference: 'Sahih Muslim 335c; Sahih al-Bukhari 321',
    },
    explanation:
      'During menstruation, Islam temporarily exempts a woman from certain acts of worship. This is not a punishment and does not mean she is spiritually impure or separated from Allah.\n\n1. Salah (Prayer): A menstruating woman does not perform the five daily prayers during her menstruation. After menstruation, she performs Ghusl and resumes Salah. She does not make up the missed prayers from the days of menstruation.\n\n2. Fasting: A menstruating woman does not fast during her menstruation — this includes Ramadan fasts, voluntary fasts, and other obligatory fasts. After menstruation, missed Ramadan fasts must be made up, but missed Salah does not need to be made up.\n\n3. Tawaf Around the Ka\'bah: A menstruating woman does not perform Tawaf around the Ka\'bah until she becomes pure and performs Ghusl. The Prophet ﷺ said to \'Aishah (رضي الله عنها): "Do what the pilgrims do, except perform Tawaf around the House until you become pure." (Sahih al-Bukhari 305; Sahih Muslim 1211)\n\n4. Sexual Intercourse: Sexual intercourse is prohibited during menstruation. Allah says: "So keep away from women during menstruation and do not approach them until they are pure." (Qur\'an 2:222). After menstruation ends and the woman performs Ghusl, marital intimacy becomes permissible.',
    keyPoints: [
      'Salah is not performed during Haiz — missed prayers do NOT need to be made up',
      'Fasting is not performed during Haiz — missed Ramadan fasts MUST be made up later',
      'Tawaf around the Ka\'bah is not performed until purity and Ghusl',
      'Sexual intercourse is prohibited until menstruation ends and Ghusl is performed (Qur\'an 2:222)',
      'These exemptions are a mercy from Allah — not a punishment or sign of spiritual impurity',
      'After menstruation: perform Ghusl, resume Salah, resume fasting, and continue all acts of worship',
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
      'Menstruation does not prevent a woman from remembering Allah, making Du\'a, or living normally. Only certain specific acts have restrictions.',
    hadith: {
      arabic:
        'عَنْ عَائِشَةَ رضي الله عنها قَالَتْ:\n\nكُنْتُ أَشْرَبُ وَأَنَا حَائِضٌ، ثُمَّ أُنَاوِلُهُ النَّبِيَّ ﷺ، فَيَضَعُ فَاهُ عَلَى مَوْضِعِ فِيَّ فَيَشْرَبُ، وَأَتَعَرَّقُ الْعَرَقَ وَأَنَا حَائِضٌ، ثُمَّ أُنَاوِلُهُ النَّبِيَّ ﷺ، فَيَضَعُ فَاهُ عَلَى مَوْضِعِ فِيَّ.',
      translation:
        '\'Aishah (رضي الله عنها) said:\n\n"I would drink while menstruating, then I would give the vessel to the Prophet ﷺ, and he would place his mouth where my mouth had been and drink. I would also bite meat from a bone while menstruating and then give it to the Prophet ﷺ, and he would place his mouth where my mouth had been."',
      narrator: "'Aishah (رضي الله عنها)",
      reference: 'Sahih Muslim 300',
    },
    explanation:
      'Menstruation does not prevent a woman from remembering Allah, making Du\'a, or living normally. Only certain specific acts have restrictions.\n\n1. Dua (Supplication): A woman may make Dua at any time during menstruation — asking Allah for forgiveness, guidance, protection, good health, success, and mercy.\n\n2. Dhikr and Istighfar: She may remember Allah by saying SubhanAllah, Alhamdulillah, Allahu Akbar, La ilaha illallah, Astaghfirullah, and sending Salawat upon the Prophet ﷺ.\n\n3. Listening to the Qur\'an: A menstruating woman may listen to Qur\'an recitation, Tafsir, Islamic lectures, and Quran lessons.\n\n4. Islamic Learning: She may study Islam, learn Hadith, read Islamic books, attend Islamic classes, teach others, and take part in beneficial Islamic education.\n\n5. Eating and Drinking with Others: A menstruating woman may eat with her family, drink from the same cup, share food, and sit and eat with her husband. She is not physically impure as a person.\n\n6. Normal Family Life: She may live normally with her family, sleep in the same bed as her husband, sit with him, talk and spend time with him, show and receive affection. Sexual intercourse is prohibited during menstruation, but normal marital interaction is permitted.\n\n7. Personal Hygiene: A woman may take a shower, wash her hair, cut her nails, brush her teeth, change clothes, and use personal hygiene products. She does not need to avoid normal cleanliness during menstruation.\n\n8. Charity and Good Deeds: She may give Sadaqah, help the poor, help her family, visit people, and do voluntary good deeds.\n\n9. Hajj Activities Other Than Tawaf: During Hajj, a menstruating woman may perform many acts of Hajj. The Prophet ﷺ told \'Aishah (رضي الله عنها): "Do what the pilgrims do, except perform Tawaf around the House." (Sahih al-Bukhari 305)',
    keyPoints: [
      'Dua (supplication) — asking Allah for anything at any time',
      'Dhikr — SubhanAllah, Alhamdulillah, Allahu Akbar, La ilaha illallah, Istighfar',
      'Salawat upon the Prophet ﷺ',
      'Listening to Qur\'an recitation, Tafsir, and Islamic lectures',
      'Islamic learning — studying, reading, attending classes, teaching others',
      'Eating and drinking normally with family — she is not impure as a person',
      'Normal family life and marital interaction (except intercourse)',
      'Personal hygiene — shower, grooming, and cleanliness as usual',
      'Giving charity (Sadaqah) and helping others',
      'Hajj activities other than Tawaf around the Ka\'bah',
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
      'When menstruation ends and purity is established, a woman performs Ghusl (ritual bath) before resuming Salah, fasting, and other acts of worship.',
    hadith: {
      arabic:
        'عَنْ عَائِشَةَ رضي الله عنها:\n\nأَنَّ أَسْمَاءَ بِنْتَ شَكَلٍ سَأَلَتِ النَّبِيَّ ﷺ عَنْ غُسْلِ الْمَحِيضِ، فَقَالَ: «تَأْخُذُ إِحْدَاكُنَّ مَاءَهَا وَسِدْرَتَهَا، فَتَطَهَّرُ فَتُحْسِنُ الطُّهُورَ، ثُمَّ تَصُبُّ عَلَى رَأْسِهَا فَتَدْلُكُهُ دَلْكًا شَدِيدًا حَتَّى تَبْلُغَ شُؤُونَ رَأْسِهَا، ثُمَّ تَصُبُّ عَلَيْهَا الْمَاءَ، ثُمَّ تَأْخُذُ فِرْصَةً مُمَسَّكَةً فَتَطَهَّرُ بِهَا»',
      translation:
        'Asma\' bint Shakal (رضي الله عنها) asked the Messenger of Allah ﷺ about the ritual bath after menstruation. He ﷺ said:\n\n"One of you should take her water and lotus leaves, purify herself properly, then pour water over her head and rub it thoroughly until the water reaches the roots of her hair. Then she should pour water over herself. Then she should take a piece of cloth scented with musk and purify herself with it."',
      narrator: "'Aishah (رضي الله عنها), narrating the question of Asma' bint Shakal (رضي الله عنها)",
      reference: 'Sahih Muslim 332c',
      additionalRef: 'Related narrations: Sahih Muslim 332a–e',
    },
    explanation:
      'Ghusl should be performed after menstruation has ended and purity is established. The Prophet ﷺ said: "When menstruation begins, stop praying; and when it ends, wash the blood from yourself and pray." (Sahih al-Bukhari 331)\n\nSteps of Ghusl After Haiz:\n\n1. Make the Intention (Niyyah): Make the intention in your heart to perform Ghusl to purify yourself from menstruation. The intention is made in the heart; saying it aloud is not necessary.\n\n2. Wash Away Any Blood or Impurity: First, clean the body from any remaining menstrual blood or impurity. The Prophet ﷺ specifically instructed the woman to wash away the blood after menstruation ends.\n\n3. Perform Wudu: Perform Wudu as you would for Salah. The Hadith describes purification before completing the bath.\n\n4. Wash the Head and Hair Thoroughly: Pour water over the head and rub the hair so that the water reaches the roots of the hair and scalp. A woman does not necessarily have to undo tightly braided hair if water can reach the roots — Umm Salamah (رضي الله عنها) asked the Prophet ﷺ about this, and he ﷺ said it was sufficient to pour water over the head and then over the body (Sahih Muslim 330a).\n\n5. Wash the Entire Body: Pour water over the entire body and ensure water reaches all areas — underarms, navel, between fingers and toes, skin folds, and the entire external body.\n\n6. Clean the Area of Menstrual Blood: The Sunnah mentions using a piece of cloth scented with musk to cleanse the area where menstrual blood had been. Today, the important principle is properly cleaning the area.\n\nImportant: If bleeding continues beyond the normal menstrual period, it may be Istihada, not Haiz. In such a case, the ruling is different — the Prophet ﷺ instructed women suffering from prolonged bleeding to consider their normal menstrual period and then perform Ghusl and pray (Sahih Muslim 333a, 334e).',
    keyPoints: [
      'Ghusl becomes obligatory once menstruation ends and purity is established',
      'Step 1: Make intention (Niyyah) in the heart for purification from Haiz',
      'Step 2: Wash away any remaining menstrual blood or impurity',
      'Step 3: Perform Wudu as you would for Salah',
      'Step 4: Wash the head and hair thoroughly — water must reach the roots',
      'Braided hair does not need to be undone if water reaches the roots (Sahih Muslim 330a)',
      'Step 5: Wash the entire body — ensure water reaches all areas',
      'Step 6: Clean the area of menstrual blood properly',
      'After Ghusl: resume Salah, fasting, and all paused acts of worship',
      'If bleeding continues beyond normal, it may be Istihada — ruling differs (consult a scholar)',
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
      'A woman does not fast during menstruation. Missed obligatory Ramadan fasts must be made up later, but missed prayers during menstruation do not need to be made up.',
    hadith: {
      arabic:
        'قَالَتْ مُعَاذَةُ:\n\nسَأَلْتُ عَائِشَةَ فَقُلْتُ: مَا بَالُ الْحَائِضِ تَقْضِي الصَّوْمَ وَلَا تَقْضِي الصَّلَاةَ؟ فَقَالَتْ: كَانَ يُصِيبُنَا ذَلِكَ، فَنُؤْمَرُ بِقَضَاءِ الصَّوْمِ، وَلَا نُؤْمَرُ بِقَضَاءِ الصَّلَاةِ.',
      translation:
        'Mu\'adha asked \'Aishah (رضي الله عنها):\n\n"Why does a menstruating woman make up the missed fasts but not the missed prayers?"\n\n\'Aishah (رضي الله عنها) replied:\n\n"We used to experience that, and we were commanded to make up the missed fasts, but we were not commanded to make up the missed prayers."',
      narrator: "Mu'adha, from 'Aishah (رضي الله عنها)",
      reference: 'Sahih Muslim 335c; Sahih al-Bukhari 321',
    },
    explanation:
      'A woman does not fast during menstruation. Missed obligatory Ramadan fasts must be made up later (Qada), but missed prayers during menstruation do not need to be made up. This is based on the direct instruction of the Prophet ﷺ as narrated by \'Aishah (رضي الله عنها).\n\nExample: If a woman misses 5 Ramadan fasts because of menstruation, she must later fast 5 days as Qada. If she misses prayers during those same 5 days, she does not have to make up those prayers.\n\nThe missed Ramadan fasts can be made up after Ramadan and before the next Ramadan, whenever the woman is able to fast. It is better not to delay them unnecessarily.',
    keyPoints: [
      'A woman does not fast during menstruation',
      'Missed Ramadan fasts: MUST be made up later (Qada)',
      'Missed prayers during Haiz: do NOT need to be made up',
      'This ruling is based on the direct command of the Prophet ﷺ',
      'Qada fasts can be made up any time after Ramadan and before the next Ramadan',
      'It is better not to delay making up missed fasts unnecessarily',
    ],
  },
  {
    id: 'haiz-husband-interaction',
    title: 'Intimacy with Husband During Haiz',
    emoji: '💑',
    tagLabel: 'Marriage',
    tagColor: 'text-soft-pink-dark',
    tagBg: 'bg-soft-pink',
    summary:
      'During menstruation, the only prohibition between husband and wife is sexual intercourse. Normal marital interaction, affection, and living together continues as usual.',
    hadith: {
      arabic:
        'قَالَ رَسُولُ اللَّهِ ﷺ:\n\n«اصْنَعُوا كُلَّ شَيْءٍ إِلَّا النِّكَاحَ»',
      translation:
        'The Messenger of Allah ﷺ said:\n\n"Do everything except sexual intercourse."',
      narrator: 'Anas ibn Malik (رضي الله عنه)',
      reference: 'Sahih Muslim 302',
    },
    explanation:
      'According to the Qur\'an, sexual intercourse during menstruation is prohibited. Allah says: "They ask you about menstruation. Say, \'It is a discomfort, so keep away from women during menstruation and do not approach them until they are pure.\'" (Surah Al-Baqarah 2:222)\n\nHowever, during Haiz, a husband and wife may: talk and spend time together, eat and drink together, sleep in the same bed, show normal affection, and live together normally. The prohibition specifically concerns sexual intercourse during menstruation.\n\n\'Aishah (رضي الله عنها) reported that the Prophet ﷺ would rest in her lap while she was menstruating and recite the Qur\'an (Sahih al-Bukhari 297; Sahih Muslim 301).\n\nAfter menstruation has ended and the woman has performed Ghusl, marital intimacy becomes permissible again.',
    keyPoints: [
      'Sexual intercourse is prohibited during menstruation (Qur\'an 2:222)',
      'The Prophet ﷺ said: "Do everything except sexual intercourse" (Sahih Muslim 302)',
      'Husband and wife may talk, eat, drink, and spend time together normally',
      'They may sleep in the same bed and show normal affection',
      'The Prophet ﷺ would rest in \'Aishah\'s lap while she was menstruating (Bukhari 297; Muslim 301)',
      'A menstruating woman is NOT to be isolated or shunned',
      'After menstruation ends and Ghusl is performed, marital intimacy becomes permissible again',
    ],
  },
];
