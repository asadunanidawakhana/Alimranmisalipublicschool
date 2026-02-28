/**
 * AL IMRAN TENSE LEARNER - Data Store
 * Handles LocalStorage persistence and application state
 */

const STORAGE_KEY = 'al_imran_tense_learner_data';

// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getDatabase, ref, set, onValue, query, orderByChild, limitToLast } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCeEtKegRVHBD87StkUy8jrd9xO39sF5gY",
    authDomain: "alimran-85a51.firebaseapp.com",
    projectId: "alimran-85a51",
    storageBucket: "alimran-85a51.firebasestorage.app",
    messagingSenderId: "585230160066",
    appId: "1:585230160066:web:97cde84dfea445b28e2b5b",
    measurementId: "G-E85JBBD68P"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const socket = null; // Removed, kept for backwards compatibility in UI until removed

// Import Badges
import { badges } from './data/badges.js';

const getUUID = () => {
    try {
        return crypto.randomUUID();
    } catch (e) {
        return 'user-' + Math.random().toString(36).substring(2, 11);
    }
};

const INITIAL_DATA = {
    user: {
        id: getUUID(),
        name: '',
        grade: '',
        level: 1,
        xp: 0,
        streak: 0,
        lastActive: null,
        lastLoginDate: null,
        lastRewardClaimed: null,
        badges: [],
        coins: 100, // Start with some coins
        hearts: 5,
        lastHeartRegen: Date.now(),
        lastTestTime: 0,
        selectedAvatar: 'default',
        purchasedItems: ['default']
    },
    leaderboard: [
        { name: 'Ahmad', level: 12, xp: 1250, isBot: true },
        { name: 'Sara', level: 10, xp: 980, isBot: true },
        { name: 'Zeeshan', level: 8, xp: 750, isBot: true },
        { name: 'Fatima', level: 5, xp: 420, isBot: true }
    ],
    progress: {
        tenses: {
            simplePresent: 0,
            presentContinuous: 0,
            presentPerfect: 0,
            presentPerfectContinuous: 0,
            simplePast: 0,
            pastContinuous: 0,
            pastPerfect: 0,
            pastPerfectContinuous: 0,
            simpleFuture: 0,
            futureContinuous: 0,
            futurePerfect: 0,
            futurePerfectContinuous: 0
        },
        activePassive: {
            simplePresent: 0,
            presentContinuous: 0,
            presentPerfect: 0,
            simplePast: 0,
            pastContinuous: 0,
            pastPerfect: 0,
            simpleFuture: 0,
            futurePerfect: 0
        },
        modules: {
            vocabulary: 0,
            formation: 0,
            phrases: 0
        }
    },
    history: {
        tests: [],
        practice: []
    },
    settings: {
        darkMode: false,
        soundEnabled: true,
        urduInterface: true
    }
};

class Store {
    constructor() {
        this.data = this.load();
        this.setupSocketListeners();
    }

    setupSocketListeners() {
        // Renamed concept, now sets up Firebase listeners
        const topUsersRef = query(ref(db, 'users'), orderByChild('xp'), limitToLast(50));
        onValue(topUsersRef, (snapshot) => {
            if (snapshot.exists()) {
                const users = [];
                snapshot.forEach((childSnapshot) => {
                    users.push(childSnapshot.val());
                });
                // Snapshot ordered by xp ascending, we want descending
                this.data.leaderboard = users.reverse();
                window.dispatchEvent(new CustomEvent('leaderboard-updated'));
            } else {
                this.data.leaderboard = [];
                window.dispatchEvent(new CustomEvent('leaderboard-updated'));
            }
        });
    }

    syncWithBackend() {
        if (this.data.user.id && this.data.user.name) {
            set(ref(db, 'users/' + this.data.user.id), {
                id: this.data.user.id,
                name: this.data.user.name,
                level: this.data.user.level,
                xp: this.data.user.xp,
                selectedAvatar: this.data.user.selectedAvatar,
                lastActive: Date.now()
            }).catch(error => console.error("Firebase sync error:", error));
        }
    }

    load() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return INITIAL_DATA;

