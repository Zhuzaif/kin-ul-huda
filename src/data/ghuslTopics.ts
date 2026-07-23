export type GhuslHadith = {
  arabic: string;
  translation: string;
  narrator: string;
  reference: string;
  additionalRef?: string;
};

export type GhuslTopic = {
  id: string;
  title: string;
  emoji: string;
  tagLabel: string;
  tagColor: string;
  tagBg: string;
  summary: string;
  hadith?: GhuslHadith;
  explanation: string;
  keyPoints?: string[];
};

export const ghuslTopics: GhuslTopic[] = [
  {
    id: 'ghusl-understanding',
    title: 'What Is Ghusl & Main Evidence',
    emoji: '💧',
    tagLabel: 'Foundation',
    tagColor: 'text-[#2B604A]',
    tagBg: 'bg-soft-mint',
    summary:
      'Ghusl (الغسل) is the full ritual purification of the body using clean water to restore Taharah (ritual purity).',
    hadith: {
      arabic:
        'عَنْ عَائِشَةَ رضي الله عنها:\n\nكَانَ رَسُولُ اللَّهِ ﷺ إِذَا اغْتَسَلَ مِنَ الْجَنَابَةِ، بَدَأَ فَغَسَلَ يَدَيْهِ، ثُمَّ تَوَضَّأَ لِلصَّلَاةِ، ثُمَّ يُدْخِلُ أَصَابِعَهُ فِي الْمَاءِ فَيُخَلِّلُ بِهَا أُصُولَ شَعْرِهِ، ثُمَّ يُفِيضُ عَلَى رَأْسِهِ ثَلَاثَ غُرَفٍ، ثُمَّ يُفِيضُ الْمَاءَ عَلَى سَائِرِ جَسَدِهِ.',
      translation:
        '\'Aishah رضي الله عنها reported:\n\n"Whenever the Messenger of Allah ﷺ performed Ghusl after Janabah, he first washed his hands, then performed Wudu as for prayer. He then ran his fingers through the roots of his hair, poured water over his head three times, and finally washed his entire body."',
      narrator: "'Aishah bint Abi Bakr (رضي الله عنها)",
      reference: 'Sahih al-Bukhari 248',
      additionalRef:
        'Also reported in: Sahih Muslim 316. Qur\'an: Surah Al-Ma\'idah (5:6) — "If you are in a state of major ritual impurity (Janabah), then purify yourselves."',
    },
    explanation:
      'Ghusl (الغسل) is the full ritual purification of the body using clean water. It is an act of worship that restores a Muslim to a state of ritual purity (Taharah), allowing them to perform acts of worship such as Salah and Tawaf.\n\n📖 Main Evidence from the Qur\'an:\n\nArabic: وَإِن كُنتُمْ جُنُبًا فَاطَّهَّرُوا\nEnglish Translation: "If you are in a state of major ritual impurity (Janabah), then purify yourselves." (Surah Al-Ma\'idah 5:6)\n\n📖 Main Hadith:\n\n\'Aishah رضي الله عنها reported: "Whenever the Messenger of Allah ﷺ performed Ghusl after Janabah, he first washed his hands, then performed Wudu as for prayer. He then ran his fingers through the roots of his hair, poured water over his head three times, and finally washed his entire body." (Sahih al-Bukhari 248, Sahih Muslim 316)',
    keyPoints: [
      'Ghusl (الغسل) is full ritual purification of the body using clean water',
      'Restores a Muslim to a state of ritual purity (Taharah)',
      'Main Qur\'anic Evidence: Surah Al-Ma\'idah (5:6)',
      'Main Hadith Evidence: Sahih al-Bukhari 248, Sahih Muslim 316',
    ],
  },
  {
    id: 'ghusl-importance-types',
    title: 'Importance & Types of Ghusl',
    emoji: '🌿',
    tagLabel: 'Fiqh Ruling',
    tagColor: 'text-[#D98A5B]',
    tagBg: 'bg-light-peach',
    summary:
      'When Ghusl is required (Janabah, Haiz, Nifas) and the distinction between Obligatory (Fard) and Recommended (Sunnah) Ghusl.',
    hadith: {
      arabic: 'وَإِن كُنتُمْ جُنُبًا فَاطَّهَّرُوا',
      translation:
        'Allah Almighty says:\n\n"If you are in a state of major ritual impurity (Janabah), then purify yourselves."',
      narrator: "Surah Al-Ma'idah (5:6)",
      reference: "Qur'an 5:6",
    },
    explanation:
      '🌿 Why Is Ghusl Important?\n\nGhusl is required to regain ritual purity before certain acts of worship.\n\nWithout Ghusl (when it is obligatory), a Muslim cannot perform acts such as:\n• Salah (Prayer)\n• Tawaf around the Ka\'bah\n• Other acts that require ritual purity\n\n📌 When Is Ghusl Obligatory?\n\nGhusl becomes obligatory in situations such as:\n1. After Janabah (major ritual impurity).\n2. After menstruation (Haiz) ends.\n3. After postnatal bleeding (Nifas) ends.\n\n📖 Types of Ghusl:\n\n1. Obligatory (Fard) Ghusl: Performed when Ghusl is required due to Islamic rulings (e.g., Janabah, Haiz, or Nifas).\n\n2. Recommended (Sunnah/Mustahabb) Ghusl: Performed on special occasions, such as:\n• Before Jumu\'ah (Friday Prayer).\n• Before Eid Prayer (according to many scholars).\n• Before entering Ihram for Hajj or Umrah.',
    keyPoints: [
      'Without obligatory Ghusl, acts like Salah and Tawaf cannot be performed',
      'Obligatory (Fard) Ghusl: After Janabah, Haiz, or Nifas',
      'Recommended (Sunnah) Ghusl: Before Jumu\'ah, Eid prayers, and Ihram',
    ],
  },
  {
    id: 'ghusl-step-by-step',
    title: 'Step-by-Step Method of Ghusl',
    emoji: '🪜',
    tagLabel: 'Sunnah Method',
    tagColor: 'text-[#2B604A]',
    tagBg: 'bg-soft-mint',
    summary:
      'The step-by-step Sunnah method of performing Ghusl according to authentic Hadiths.',
    hadith: {
      arabic:
        'عَنْ عَائِشَةَ رضي الله عنها:\n\nكَانَ رَسُولُ اللَّهِ ﷺ إِذَا اغْتَسَلَ مِنَ الْجَنَابَةِ، بَدَأَ فَغَسَلَ يَدَيْهِ، ثُمَّ تَوَضَّأَ لِلصَّلَاةِ، ثُمَّ يُدْخِلُ أَصَابِعَهُ فِي الْمَاءِ فَيُخَلِّلُ بِهَا أُصُولَ شَعْرِهِ، ثُمَّ يُفِيضُ عَلَى رَأْسِهِ ثَلَاثَ غُرَفٍ، ثُمَّ يُفِيضُ الْمَاءَ عَلَى سَائِرِ جَسَدِهِ.',
      translation:
        '\'Aishah رضي الله عنها said:\n\n"When the Messenger of Allah ﷺ performed Ghusl after Janabah, he washed his hands, performed Wudu as for prayer, ran his fingers through the roots of his hair, poured three handfuls of water over his head, and then poured water over the rest of his body."',
      narrator: "'Aishah bint Abi Bakr (رضي الله عنها)",
      reference: 'Sahih al-Bukhari 248',
      additionalRef: 'Sahih Muslim 316',
    },
    explanation:
      'Step-by-Step Method of Ghusl (According to the Sunnah)\n\n1. 🤲 Make the Intention (Niyyah): Make the intention in your heart to perform Ghusl for purification. There is no authentic hadith requiring the intention to be spoken aloud.\n\n2. 🕌 Say "Bismillah": Say "Bismillah" before starting Ghusl. This is recommended by many scholars.\n\n3. 🖐️ Wash Both Hands: Wash both hands three times before beginning. (Evidence: Sahih al-Bukhari 248)\n\n4. 🚿 Wash the Private Parts: Wash away any impurity from the private area before continuing. (Evidence: Sahih al-Bukhari 248)\n\n5. 💧 Perform Wudu: Perform Wudu just as you would for Salah. (Evidence: Sahih al-Bukhari 248; Sahih Muslim 316)\n\n6. 💇 Wash the Head & Hair: Run your fingers through the roots of the hair. Pour water over the head three times. (Evidence: Sahih al-Bukhari 248)\n\n7. 🚿 Wash the Entire Body: Wash the whole body, ensuring water reaches every part. (Evidence: Sahih al-Bukhari 248)\n\n8. 👣 Wash the Feet: If the feet were not washed during Wudu, wash them at the end of Ghusl. (Reference: Sahih al-Bukhari 257)',
    keyPoints: [
      '1. Make Intention (Niyyah) in the heart',
      '2. Say Bismillah before starting',
      '3. Wash both hands three times',
      '4. Wash away private area impurities',
      '5. Perform Wudu as for prayer',
      '6. Wash head & hair thoroughly',
      '7. Wash entire body ensuring no dry spots',
      '8. Wash feet at the end',
    ],
  },
  {
    id: 'ghusl-hair-body',
    title: 'Hair & Body Wash Rules',
    emoji: '💇',
    tagLabel: 'Rules & Guidelines',
    tagColor: 'text-[#2B604A]',
    tagBg: 'bg-soft-mint',
    summary:
      'Rules regarding braided hair, hair roots, and ensuring water reaches every area of the body.',
    hadith: {
      arabic:
        'عَنْ أُمِّ سَلَمَةَ رضي الله عنها قَالَتْ: قُلْتُ يَا رَسُولَ اللَّهِ إِنِّي امْرَأَةٌ أَشُدُّ ضَفْرَ رَأْسِي أَفَأَنْقُضُهُ لِغُسْلِ الْجَنَابَةِ؟ قَالَ: «لَا، إِنَّمَا يَكْفِيكِ أَنْ تَحْثِيَ عَلَى رَأْسِكِ ثَلَاثَ حَثَيَاتٍ ثُمَّ تُفِيضِينَ عَلَيْكِ الْمَاءَ فَتَطْهُرِينَ»',
      translation:
        'Umm Salamah رضي الله عنها reported: "I said: O Messenger of Allah, I am a woman who braids her hair tight. Should I unbind it for Ghusl after Janabah?" He ﷺ replied: "No, it is sufficient for you to pour three handfuls of water over your head, then pour water over your body, and you will become pure."',
      narrator: 'Umm Salamah (رضي الله عنها)',
      reference: 'Sahih Muslim 330',
    },
    explanation:
      'Hair & Body Wash Guidelines in Ghusl\n\n📖 Braided Hair Ruling:\nThe Prophet ﷺ said to Umm Salamah رضي الله عنها:\n"It is sufficient for you to pour three handfuls of water over your head, then pour water over your body, and you will become pure." (Sahih Muslim 330)\n\nAnswer: Braided hair does not have to be untied if water reaches the roots of the hair.\n\n🚿 Washing the Entire Body:\nWash the whole body, ensuring water reaches every part, including:\n• Underarms\n• Behind the ears\n• Inside the navel\n• Between fingers and toes\n• Skin folds\n\nNo part of the body should remain dry. (Evidence: Sahih al-Bukhari 248)',
    keyPoints: [
      'Braided hair does not need to be untied if water reaches roots (Sahih Muslim 330)',
      'Ensure water reaches scalp and hair roots',
      'Water must reach underarms, behind ears, navel, between fingers & toes, and skin folds',
      'No part of the body should remain dry during Ghusl',
    ],
  },
  {
    id: 'ghusl-common-mistakes',
    title: 'Common Mistakes During Ghusl',
    emoji: '⚠️',
    tagLabel: 'Important Warnings',
    tagColor: 'text-[#D98A5B]',
    tagBg: 'bg-light-peach',
    summary:
      'Key mistakes to avoid during Ghusl to ensure valid ritual purification.',
    hadith: {
      arabic: 'وَيْلٌ لِلْأَعْقَابِ مِنَ النَّارِ',
      translation: 'The Prophet ﷺ said:\n\n"Woe to the heels from the Fire."',
      narrator: "'Abdullah ibn Amr & Abu Hurairah (رضي الله عنهم)",
      reference: 'Sahih al-Bukhari 60, Sahih Muslim 241',
      additionalRef:
        'Although this Hadith refers to Wudu, scholars use it to emphasize that water must reach every required part of the body during purification, including Ghusl.',
    },
    explanation:
      'Common Mistakes During Ghusl\n\n1. Missing Parts of the Body: Some areas are commonly forgotten, such as behind the ears, underarms, inside the navel, between fingers and toes, and skin folds. Make sure water reaches every part of the body.\n\n2. Water Not Reaching the Hair Roots: Many people wash only the surface of the hair. Water should reach the roots of the hair and the scalp. (Sahih al-Bukhari 248; Sahih Muslim 316)\n\n3. Waterproof Barriers: Items that prevent water from reaching the body should be removed before Ghusl, such as nail polish, waterproof paint, thick glue or similar substances. Henna (Mehndi), if it leaves only a stain and not a waterproof layer, does not prevent water from reaching the skin.\n\n4. Forgetting the Intention (Niyyah): Ghusl is an act of worship. Make the intention in your heart before beginning.\n\n5. Rushing Through Ghusl: Do not rush so much that some body parts remain dry. Take enough time to wash the entire body properly.\n\n6. Assuming Soap or Shampoo Is Required: Soap and shampoo are not required for a valid Ghusl. The essential requirement is that clean water reaches the entire body.',
    keyPoints: [
      'Ensure water reaches hidden parts: ears, underarms, navel, skin folds, toes',
      'Make sure water reaches scalp & hair roots',
      'Remove waterproof barriers like nail polish (Henna stain is allowed)',
      'Always make Intention (Niyyah) in your heart',
      'Do not rush Ghusl',
      'Soap & shampoo are optional, clean water is mandatory',
    ],
  },
  {
    id: 'ghusl-faqs',
    title: 'Frequently Asked Questions (FAQs)',
    emoji: '❓',
    tagLabel: 'Practical FAQs',
    tagColor: 'text-[#2B604A]',
    tagBg: 'bg-soft-mint',
    summary:
      'Answers to common queries about shower Ghusl, Wudu, nail polish, multiple intentions, and daily Ghusl.',
    hadith: {
      arabic:
        'عَنْ عَائِشَةَ رضي الله عنها:\n\nكُنَّا نُؤْمَرُ بِقَضَاءِ الصَّوْمِ وَلَا نُؤْمَرُ بِقَضَاءِ الصَّلَاةِ',
      translation:
        '\'Aishah رضي الله عنها said:\n\n"We were commanded to make up the missed fasts, but we were not commanded to make up the missed prayers."',
      narrator: "'Aishah (رضي الله عنها)",
      reference: 'Sahih al-Bukhari 331, Sahih Muslim 335c',
    },
    explanation:
      'Frequently Asked Questions (FAQs) About Ghusl\n\n❓ 1. Is Soap or Shampoo Required?\nAnswer: No. Soap and shampoo are not required for a valid Ghusl. The requirement is that clean water reaches the entire body. (Sahih al-Bukhari 248; Sahih Muslim 316)\n\n❓ 2. Can Ghusl Be Performed Under a Shower?\nAnswer: Yes. A shower is sufficient as long as water reaches the entire body, the obligatory parts of Ghusl are fulfilled, and the intention (Niyyah) is made.\n\n❓ 3. Is Wudu Required After Ghusl?\nAnswer: If Ghusl is performed according to the Sunnah (including Wudu), there is no need to perform another Wudu before Salah unless Wudu is broken afterward. (Sahih al-Bukhari 248; Sahih Muslim 316)\n\n❓ 4. Does Braided Hair Need to Be Untied?\nAnswer: No, braided hair does not have to be untied if water reaches the roots of the hair. (Evidence: Sahih Muslim 330)\n\n❓ 5. Can One Ghusl Be Made for Multiple Reasons?\nAnswer: Yes. If a person intends purification for more than one reason (for example, Janabah and Jumu\'ah, or Haiz and Janabah), one Ghusl is sufficient according to the majority of scholars.\n\n❓ 6. What If I Forget to Wash One Body Part?\nAnswer: If you realize that a part of the body was left dry, wash that part as soon as you remember. If a significant obligatory part was missed, complete the Ghusl according to the ruling of your fiqh school.\n\n❓ 7. Is Ghusl Valid with Nail Polish?\nAnswer: No, if the nail polish forms a waterproof layer that prevents water from reaching the nail. It should be removed before performing Ghusl.\n\n❓ 8. Is Ghusl Required Every Day During Haiz or Nifas?\nAnswer: No. Ghusl is required after Haiz or Nifas ends, not every day during the bleeding. (Sahih al-Bukhari 331)',
    keyPoints: [
      'Shower Ghusl is valid if water reaches entire body with Niyyah',
      'No separate Wudu needed after Sunnah Ghusl unless invalidated',
      'One Ghusl can fulfill multiple intentions (e.g. Haiz & Jumu\'ah)',
      'Waterproof nail polish must be removed before Ghusl',
      'Ghusl is required only when Haiz/Nifas ends, not daily during bleeding',
    ],
  },
];
