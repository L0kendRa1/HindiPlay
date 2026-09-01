export type ActivityCategoryKey = 'all' | 'letters' | 'words' | 'writing' | 'pictures' | 'matras';

export interface ActivityCategory {
  id: ActivityCategoryKey;
  label: string;
  emoji: string;
}

export const ACTIVITY_CATEGORIES: ActivityCategory[] = [
  { id: 'all', label: 'सभी', emoji: '🌟' },
  { id: 'letters', label: 'अक्षर', emoji: '🔤' },
  { id: 'words', label: 'शब्द', emoji: '🧩' },
  { id: 'matras', label: 'मात्राएँ', emoji: '🪷' },
  { id: 'writing', label: 'लिखना', emoji: '✏️' },
  { id: 'pictures', label: 'चित्र', emoji: '🖼️' },
];

export interface ActivityMeta {
  id: string;
  activityCode:
    | 'letter-quiz'
    | 'picture-match'
    | 'word-builder'
    | 'tracing'
    | 'picture-word-quiz'
    | 'matra-lab'
    | 'word-picture-quiz'
    | 'memory-match'
    | 'sentence-builder';
  title: string;
  subtitle: string;
  description: string;
  objective: string;
  categories: ActivityCategoryKey[];
  categoryDisplayLabel: string;
  icon: string;
  theme: {
    bg: string;
    border: string;
    badgeBg: string;
    badgeText: string;
    buttonGradient: string;
  };
  difficultyStars: number;
  tags: string[];
}