        try {
            const parsed = JSON.parse(saved);
            // Deep merge user and progress to handle schema updates
            return {
                ...INITIAL_DATA,
                ...parsed,
                user: { ...INITIAL_DATA.user, ...parsed.user },
                leaderboard: parsed.leaderboard || INITIAL_DATA.leaderboard,
                progress: {
                    tenses: { ...INITIAL_DATA.progress.tenses, ...(parsed.progress?.tenses || {}) },
                    activePassive: { ...INITIAL_DATA.progress.activePassive, ...(parsed.progress?.activePassive || {}) },
                    modules: { ...INITIAL_DATA.progress.modules, ...(parsed.progress?.modules || {}) }
                }
            };
        } catch (e) {
            console.error('Failed to parse saved data', e);
            return INITIAL_DATA;
        }
    }

    save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    }

    updateUser(updates) {
        this.data.user = { ...this.data.user, ...updates };
        this.save();
        this.syncWithBackend(); // Sync name/avatar changes
    }

    checkDailyStreak() {
        const todayStr = new Date().toDateString(); // e.g., "Mon Sep 09 2024"
        const lastLoginStr = this.data.user.lastLoginDate;

        if (lastLoginStr !== todayStr) {
            if (lastLoginStr) {
                // Check if last login was yesterday
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);

                if (lastLoginStr === yesterday.toDateString()) {
                    // Valid streak
                    this.data.user.streak += 1;
                } else {
                    // Streak broken
                    this.data.user.streak = 1;
                }
            } else {
                // First login
                this.data.user.streak = 1;
            }

            this.data.user.lastLoginDate = todayStr;
            this.save();
            this.checkAndAwardBadges(); // Check streak-based badges
            return true; // Indicates it's a new day (eligible for reward popup)
        }
        return false; // Already logged in today
    }

    claimDailyReward() {
        const todayStr = new Date().toDateString();
        if (this.data.user.lastRewardClaimed !== todayStr) {
            this.data.user.lastRewardClaimed = todayStr;
            const rewardCoins = 10 + (this.data.user.streak * 5); // 15, 20, 25...
            this.addCoins(rewardCoins);
            this.save();
            return rewardCoins;
        }
        return 0;
    }

    addXP(amount) {
        this.data.user.xp += amount;

        // Also award coins (1 coin per 10 XP)
        const coinAward = Math.floor(amount / 5);
        if (coinAward > 0) this.addCoins(coinAward);

        // Simple level logic: 100 XP per level for first 10 levels
        const nextLevelXP = this.data.user.level * 100;
        if (this.data.user.xp >= nextLevelXP) {
            this.data.user.level += 1;
            // Emit level up event
            window.dispatchEvent(new CustomEvent('level-up', { detail: { level: this.data.user.level } }));
        }

        this.checkAndAwardBadges(); // Check XP-based badges
        this.save();

        // Broadcast stat changes immediately
        if (socket) {
            socket.emit('update_stats', {
                id: this.data.user.id,
                level: this.data.user.level,
                xp: this.data.user.xp
            });
        }
    }

    addCoins(amount) {
        this.data.user.coins += amount;
        this.checkAndAwardBadges(); // Check Coin-based badges
        this.save();
        window.dispatchEvent(new CustomEvent('coins-updated', { detail: { coins: this.data.user.coins } }));
    }

    deductCoins(amount) {
        if (this.data.user.coins >= amount) {
            this.data.user.coins -= amount;
            this.save();
            return true;
        }
        return false;
    }

    updateProgress(type, id, value) {
        if (this.data.progress[type] && this.data.progress[type][id] !== undefined) {
            this.data.progress[type][id] = Math.max(this.data.progress[type][id], value);
            this.save();
        }
    }

    addTestResult(result) {
        this.data.history.tests.push({
            ...result,
            timestamp: Date.now()
        });
        this.save();
    }

    checkAndAwardBadges() {
        if (!this.data.user.badges) this.data.user.badges = [];

        let newBadgeUnlocked = false;

        badges.forEach(badge => {
            if (!this.data.user.badges.includes(badge.id)) {
                let meetsRequirement = false;

                if (badge.requirementType === 'xp' && this.data.user.xp >= badge.requirementValue) {
                    meetsRequirement = true;
                } else if (badge.requirementType === 'streak' && this.data.user.streak >= badge.requirementValue) {
                    meetsRequirement = true;
                } else if (badge.requirementType === 'coins' && this.data.user.coins >= badge.requirementValue) {
                    meetsRequirement = true;
                }

                if (meetsRequirement) {
                    this.data.user.badges.push(badge.id);
                    newBadgeUnlocked = true;
                    // Dispatch an event so the app can show a toast/notification
                    window.dispatchEvent(new CustomEvent('badge-unlocked', { detail: badge }));
                }
            }
        });

        if (newBadgeUnlocked) {
            this.save();
        }
    }
}

export const store = new Store();
