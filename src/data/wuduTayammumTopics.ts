export type WuduTayammumHadith = {
  arabic: string;
  translation: string;
  narrator: string;
  reference: string;
  additionalRef?: string;
};

export type WuduTayammumTopic = {
  id: string;
  title: string;
  emoji: string;
  tagLabel: string;
  tagColor: string;
  tagBg: string;
  summary: string;
  hadith?: WuduTayammumHadith;
  explanation: string;
  keyPoints?: string[];
};

export const wuduTayammumTopics: WuduTayammumTopic[] = [
  {
    id: 'wudu-step-by-step',
    title: 'Step-by-Step Method of Wudu',
    emoji: '💧',
    tagLabel: 'Sunnah Method',
    tagColor: 'text-[#2B604A]',
    tagBg: 'bg-soft-mint',
    summary:
      'The authentic step-by-step method of Wudu demonstrated by the Prophet ﷺ in Hadith.',
    hadith: {
      arabic:
        'عَنْ حُمْرَانَ مَوْلَى عُثْمَانَ رضي الله عنه قَالَ:\n\nدَعَا عُثْمَانُ بِوَضُوءٍ، فَغَسَلَ كَفَّيْهِ ثَلَاثًا، ثُمَّ مَضْمَضَ وَاسْتَنْشَقَ، ثُمَّ غَسَلَ وَجْهَهُ ثَلَاثًا، ثُمَّ غَسَلَ يَدَهُ الْيُمْنَى إِلَى الْمِرْفَقِ ثَلَاثًا، ثُمَّ الْيُسْرَى مِثْلَ ذَلِكَ، ثُمَّ مَسَحَ بِرَأْسِهِ، ثُمَّ غَسَلَ رِجْلَهُ الْيُمْنَى إِلَى الْكَعْبَيْنِ ثَلَاثًا، ثُمَّ الْيُسْرَى مِثْلَ ذَلِكَ، ثُمَّ قَالَ: رَأَيْتُ رَسُولَ اللَّهِ ﷺ تَوَضَّأَ نَحْوَ وُضُوئِي هَذَا.',
      translation:
        'Humran, the freed slave of \'Uthman (RA), narrated:\n\n"\'Uthman performed Wudu, washing his hands three times, rinsing his mouth and nose, washing his face three times, washing his right arm then his left arm up to the elbows three times, wiping his head, washing his right foot then his left foot up to the ankles three times, and then said: \'I saw the Messenger of Allah ﷺ perform Wudu just as I have performed it.\'"',
      narrator: "Humran, from 'Uthman ibn 'Affan (رضي الله عنه)",
      reference: 'Sahih al-Bukhari 159, Sahih Muslim 226',
    },
    explanation:
      'Step-by-Step Method of Wudu\n\n1. 🤲 Make Niyyah (Intention): Make the intention in your heart to perform Wudu for purification. There is no authentic hadith requiring the intention to be spoken aloud.\n\n2. 🕌 Say "Bismillah": Before beginning Wudu, say: بِسْمِ اللَّهِ ("In the name of Allah.") (Reference: Sunan Abi Dawud 101)\n\n3. 🖐️ Wash Both Hands (3 Times): Wash the right and left hands up to the wrists three times. (Reference: Sahih al-Bukhari 159)\n\n4. 👄 Rinse the Mouth (3 Times): Take water into the mouth and rinse it thoroughly. (Reference: Sahih Muslim 226)\n\n5. 👃 Rinse the Nose (3 Times): Draw water gently into the nose and blow it out. (Reference: Sahih Muslim 226)\n\n6. 😊 Wash the Face (3 Times): Wash the entire face from hairline to chin, and ear to ear. (Qur\'an 5:6; Sahih al-Bukhari 159)\n\n7. 💪 Wash Both Arms (3 Times): Wash the right arm first, then the left, including the elbows. (Qur\'an 5:6; Sahih Muslim 226)\n\n8. 🤲 Wipe the Head (Masah): Wet the hands and wipe the head once. (Qur\'an 5:6; Sahih al-Bukhari 185)\n\n9. 👂 Wipe the Ears: Wipe the inside and outside of both ears with the same wet hands. (Reference: Jami\' at-Tirmidhi 36)\n\n10. 🦶 Wash Both Feet (3 Times): Wash the right foot first, then the left, including the ankles and between the toes. (Qur\'an 5:6; Sahih al-Bukhari 159)',
    keyPoints: [
      '1. Make Niyyah in the heart (no authentic hadith requiring speaking aloud)',
      '2. Say Bismillah before starting Wudu (Sunan Abi Dawud 101)',
      '3. Wash hands 3x, rinse mouth 3x, rinse nose 3x',
      '4. Wash face 3x (hairline to chin, ear to ear)',
      '5. Wash right & left arms up to elbows 3x',
      '6. Wipe head once & wipe ears inside/outside',
      '7. Wash feet 3x up to ankles, ensuring water reaches between toes',
    ],
  },
  {
    id: 'wudu-invalidators',
    title: 'Things That Invalidate Wudu',
    emoji: '🚫',
    tagLabel: 'Fiqh Rulings',
    tagColor: 'text-[#D98A5B]',
    tagBg: 'bg-light-peach',
    summary:
      'Acts and conditions that break Wudu according to Qur\'an and authentic Hadiths.',
    hadith: {
      arabic:
        'قَالَ رَسُولُ اللَّهِ ﷺ:\n\n«لَا يَقْبَلُ اللَّهُ صَلَاةَ أَحَدِكُمْ إِذَا أَحْدَثَ حَتَّى يَتَوَضَّأَ»',
      translation:
        'The Messenger of Allah ﷺ said:\n\n"Allah does not accept the prayer of anyone who has broken his Wudu until he performs Wudu again."',
      narrator: 'Abu Hurairah (رضي الله عنه)',
      reference: 'Sahih al-Bukhari 135, Sahih Muslim 225',
    },
    explanation:
      'Things That Invalidate Wudu\n\n1. Using the Toilet: Wudu is broken by urination or defecation. (Qur\'an 5:6)\n\n2. Passing Wind: Passing gas breaks Wudu. (Sahih al-Bukhari 137; Sahih Muslim 361)\n\n3. Deep Sleep: Deep sleep that causes loss of awareness breaks Wudu. (Sunan Abi Dawud 203; Jami\' at-Tirmidhi 96)\n\n4. Loss of Consciousness: Wudu is broken if a person faints, becomes unconscious, or is intoxicated due to the complete loss of awareness.',
    keyPoints: [
      'Urination and defecation break Wudu (Qur\'an 5:6)',
      'Passing wind invalidates Wudu (Sahih al-Bukhari 137; Sahih Muslim 361)',
      'Deep sleep with loss of awareness invalidates Wudu (Sunan Abi Dawud 203)',
      'Loss of consciousness (fainting, intoxication) invalidates Wudu',
    ],
  },
  {
    id: 'wudu-common-mistakes',
    title: 'Common Mistakes During Wudu',
    emoji: '⚠️',
    tagLabel: 'Precautions',
    tagColor: 'text-[#D98A5B]',
    tagBg: 'bg-light-peach',
    summary:
      'Frequent errors in Wudu including leaving dry spots, waterproof barriers, wasting water, and doubts.',
    hadith: {
      arabic: 'وَيْلٌ لِلْأَعْقَابِ مِنَ النَّارِ',
      translation: 'The Prophet ﷺ said:\n\n"Woe to the heels from the Fire."',
      narrator: "'Abdullah ibn Amr & Abu Hurairah (رضي الله عنهم)",
      reference: 'Sahih al-Bukhari 60, Sahih Muslim 241',
    },
    explanation:
      'Common Mistakes During Wudu\n\n1. Missing Parts of the Body: The Prophet ﷺ warned against leaving parts dry during purification: "Woe to the heels from the Fire." (Sahih al-Bukhari 60, Sahih Muslim 241)\n\n2. Water Not Reaching Between Fingers and Toes: Ensure water reaches between the fingers, between the toes, and around the heels.\n\n3. Waterproof Barriers: Remove anything that prevents water from reaching the skin, such as nail polish, thick paint, glue, or similar waterproof substances.\n\n4. Wasting Water: The Prophet ﷺ discouraged wasting water, even when plenty is available. (Sunan Ibn Majah 425)\n\n5. Doubting Wudu Without Evidence: The Prophet ﷺ said: "He should not leave (the prayer) unless he hears a sound or finds a smell." (Sahih al-Bukhari 137, Sahih Muslim 361). Mere doubts do not invalidate Wudu.',
    keyPoints: [
      'Ensure heels and hidden areas are not left dry',
      'Wash between fingers and toes thoroughly',
      'Remove waterproof barriers like nail polish, thick paint, or glue',
      'Do not waste water during Wudu (Sunan Ibn Majah 425)',
      'Mere doubt does not break Wudu without certainty (sound or smell)',
    ],
  },
  {
    id: 'tayammum-permissions',
    title: 'When Is Tayammum Permitted?',
    emoji: '🏜️',
    tagLabel: 'Tayammum Rulings',
    tagColor: 'text-[#2B604A]',
    tagBg: 'bg-soft-mint',
    summary:
      'Conditions under which Tayammum (dry purification) is allowed in place of Wudu or Ghusl.',
    hadith: {
      arabic: 'قَالَ رَسُولُ اللَّهِ ﷺ:\n\n«وَجُعِلَتْ لِيَ الْأَرْضُ مَسْجِدًا وَطَهُورًا»',
      translation:
        'The Messenger of Allah ﷺ said:\n\n"The earth has been made for me a place of prayer and a means of purification."',
      narrator: "Jabir ibn 'Abdullah (رضي الله عنه)",
      reference: 'Sahih al-Bukhari 335, Sahih Muslim 521',
      additionalRef: 'Surah Al-Ma\'idah (5:6)',
    },
    explanation:
      'When Is Tayammum Permitted?\n\n📖 Main Evidence from the Qur\'an:\n"If you are ill, or on a journey, or one of you comes from relieving himself, or you have been intimate with women and cannot find water, then perform Tayammum with clean earth and wipe your faces and hands." (Surah Al-Ma\'idah 5:6)\n\n✅ When Is Tayammum Allowed?\n\n1. 💧 No Water Is Available: If clean water cannot be found after making a reasonable effort, Tayammum is permitted. (Qur\'an 5:6)\n\n2. 🤒 Illness or Medical Harm: If using water may worsen an illness, delay recovery, or cause serious harm. (Qur\'an 5:6)\n\n3. ✈️ During Travel: If a traveler cannot access water or using it is not reasonably possible. (Qur\'an 5:6)\n\n4. 🚑 Lack of Access to Water: Even if water exists, Tayammum is allowed when it cannot reasonably be reached (e.g. water too far, reaching it is dangerous, or not enough water).\n\n❌ When Tayammum Is NOT Allowed:\nTayammum is NOT allowed when water is available and can be used safely without any valid excuse.',
    keyPoints: [
      'Surah Al-Ma\'idah 5:6 establishes the ruling of Tayammum',
      'Allowed when clean water is not available after reasonable search',
      'Allowed in case of illness, injury, or risk of medical harm',
      'Allowed during travel or when water access is dangerous/insufficient',
      'NOT allowed when water is readily available and safe to use',
    ],
  },
  {
    id: 'tayammum-step-by-step',
    title: 'Step-by-Step Method of Tayammum',
    emoji: '🪜',
    tagLabel: 'Sunnah Tayammum',
    tagColor: 'text-[#2B604A]',
    tagBg: 'bg-soft-mint',
    summary:
      'The authentic step-by-step method of performing Tayammum using clean earth.',
    hadith: {
      arabic:
        'عَنْ عَمَّارِ بْنِ يَاسِرٍ رضي الله عنه قَالَ:\n\nأَجْنَبْتُ فَلَمْ أَجِدِ الْمَاءَ، فَتَمَرَّغْتُ فِي الصَّعِيدِ كَمَا تَمَرَّغُ الدَّابَّةُ، فَذَكَرْتُ ذَلِكَ لِلنَّبِيِّ ﷺ، فَقَالَ: إِنَّمَا كَانَ يَكْفِيكَ هَكَذَا، فَضَرَبَ النَّبِيُّ ﷺ بِكَفَّيْهِ الْأَرْضَ ضَرْبَةً وَاحِدَةً، ثُمَّ نَفَخَ فِيهِمَا، ثُمَّ مَسَحَ بِهِمَا وَجْهَهُ وَكَفَّيْهِ.',
      translation:
        'Ammar ibn Yasir (RA) said:\n\n"I became in a state of Janabah and could not find water, so I rolled on the ground. I later mentioned this to the Prophet ﷺ, and he said: \'It would have been sufficient for you to do this.\' Then he struck the earth once with both hands, blew off the dust, wiped his face, and then wiped his hands."',
      narrator: 'Ammar ibn Yasir (رضي الله عنه)',
      reference: 'Sahih al-Bukhari 338, Sahih Muslim 368',
    },
    explanation:
      'Step-by-Step Method of Tayammum\n\n1. 🤲 Make Niyyah (Intention): Make the intention in your heart to perform Tayammum for purification. There is no need to say it aloud.\n\n2. 🕌 Say "Bismillah": Before beginning, say: بِسْمِ اللَّهِ ("In the name of Allah.")\n\n3. 🌍 Strike Clean Earth Once: Lightly strike both palms on clean natural earth (dust, soil, sand, or natural stone with dust). (Sahih al-Bukhari 338)\n\n4. 🌬️ Remove Excess Dust: Lightly blow or shake off any excess dust from the hands. (Sahih al-Bukhari 338)\n\n5. 😊 Wipe the Face: Wipe the entire face once with both hands. (Sahih Muslim 368)\n\n6. ✋ Wipe Both Hands: Wipe both hands according to the Sunnah described in the Hadith. (Sahih al-Bukhari 338)\n\n📖 Qur\'anic Evidence: "If you do not find water, then perform Tayammum with clean earth and wipe your faces and your hands with it." (Surah Al-Ma\'idah 5:6)',
    keyPoints: [
      '1. Make Niyyah in the heart for Tayammum',
      '2. Say Bismillah',
      '3. Strike clean earth/soil/sand/stone once with both palms',
      '4. Gently blow or shake off excess dust',
      '5. Wipe face once with both hands',
      '6. Wipe hands according to the Sunnah (Sahih al-Bukhari 338)',
    ],
  },
  {
    id: 'wudu-tayammum-faqs',
    title: 'Dua After Wudu & Virtues',
    emoji: '🤲',
    tagLabel: 'Dua & Virtues',
    tagColor: 'text-[#2B604A]',
    tagBg: 'bg-soft-mint',
    summary:
      'Dua to recite after Wudu and the virtues promised by the Prophet ﷺ.',
    hadith: {
      arabic:
        'أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
      translation:
        'The Messenger of Allah ﷺ said:\n\n"Whoever performs Wudu properly and then says: \'I bear witness that there is no god but Allah alone, with no partner, and I bear witness that Muhammad is His servant and Messenger\', the eight gates of Paradise will be opened for him, and he may enter through whichever gate he wishes."',
      narrator: "'Umar ibn al-Khattab (رضي الله عنه)",
      reference: 'Sahih Muslim 234',
    },
    explanation:
      'Dua After Wudu & Virtues of Purification\n\n🤲 Dua After Wudu:\n\nArabic:\nأَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ\n\nEnglish Translation:\n"I bear witness that there is no god but Allah alone, with no partner, and I bear witness that Muhammad is His servant and Messenger."\n\n✨ Virtues:\nThe Prophet ﷺ said: "Whoever performs Wudu properly and then says this, the eight gates of Paradise will be opened for him, and he may enter through whichever gate he wishes." (Sahih Muslim 234)\n\n📌 Summary Rules:\n• Wudu remains valid until invalidated by certainty (sound, smell, toilet, deep sleep).\n• Tayammum replaces Wudu/Ghusl when water is absent or harmful.',
    keyPoints: [
      'Recite the Shahada Dua after completing Wudu',
      'Virtue: All 8 gates of Paradise open for the one who says it (Sahih Muslim 234)',
      'Wudu is required for Salah, Tawaf, and touching the Mushaf',
      'Tayammum provides a mercy and relief when water cannot be used',
    ],
  },
];