export const ACTIVITIES_REGISTRY: ActivityMeta[] = [
  {
    id: 'act_letter_quiz',
    activityCode: 'letter-quiz',
    title: 'अक्षर पहचानो',
    subtitle: 'आवाज़ सुनकर सही अक्षर चुनो',
    description: 'हिन्दी के स्वर और व्यंजन की आवाज़ सुनकर पहचानें और सही अक्षर चुनें।',
    objective: 'ध्वनि और अक्षर पहचान (Letter sound recognition for Swar & Vyanjan)',
    categories: ['letters'],
    categoryDisplayLabel: 'अक्षर पहचान',
    icon: '🔤',
    theme: {
      bg: 'bg-amber-50/70',
      border: 'border-toy-yellow',
      badgeBg: 'bg-toy-yellow',
      badgeText: 'text-slate-900',
      buttonGradient: 'from-toy-yellow to-toy-orange',
    },
    difficultyStars: 1,
    tags: ['अक्षर', 'स्वर', 'व्यंजन', 'ध्वनि', 'पहचान'],
  },
  {
    id: 'act_picture_match',
    activityCode: 'picture-match',
    title: 'अक्षर और चित्र मिलाओ',
    subtitle: 'अक्षर को सही चित्र से जोड़ो',
    description: 'दिए गए अक्षर को उसके संबंधित चित्र और शब्द (जैसे आ ➔ आम) से मिलाएँ।',
    objective: 'अक्षर से शब्द व चित्र संबंध (Letter to vocabulary association)',
    categories: ['letters', 'pictures'],
    categoryDisplayLabel: 'चित्र मिलान',
    icon: '🖼️',
    theme: {
      bg: 'bg-sky-50/70',
      border: 'border-toy-sky',
      badgeBg: 'bg-toy-sky',
      badgeText: 'text-white',
      buttonGradient: 'from-toy-sky to-toy-blue',
    },
    difficultyStars: 1,
    tags: ['अक्षर', 'चित्र', 'शब्दावली', 'मिलान'],
  },
  {
    id: 'act_word_builder',
    activityCode: 'word-builder',
    title: 'शब्द बनाओ और खोजो',
    subtitle: 'अक्षर जोड़कर नए शब्द बनाओ',
    description: 'अक्षर और मात्राओं की इकाइयों को सही क्रम में जोड़कर शब्द बनाएँ या नए शब्द खोजें।',
    objective: 'अक्षर संयोजन व शब्द निर्माण (Devanagari unit combination & word building)',
    categories: ['words', 'matras'],
    categoryDisplayLabel: 'शब्द निर्माण',
    icon: '🧩',
    theme: {
      bg: 'bg-purple-50/70',
      border: 'border-toy-purple',
      badgeBg: 'bg-toy-purple',
      badgeText: 'text-white',
      buttonGradient: 'from-toy-purple to-toy-pink',
    },
    difficultyStars: 2,
    tags: ['शब्द', 'मात्राएँ', 'निर्माण', 'खोज'],
  },
  {
    id: 'act_matra_lab',
    activityCode: 'matra-lab',
    title: 'मात्रा प्रयोगशाला',
    subtitle: 'अक्षर और मात्राएँ जोड़कर नए शब्दांश बनाओ',
    description: 'व्यंजन और मात्राओं को मिलाकर नए शब्दांश (जैसे म + ा ➔ मा) बनाएँ और उनका शुद्ध उच्चारण सुनें।',
    objective: 'मात्रा संयोजन व शब्दांश निर्माण (Devanagari matra exploration & syllable construction)',
    categories: ['letters', 'words', 'matras'],
    categoryDisplayLabel: 'मात्रा प्रयोग',
    icon: '🧪',
    theme: {
      bg: 'bg-teal-50/70',
      border: 'border-toy-mint',
      badgeBg: 'bg-toy-mint',
      badgeText: 'text-white',
      buttonGradient: 'from-toy-mint to-teal-600',
    },
    difficultyStars: 2,
    tags: ['मात्राएँ', 'अक्षर', 'संयोजन', 'शब्दांश', 'प्रयोगशाला'],
  },
  {
    id: 'act_tracing',
    activityCode: 'tracing',
    title: 'अक्षर लिखो',
    subtitle: 'स्ट्रोक देखकर अक्षर लिखने का अभ्यास',
    description: 'नीली गाइड रेखाओं और नंबरों (①, ②, ③) के साथ अक्षरों की सही बनावट का अभ्यास करें।',
    objective: 'हस्तलेखन व स्ट्रोक अभ्यास (Guided handwriting & stroke order tracing)',
    categories: ['letters', 'writing'],
    categoryDisplayLabel: 'लेखन अभ्यास',
    icon: '✏️',
    theme: {
      bg: 'bg-emerald-50/70',
      border: 'border-toy-mint',
      badgeBg: 'bg-toy-mint',
      badgeText: 'text-white',
      buttonGradient: 'from-toy-mint to-emerald-600',
    },
    difficultyStars: 2,
    tags: ['लिखना', 'स्ट्रोक', 'ट्रेसिंग', 'अक्षर'],
  },
  {
    id: 'act_picture_word_quiz',
    activityCode: 'picture-word-quiz',
    title: 'चित्र देखकर शब्द पहचानो',
    subtitle: 'चित्र देखकर सही हिन्दी शब्द चुनो',
    description: 'चित्र को पहचानें और 3 विकल्पों में से सही हिन्दी शब्द चुनें।',
    objective: 'चित्र से शब्द पठन (Visual object recognition to Hindi word reading)',
    categories: ['words', 'pictures'],
    categoryDisplayLabel: 'चित्र-शब्द पठन',
    icon: '🎨',
    theme: {
      bg: 'bg-orange-50/70',
      border: 'border-toy-orange',
      badgeBg: 'bg-toy-orange',
      badgeText: 'text-white',
      buttonGradient: 'from-amber-400 to-orange-500',
    },
    difficultyStars: 1,
    tags: ['चित्र', 'शब्द', 'पहचान', 'पठन'],
  },
  {
    id: 'act_word_picture_quiz',
    activityCode: 'word-picture-quiz',
    title: 'शब्द देखकर चित्र चुनो',
    subtitle: 'हिन्दी शब्द पढ़कर सही चित्र चुनो',
    description: 'हिन्दी शब्द पढ़कर 3 चित्रों में से सही चित्र चुनें और शब्द-अर्थ का संबंध समझें।',
    objective: 'शब्द से चित्र व अर्थ संबंध (Hindi word reading to visual meaning association)',
    categories: ['words', 'pictures'],
    categoryDisplayLabel: 'शब्द-चित्र पहचान',
    icon: '🥭',
    theme: {
      bg: 'bg-indigo-50/70',
      border: 'border-toy-purple',
      badgeBg: 'bg-toy-purple',
      badgeText: 'text-white',
      buttonGradient: 'from-toy-purple to-indigo-600',
    },
    difficultyStars: 2,
    tags: ['शब्द', 'चित्र', 'पठन', 'पहचान', 'अर्थ'],
  },
  {
    id: 'act_memory_match',
    activityCode: 'memory-match',
    title: 'याद करो और मिलाओ',
    subtitle: 'चित्र और शब्द के जोड़े याद करके मिलाओ',
    description: 'चित्र और हिन्दी शब्दों के कार्ड पलटें और सही जोड़े ढूँढें।',
    objective: 'शब्द और चित्र का सही जोड़ा पहचानना और याद रखना (Hindi word-to-picture memory & association)',
    categories: ['words', 'pictures'],
    categoryDisplayLabel: 'स्मृति खेल',
    icon: '🎴',
    theme: {
      bg: 'bg-rose-50/70',
      border: 'border-pink-400',
      badgeBg: 'bg-pink-500',
      badgeText: 'text-white',
      buttonGradient: 'from-pink-500 to-rose-600',
    },
    difficultyStars: 2,
    tags: ['स्मृति', 'जोड़े', 'शब्द', 'चित्र', 'कार्ड', 'याद'],
  },
  {
    id: 'act_sentence_builder',
    activityCode: 'sentence-builder',
    title: 'वाक्य बनाओ',
    subtitle: 'शब्दों को सही क्रम में लगाकर वाक्य बनाओ',
    description: 'शफ़ल किए गए शब्दों को सही क्रम में लगाकर सुंदर और सही हिन्दी वाक्य बनाएँ।',
    objective: 'वाक्य संरचना व शब्द क्रम (Hindi sentence structure & word order)',
    categories: ['words'],
    categoryDisplayLabel: 'वाक्य निर्माण',
    icon: '📜',
    theme: {
      bg: 'bg-teal-50/70',
      border: 'border-toy-mint',
      badgeBg: 'bg-toy-mint',
      badgeText: 'text-white',
      buttonGradient: 'from-toy-mint to-teal-600',
    },
    difficultyStars: 2,
    tags: ['वाक्य', 'शब्द', 'क्रम', 'निर्माण', 'भाषा'],
  },
];

/**
 * Filter activities by category and search query.
 */
export function filterActivities(
  category: ActivityCategoryKey = 'all',
  searchQuery: string = ''
): ActivityMeta[] {
  let filtered = ACTIVITIES_REGISTRY;

  if (category !== 'all') {
    filtered = filtered.filter((act) => act.categories.includes(category));
  }

  const query = searchQuery.trim().toLowerCase();
  if (query) {
    filtered = filtered.filter((act) => {
      const matchTitle = act.title.toLowerCase().includes(query);
      const matchSubtitle = act.subtitle.toLowerCase().includes(query);
      const matchDesc = act.description.toLowerCase().includes(query);
      const matchTags = act.tags.some((t) => t.toLowerCase().includes(query));
      return matchTitle || matchSubtitle || matchDesc || matchTags;
    });
  }

  return filtered;
}
