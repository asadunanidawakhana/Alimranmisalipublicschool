/**
 * AL IMRAN TENSE LEARNER - Shop Items
 * Contains buyable avatars, power-ups, and themes
 */

export const shopItems = [
    // AVATARS
    { id: 'default', name: 'Learner', type: 'avatar', price: 0, icon: '👨‍🎓', description: 'Your starting avatar' },
    { id: 'cool_boy', name: 'Cool Boy', type: 'avatar', price: 50, icon: '😎', description: 'Style while you learn' },
    { id: 'scholar', name: 'Wise Scholar', type: 'avatar', price: 150, icon: '🧙‍♂️', description: 'Master of grammar' },
    { id: 'ninja', name: 'Tense Ninja', type: 'avatar', price: 300, icon: '🥷', description: 'Fast and accurate' },
    { id: 'superstar', name: 'Star Student', type: 'avatar', price: 500, icon: '🌟', description: 'The brightest learner' },
    { id: 'royalty', name: 'King of Tenses', type: 'avatar', price: 1000, icon: '👑', description: 'Absolute perfection' },

    // POWER-UPS
    { id: 'streak_freeze', name: 'Streak Freeze', type: 'powerup', price: 200, icon: '🧊', description: 'Protects your streak if you miss a day.' },
    { id: 'xp_boost', name: 'XP Booster', type: 'powerup', price: 350, icon: '⚡', description: 'Double XP for 30 minutes.' },
    { id: 'hint_token', name: 'Hint Token', type: 'powerup', price: 100, icon: '💡', description: 'Remove two wrong options in a game.' },
    { id: 'heart_refill', name: 'Heart Refill', type: 'powerup', price: 150, icon: '❤️', description: 'Instantly restore all 5 hearts.' },

    // THEMES
    { id: 'theme_dark', name: 'Dark Mode', type: 'theme', price: 800, icon: '🌙', description: 'Sleek dark interface.' },
    { id: 'theme_neon', name: 'Neon Nights', type: 'theme', price: 1200, icon: '🌈', description: 'Vibrant neon colors.' },
    { id: 'theme_royal', name: 'Royal Gold', type: 'theme', price: 2000, icon: '✨', description: 'Premium gold & black look.' }
];
