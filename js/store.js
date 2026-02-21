/**
 * AL IMRAN TENSE LEARNER - Data Store
 * Handles LocalStorage persistence and application state
 */

const STORAGE_KEY = 'al_imran_tense_learner_data';

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
        badges: [],
        coins: 0,
        hearts: 5,
        lastHeartRegen: Date.now()
    },
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
    }

    load() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return INITIAL_DATA;

        try {
            const parsed = JSON.parse(saved);
            // Merge with default to handle schema updates
            return { ...INITIAL_DATA, ...parsed, user: { ...INITIAL_DATA.user, ...parsed.user } };
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
    }

    addXP(amount) {
        this.data.user.xp += amount;
        // Simple level logic: 100 XP per level for first 10 levels
        const nextLevelXP = this.data.user.level * 100;
        if (this.data.user.xp >= nextLevelXP) {
            this.data.user.level += 1;
            // Emit level up event
            window.dispatchEvent(new CustomEvent('level-up', { detail: { level: this.data.user.level } }));
        }
        this.save();
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
}

export const store = new Store();
