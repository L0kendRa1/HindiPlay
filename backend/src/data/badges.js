/**
 * Centralized Gamification Badge Definitions for HindiPlay
 */

const BADGE_DEFINITIONS = [
  {
    id: 'first-step',
    name: 'पहला कदम',
    description: 'पहली गतिविधि पूरी की',
    icon: '🌱',
    evaluate: (ctx) => ctx.completedCount >= 1,
  },
  {
    id: 'hindi-starter',
    name: 'हिंदी शुरुआत',
    description: '50 XP अर्जित किए',
    icon: '⭐',
    evaluate: (ctx) => ctx.totalXp >= 50,
  },
  {
    id: 'hindi-learner',
    name: 'हिंदी सीखने वाला',
    description: '100 XP अर्जित किए',
    icon: '🏆',
    evaluate: (ctx) => ctx.totalXp >= 100,
  },
  {
    id: 'practice-master',
    name: 'अभ्यास मास्टर',
    description: '10 गतिविधियाँ पूरी कीं',
    icon: '🎖️',
    evaluate: (ctx) => ctx.completedCount >= 10,
  },
  {
    id: 'star-collector',
    name: 'स्टार कलेक्टर',
    description: '25 सितारे अर्जित किए',
    icon: '🌟',
    evaluate: (ctx) => ctx.totalStars >= 25,
  },
  {
    id: 'three-day-streak',
    name: '3 दिन की लय',
    description: 'लगातार 3 दिन पढ़ाई की',
    icon: '🔥',
    evaluate: (ctx) => ctx.currentStreak >= 3 || ctx.longestStreak >= 3,
  },
  {
    id: 'seven-day-streak',
    name: '7 दिन की लय',
    description: 'लगातार 7 दिन पढ़ाई की',
    icon: '⚡',
    evaluate: (ctx) => ctx.currentStreak >= 7 || ctx.longestStreak >= 7,
  },
  {
    id: 'perfect-score',
    name: 'सही जवाब',
    description: 'गतिविधि में 100% अंक प्राप्त किए',
    icon: '🎯',
    evaluate: (ctx) => ctx.currentAccuracy >= 100 && ctx.isCompleted,
  },
];

module.exports = BADGE_DEFINITIONS;
