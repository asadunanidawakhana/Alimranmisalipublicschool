/**
 * AL IMRAN TENSE LEARNER - App Router
 * Orchestrates component rendering and navigation
 */

import { store, db } from './js/store.js';
import { ref, get, set, update, remove, onValue, off, onDisconnect } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";
import { tenses } from './js/data/tenses.js';
import { questions } from './js/data/questions.js';
import { badges } from './js/data/badges.js';
import { activePassive } from './js/data/active_passive.js';
import { apQuestions } from './js/data/ap_questions.js';
import { shopItems } from './js/data/shop_items.js';
import { directIndirect } from './js/data/direct_indirect.js';
import { diQuestions } from './js/data/di_questions.js';

class App {
    constructor() {
        this.container = document.getElementById('app');
        this.currentView = null;
        this.gameState = {
            isTest: false,
            mode: 'tenses', // 'tenses', 'activePassive', or 'directIndirect'
            tenseId: null,
            questions: [],
            currentIndex: 0,
            score: 0,
            lives: 5,
            xpEarned: 0,
            scrambledWords: [],
            userWords: [],
            matchingData: {
                selectedLeft: null,
                selectedRight: null,
                matchedPairs: []
            }
        };
        this.init();

        // Global error handler to prevent mysterious blank pages
        window.onerror = (msg, url, line, col, error) => {
            console.error("Global Error:", error || msg);
            if (this.container) {
                this.container.innerHTML = `
                    <div class="p-10 text-center flex flex-col items-center justify-center min-h-screen">
                        <div class="text-5xl mb-4">⚠️</div>
                        <h2 class="text-xl font-bold text-error mb-2">Something went wrong</h2>
                        <p class="text-gray-500 mb-6 text-sm">ایپ میں کوئی خرابی آگئی ہے</p>
                        <p class="text-[10px] text-gray-400 mb-6 overflow-hidden max-w-xs">${msg}</p>
                        <button onclick="location.reload()" class="bg-primary text-white font-bold px-8 py-3 rounded-2xl shadow-lg active:scale-95 transition">
                            Reload App / دوبارہ لوڈ کریں
                        </button>
                    </div>
                `;
            }
            return false;
        };
    }

    async init() {
        // Show Splash Screen first
        await this.showSplash();

        // Check if user has completed onboarding
        if (!store.data.user.name) {
            this.navigate('onboarding');
        } else {
            // Push local user data to the new backend to ensure they are tracked
            store.syncWithBackend();

            // Check Daily Streak
            if (store.checkDailyStreak()) {
                // Wait a moment for app to render, then show reward
                setTimeout(() => this.showDailyReward(), 1500);
            }

            // Listen for badge unlock events globally
            window.addEventListener('badge-unlocked', (e) => {
                const badge = e.detail;
                // Wait slightly to not overlap with other alerts
                setTimeout(() => this.showBadgeUnlock(badge), 500);
            });

            // Handle hash on refresh
            const hash = window.location.hash.substring(1);
            if (hash && hash !== 'home' && hash !== 'onboarding' && hash !== 'game' && hash !== 'test') {
                this.renderView(hash, {});
            } else {
                this.navigate('home');
            }
        }

        // Listen for back button
        window.onpopstate = (event) => {
            if (event.state && event.state.view) {
                this.renderView(event.state.view, event.state.params, false);
            }
        };
    }

    async showSplash() {
        this.container.innerHTML = `
            <div id="splash" class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-primary to-accent text-white p-6">
                <div class="animate-pulse-soft mb-8">
                    <div class="w-32 h-32 bg-white rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden">
                        <span class="text-primary font-bold text-4xl">AI</span>
                    </div>
                </div>
                <h1 class="text-3xl font-bold font-poppins mb-2 animate-slide-up">AL IMRAN</h1>
                <p class="text-xl font-medium mb-1 animate-slide-up" style="animation-delay: 0.1s">TENSE LEARNER</p>
                <p class="text-sm opacity-80 mb-12 animate-slide-up" style="animation-delay: 0.2s">انگریزی گرامر آسان بنائیں</p>
                
                <div class="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
                    <div id="splash-progress" class="h-full bg-white w-0 transition-all duration-1000 ease-out"></div>
                </div>
                
                <p class="absolute bottom-10 text-xs opacity-60">Powered by AL IMRAN</p>
            </div>
        `;

        const progress = document.getElementById('splash-progress');
        setTimeout(() => progress.style.width = '100%', 100);

        return new Promise(resolve => {
            setTimeout(() => {
                const splash = document.getElementById('splash');
                splash.classList.add('opacity-0', 'transition-opacity', 'duration-500');
                setTimeout(() => {
                    splash.remove();
                    resolve();
                }, 500);
            }, 3000);
        });
    }

    showDailyReward() {
        const coinsEarned = store.claimDailyReward();
        if (coinsEarned === 0) return; // Already claimed

        const overlay = document.createElement('div');
        overlay.id = 'daily-reward-modal';
        overlay.className = 'fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in';

        let flameIcons = '';
        for (let i = 0; i < Math.min(store.data.user.streak, 5); i++) flameIcons += '🔥';

        overlay.innerHTML = `
            <div class="w-full max-w-sm bg-white rounded-[40px] overflow-hidden shadow-2xl animate-bounce-in relative text-center">
                <!-- Header with pattern -->
                <div class="p-8 pb-12 relative overflow-hidden text-white" style="background: linear-gradient(135deg, #fb923c, #ef4444);">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16 animate-pulse-soft"></div>
                    
                    <div class="relative z-10">
                        <div class="text-7xl mb-4 animate-float drop-shadow-lg">🔥</div>
                        <h3 class="text-3xl font-black mb-1">Day ${store.data.user.streak}</h3>
                        <p class="font-medium opacity-90 uppercase tracking-widest text-xs">Login Streak</p>
                    </div>
                </div>

                <!-- Content -->
                <div class="px-6 py-8 relative bg-white -mt-6 rounded-t-3xl">
                    <h4 class="text-xl font-bold text-gray-800 mb-2">Daily Bonus Unlocked!</h4>
                    <p class="text-gray-500 text-sm mb-6">You logged in for <span class="font-bold text-orange-500">${store.data.user.streak} consecutive days!</span></p>
                    
                    <div class="bg-green-50 border-2 border-green-100 rounded-2xl p-4 mb-8 flex items-center justify-center space-x-3 transform transition hover:scale-105">
                        <span class="text-4xl text-green-500">💰</span>
                        <div class="text-left">
                            <p class="text-xs font-bold text-green-600 uppercase tracking-wider">Reward</p>
                            <p class="text-2xl font-black text-green-700">+${coinsEarned} Coins</p>
                        </div>
                    </div>
                    
                    <button onclick="document.getElementById('daily-reward-modal').remove(); app.renderView(app.currentView, {})" 
                        class="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl shadow-[0_8px_0_0_rgb(194,65,12)] hover:shadow-[0_4px_0_0_rgb(194,65,12)] hover:translate-y-1 transition-all active:translate-y-2 active:shadow-none text-lg">
                        Claim Reward / وصول کریں
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    showBadgeUnlock(badge) {
        const overlay = document.createElement('div');
        overlay.id = `badge-${badge.id}`;
        overlay.className = 'fixed top-4 left-4 right-4 z-[300] bg-white rounded-2xl p-4 shadow-2xl border-2 border-primary/20 flex items-center space-x-4 animate-slide-up transform transition-all cursor-pointer';

        overlay.innerHTML = `
            <div class="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-3xl shrink-0 animate-bounce-in shadow-inner">
                ${badge.icon}
            </div>
            <div class="flex-1">
                <p class="text-[10px] text-primary font-bold uppercase tracking-wider mb-0.5 animate-pulse">New Title Unlocked!</p>
                <h4 class="font-black text-gray-800 leading-tight">${badge.name}</h4>
                <p class="text-xs text-gray-500 mt-0.5 line-clamp-1">${badge.description}</p>
            </div>
            <button class="text-gray-400 p-2 hover:bg-gray-100 rounded-full transition active:scale-95">✕</button>
        `;

        document.body.appendChild(overlay);

        // Auto dismiss after 4 seconds
        const timeoutId = setTimeout(() => {
            if (document.getElementById(overlay.id)) {
                overlay.classList.add('opacity-0', '-translate-y-4');
                setTimeout(() => overlay.remove(), 300);
            }
        }, 4000);

        // Dismiss on click
        overlay.onclick = () => {
            clearTimeout(timeoutId);
            overlay.classList.add('opacity-0', '-translate-y-4');
            setTimeout(() => overlay.remove(), 300);
        };
    }

    navigate(view, params = {}) {
        window.history.pushState({ view, params }, '', `#${view}`);
        this.renderView(view, params);
    }

    async renderView(view, params, storeInHistory = true) {
        try {
            this.currentView = view;
            this.container.innerHTML = '';

            // Close any existing overlays first
            const existingOverlays = document.querySelectorAll('.fixed.z-50');
            existingOverlays.forEach(o => o.remove());

            // Listen for real-time leaderboard updates
            window.addEventListener('leaderboard-updated', () => {
                if (this.currentView === 'leaderboard') {
                    // Re-render the leaderboard dynamically if they are on that page
                    this.renderLeaderboard();
                }
            });

            switch (view) {
                case 'onboarding':
                    await this.renderOnboarding();
                    break;
                case 'home':
                    await this.renderHome();
                    break;
                case 'learn':
                    await this.renderLearnSelection();
                    break;
                case 'learn-tenses':
                    await this.renderLearn('tenses');
                    break;
                case 'learn-ap':
                    await this.renderLearn('activePassive');
                    break;
                case 'tense-detail':
                    await this.renderTenseDetail(params.id);
                    break;
                case 'ap-detail':
                    await this.renderActivePassiveDetail(params.id);
                    break;
                case 'learn-di':
                    await this.renderLearn('directIndirect');
                    break;
                case 'di-detail':
                    await this.renderDirectIndirectDetail(params.id);
                    break;
                case 'game':
                    await this.showDifficultySelection(params.id, params.mode || 'tenses');
                    break;
                case 'test':
                    await this.renderTestSelection();
                    break;
                case 'shop':
                    await this.renderShop();
                    break;
                case 'leaderboard':
                    await this.renderLeaderboard();
                    break;
                case 'profile':
                    await this.renderProfile();
                    break;
                case 'battle':
                    this.renderBattleQuestion();
                    break;
                default:
                    this.container.innerHTML = `<div class="p-10 text-center">View "${view}" coming soon!</div>`;
            }
        } catch (error) {
            console.error(`Error rendering view: ${view}`, error);
            this.container.innerHTML = `
                <div class="p-10 text-center">
                    <p class="text-error font-bold">Something went wrong / کچھ غلط ہو گیا</p>
                    <button onclick="app.navigate('home')" class="mt-4 bg-primary text-white px-6 py-2 rounded-xl">Go Home / ہوم پر جائیں</button>
                </div>
            `;
        }
    }

    async renderOnboarding() {
        this.container.innerHTML = `
            <div class="p-6 flex flex-col min-h-screen bg-soft-gray animate-fade-in">
                <div class="flex-1 flex flex-col items-center justify-center text-center">
                    <div class="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center text-white text-3xl font-bold mb-6">1</div>
                    <h2 class="text-2xl font-bold font-poppins mb-4">Welcome to Al Imran Tense Learner!</h2>
                    <p class="text-gray-600 mb-8">What is your name? <br> <span class="text-sm opacity-70">آپ کا نام کیا ہے؟</span></p>
                    <input type="text" id="user-name" class="w-full p-4 rounded-xl border-2 border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 text-center text-xl font-medium" placeholder="Enter name...">
                </div>
                <button id="next-onboarding" class="w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95">
                    Continue / آگے بڑھیں
                </button>
            </div>
        `;

        document.getElementById('next-onboarding').onclick = () => {
            const name = document.getElementById('user-name').value.trim();
            if (name) {
                // Check if socket is available for online check
                if (typeof socket !== 'undefined' && socket && socket.connected) {
                    // Change button state to show loading
                    const btn = document.getElementById('next-onboarding');
                    const originalText = btn.innerHTML;
                    btn.innerHTML = `<span class="animate-pulse">Checking...</span>`;
                    btn.disabled = true;

                    socket.emit('check_username', { name, id: store.data.user.id }, (response) => {
                        btn.innerHTML = originalText;
                        btn.disabled = false;

                        if (response.isUnique) {
                            store.updateUser({ name });
                            this.navigate('home');
                        } else {
                            // Keep current name in input but show alert and suggestion
                            alert('⚠️ ' + response.message);

                            // Optionally add a random number to suggest a new name automatically
                            const suggestNum = Math.floor(Math.random() * 99) + 1;
                            document.getElementById('user-name').value = `${name} ${suggestNum}`;
                        }
                    });
                } else {
                    // Offline fallback or not connected yet
                    store.updateUser({ name });
                    this.navigate('home');
                }
            } else {
                alert('Please enter your name');
            }
        };
    }

    async renderHome() {
        const userAvatar = shopItems.find(i => i.id === store.data.user.selectedAvatar) || shopItems[0];

        this.container.innerHTML = `
            <div class="flex flex-col min-h-screen bg-soft-gray animate-fade-in pb-24">
                <!-- Header -->
                <div class="bg-white p-4 flex items-center justify-between shadow-sm sticky top-0 z-10 transition-all">
                    <div class="flex items-center space-x-3">
                        <div class="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-3xl font-bold animate-float shadow-inner">
                            ${userAvatar.icon}
                        </div>
                        <div>
                            <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Learner</p>
                            <p class="font-bold text-gray-800">${store.data.user.name || 'Student'}</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-3">
                        <!-- Coins Badge -->
                        <div onclick="app.navigate('shop')" class="flex items-center space-x-1 bg-green-50 px-3 py-1.5 rounded-full border border-green-100 active:scale-95 transition cursor-pointer">
                            <span class="text-xs">💰</span>
                            <span class="font-bold text-green-600 text-sm">${store.data.user.coins}</span>
                        </div>
                        <div class="flex items-center space-x-1 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
                            <span class="text-xs">🔥</span>
                            <span class="font-bold text-orange-600 text-sm">${store.data.user.streak}</span>
                        </div>
                    </div>
                </div>

                <!-- Main Content -->
                <div class="p-4 space-y-6 overflow-y-auto">
                    <!-- Progress Card -->
                    <div class="bg-gradient-to-r from-primary to-blue-700 p-6 rounded-3xl text-white shadow-lg">
                        <h3 class="font-bold text-lg mb-1">Continue Learning</h3>
                        <p class="text-white/80 text-sm mb-4">Simple Present Tense</p>
                        <div class="w-full bg-white/20 h-2 rounded-full overflow-hidden mb-4">
                            <div class="bg-white h-full" style="width: ${store.data.progress.tenses.simplePresent}%"></div>
                        </div>
                        <button onclick="app.navigate('tense-detail', {id: 'simplePresent'})" class="bg-white text-primary font-bold px-6 py-2 rounded-full text-sm hover:bg-soft-gray transition shadow-md">
                            Resume
                        </button>
                    </div>

                    <!-- 1v1 Battle Card -->
                    <div class="p-6 rounded-3xl text-white shadow-lg flex items-center justify-between cursor-pointer active:scale-95 transition hover:shadow-xl" style="background: linear-gradient(135deg, #ef4444, #f97316);" onclick="app.renderMatchmaking()">
                        <div>
                            <span class="bg-white/20 text-xs font-bold px-2 py-1 rounded-md mb-2 inline-block">NEW!</span>
                            <h3 class="font-bold text-xl mb-1 drop-shadow-md">1v1 Battle</h3>
                            <p class="text-white text-xs font-bold drop-shadow">Compete globally in real-time!</p>
                        </div>
                        <div class="text-5xl drop-shadow-lg">⚔️</div>
                    </div>

                    <!-- Daily Challenge -->
                    <div class="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="font-bold">Today's Challenge</h3>
                            <span class="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-lg">🎯 75 XP</span>
                        </div>
                        <p class="text-gray-600 text-sm mb-4">Complete 3 correct answers in a row in any practice game.</p>
                        <button class="w-full py-3 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary/5 transition">
                            Accept Challenge
                        </button>
                    </div>

                    <!-- Learn Grid -->
                    <div>
                        <div class="flex items-center justify-between mb-4 px-2">
                            <h3 class="font-bold text-lg">Master Tenses</h3>
                            <button class="text-primary text-sm font-bold" onclick="app.navigate('learn-tenses')">See all</button>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center cursor-pointer active:scale-95 transition" onclick="app.navigate('tense-detail', {id: 'simplePast'})">
                                <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 text-xl font-bold mb-3">P</div>
                                <p class="font-bold text-sm">Past</p>
                                <p class="text-[10px] text-gray-500">${store.data.progress.tenses.simplePast}% Complete</p>
                            </div>
                            <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center cursor-pointer active:scale-95 transition" onclick="app.navigate('tense-detail', {id: 'simplePresent'})">
                                <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 text-xl font-bold mb-3">P</div>
                                <p class="font-bold text-sm">Present</p>
                                <p class="text-[10px] text-gray-500">${store.data.progress.tenses.simplePresent}% Complete</p>
                            </div>
                            <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center cursor-pointer active:scale-95 transition" onclick="app.navigate('tense-detail', {id: 'simpleFuture'})">
                                <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 text-xl font-bold mb-3">F</div>
                                <p class="font-bold text-sm">Future</p>
                                <p class="text-[10px] text-gray-500">${store.data.progress.tenses.simpleFuture}% Complete</p>
                            </div>
                            <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center cursor-pointer active:scale-95 transition" onclick="app.navigate('learn-di')">
                                <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 text-xl font-bold mb-3">🗣️</div>
                                <p class="font-bold text-sm">Narration</p>
                                <p class="text-[10px] text-gray-500">New Topic</p>
                            </div>
                        </div>
                    </div>
                </div>

                ${this.getBottomNav()}
            </div>
        `;
    }

    async renderLearnSelection() {
        this.container.innerHTML = `
            <div class="flex flex-col min-h-screen bg-soft-gray animate-fade-in pb-24">
                <div class="bg-white p-4 flex items-center space-x-4 shadow-sm sticky top-0 z-10">
                    <button onclick="app.navigate('home')" class="p-2 -ml-2 text-xl">←</button>
                    <h2 class="text-xl font-bold">What do you want to learn?</h2>
                </div>
                
                <div class="p-6 space-y-6">
                    <div class="bg-white p-8 rounded-[40px] shadow-sm border-2 border-primary/5 flex flex-col items-center text-center cursor-pointer active:scale-95 transition-all hover:bg-primary/5 group" onclick="app.navigate('learn-tenses')">
                        <div class="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary text-5xl mb-6 group-hover:scale-110 transition-transform">📚</div>
                        <h3 class="text-2xl font-bold text-gray-800 mb-2">Tenses</h3>
                        <p class="text-gray-500 font-urdu">ٹینسز سیکھیں</p>
                        <p class="mt-4 text-xs font-bold text-primary px-4 py-2 bg-primary/5 rounded-full">12 Lessons</p>
                    </div>

                    <div class="bg-white p-8 rounded-[40px] shadow-sm border-2 border-secondary/5 flex flex-col items-center text-center cursor-pointer active:scale-95 transition-all hover:bg-secondary/5 group" onclick="app.navigate('learn-ap')">
                        <div class="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center text-secondary text-5xl mb-6 group-hover:scale-110 transition-transform">🔄</div>
                        <h3 class="text-2xl font-bold text-gray-800 mb-2">Active / Passive Voice</h3>
                        <p class="text-gray-500 font-urdu">ایکٹو پیسو وائس</p>
                        <p class="mt-4 text-xs font-bold text-secondary px-4 py-2 bg-secondary/5 rounded-full">8 Lessons</p>
                    </div>

                    <div class="bg-white p-8 rounded-[40px] shadow-sm border-2 border-primary/5 flex flex-col items-center text-center cursor-pointer active:scale-95 transition-all hover:bg-primary/5 group" onclick="app.navigate('learn-di')">
                        <div class="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary text-5xl mb-6 group-hover:scale-110 transition-transform">🗣️</div>
                        <h3 class="text-2xl font-bold text-gray-800 mb-2">Direct / Indirect</h3>
                        <p class="text-gray-500 font-urdu">ڈائریکٹ ان ڈائریکٹ</p>
                        <p class="mt-4 text-xs font-bold text-primary px-4 py-2 bg-primary/5 rounded-full">6 Lessons</p>
                    </div>

                    <!-- Multiplayer Option -->
                    <div class="p-8 rounded-[40px] shadow-sm border border-orange-200/50 flex flex-col items-center text-center cursor-pointer active:scale-95 transition-all hover:border-orange-300 group" style="background: linear-gradient(135deg, #ef4444, #f97316);" onclick="app.renderMatchmaking()">
                        <div class="w-24 h-24 rounded-full flex items-center justify-center text-white text-5xl mb-6 group-hover:scale-110 transition-transform shadow-lg bg-white/20 border-4 border-white/30">⚔️</div>
                        <h3 class="text-2xl font-black text-white mb-2 drop-shadow-md">1v1 Multiplayer</h3>
                        <p class="text-white text-sm font-bold drop-shadow">Challenge other learners in real-time!</p>
                        <p class="mt-4 text-xs font-bold text-orange-600 px-4 py-2 bg-white rounded-full shadow-md">Live Matching</p>
                    </div>
                </div>
                
                ${this.getBottomNav()}
            </div>
        `;
    }

    async renderLearn(mode = 'tenses') {
        let data, title, detailRoute;

        if (mode === 'tenses') {
            data = tenses;
            title = 'Tense Learning';
            detailRoute = 'tense-detail';
        } else if (mode === 'activePassive') {
            data = activePassive;
            title = 'Active/Passive Voice';
            detailRoute = 'ap-detail';
        } else {
            data = directIndirect;
            title = 'Direct/Indirect Speech';
            detailRoute = 'di-detail';
        }

        const progressData = store.data.progress[mode] || {};

        this.container.innerHTML = `
            <div class="flex flex-col min-h-screen bg-soft-gray animate-fade-in pb-24">
                <div class="bg-white p-4 flex items-center space-x-4 shadow-sm sticky top-0 z-10">
                    <button onclick="app.navigate('learn')" class="p-2 -ml-2 text-xl">←</button>
                    <h2 class="text-xl font-bold">${title}</h2>
                </div>
                
                <div class="p-4 grid grid-cols-1 gap-4 overflow-y-auto">
                    ${Object.values(data).map(item => `
                        <div class="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer active:scale-95 transition" onclick="app.navigate('${detailRoute}', {id: '${item.id}'})">
                            <div class="flex items-center space-x-4">
                                <div class="w-12 h-12 ${mode === 'tenses' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'} rounded-2xl flex items-center justify-center text-xl font-bold">
                                    ${item.name[0]}
                                </div>
                                <div>
                                    <h3 class="font-bold text-gray-800">${item.name}</h3>
                                    <p class="text-xs text-gray-500">${item.urduName || 'Voice Conversion'}</p>
                                </div>
                            </div>
                            <div class="flex flex-col items-end">
                                <div class="text-sm font-bold ${mode === 'tenses' ? 'text-primary' : 'text-secondary'}">${progressData[item.id] || 0}%</div>
                                <div class="w-16 bg-gray-100 h-1.5 rounded-full mt-1 overflow-hidden">
                                    <div class="${mode === 'tenses' ? 'bg-primary' : 'bg-secondary'} h-full" style="width: ${progressData[item.id] || 0}%"></div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                ${this.getBottomNav()}
            </div>
        `;
    }

    async renderActivePassiveDetail(id) {
        const item = activePassive[id];
        if (!item) return this.navigate('learn-ap');

        this.container.innerHTML = `
            <div class="flex flex-col min-h-screen bg-soft-gray animate-fade-in pb-24">
                <div class="bg-white p-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
                    <div class="flex items-center space-x-4">
                        <button onclick="app.navigate('learn-ap')" class="p-2 -ml-2 text-xl">←</button>
                        <div>
                            <h2 class="text-lg font-bold leading-none">${item.name} Voice</h2>
                            <p class="text-xs text-gray-500">Active to Passive Conversion</p>
                        </div>
                    </div>
                </div>

                <div class="p-4 space-y-6 overflow-y-auto">
                    <!-- Formulas -->
                    <div class="space-y-4 animate-slide-up">
                        <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Active Formula</h3>
                            <p class="text-xl font-bold text-gray-800">${item.activeFormula}</p>
                        </div>
                        <div class="bg-white p-6 rounded-3xl shadow-sm border border-secondary/20 border-2">
                            <h3 class="text-xs font-bold text-secondary uppercase tracking-wider mb-2">Passive Formula</h3>
                            <p class="text-xl font-bold text-secondary">${item.passiveFormula}</p>
                        </div>
                    </div>

                    <!-- Rules -->
                    <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
                        <h4 class="font-bold mb-3">Key Rules / ضروری اصول</h4>
                        <p class="text-gray-700 leading-relaxed mb-4">${item.rules.english}</p>
                        <p class="text-gray-800 font-urdu border-t pt-4">${item.rules.urdu}</p>
                    </div>

                    <!-- Examples -->
                    <div class="space-y-4 animate-fade-in">
                        <h4 class="font-bold px-2">Examples / مثالیں</h4>
                        ${item.examples.map((ex, idx) => `
                            <div class="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-3">
                                <div class="flex justify-between items-start">
                                    <div>
                                        <p class="text-xs font-bold text-gray-400 uppercase">Active</p>
                                        <p class="font-bold text-gray-800">${ex.active}</p>
                                    </div>
                                </div>
                                <div class="flex justify-between items-start pt-3 border-t border-gray-50">
                                    <div>
                                        <p class="text-xs font-bold text-secondary uppercase">Passive</p>
                                        <p class="font-bold text-secondary">${ex.passive}</p>
                                    </div>
                                </div>
                                <p class="text-sm text-gray-500 font-urdu text-right">${ex.urdu}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="fixed bottom-24 left-4 right-4 animate-slide-up">
                    <button onclick="app.showDifficultySelection('${id}', 'activePassive')" class="w-full bg-secondary text-white font-bold py-4 rounded-3xl shadow-lg active:scale-95 transition">
                        Practice with game
                    </button>
                </div>

                ${this.getBottomNav()}
            </div>
        `;
    }

    async renderDirectIndirectDetail(id) {
        const item = directIndirect[id];
        if (!item) return this.navigate('learn-di');

        this.container.innerHTML = `
            <div class="flex flex-col min-h-screen bg-soft-gray animate-fade-in pb-24">
                <div class="bg-white p-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
                    <div class="flex items-center space-x-4">
                        <button onclick="app.navigate('learn-di')" class="p-2 -ml-2 text-xl">←</button>
                        <div>
                            <h2 class="text-lg font-bold leading-none">${item.name}</h2>
                            <p class="text-xs text-gray-500">Narration Rules</p>
                        </div>
                    </div>
                </div>

                <div class="p-4 space-y-6 overflow-y-auto">
                    <!-- Formulas -->
                    <div class="space-y-4 animate-slide-up">
                        <div class="bg-white p-6 rounded-3xl shadow-sm border border-primary/20 border-2">
                            <h3 class="text-xs font-bold text-primary uppercase tracking-wider mb-2">Structure / فارمولا</h3>
                            <p class="text-xl font-bold text-gray-800">${item.formula}</p>
                        </div>
                    </div>

                    <!-- Rules -->
                    <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
                        <h4 class="font-bold mb-3">Narration Rules / اصول</h4>
                        <p class="text-gray-700 leading-relaxed mb-4">${item.rules.english}</p>
                        <p class="text-gray-800 font-urdu border-t pt-4">${item.rules.urdu}</p>
                    </div>

                    <!-- Examples -->
                    <div class="space-y-4 animate-fade-in">
                        <h4 class="font-bold px-2">Examples / مثالیں</h4>
                        ${item.examples.map((ex, idx) => `
                            <div class="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-3">
                                <div class="flex justify-between items-start">
                                    <div class="w-full">
                                        <div class="flex items-center">
                                            <span class="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded mr-2">DIRECT</span>
                                            <p class="font-bold text-gray-800">${ex.direct}</p>
                                        </div>
                                        <div class="flex items-center mt-3 pt-3 border-t border-gray-50">
                                            <span class="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded mr-2">INDIRECT</span>
                                            <p class="font-bold text-primary">${ex.indirect}</p>
                                        </div>
                                    </div>
                                </div>
                                <p class="text-sm text-gray-500 font-urdu text-right">${ex.urdu}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="fixed bottom-24 left-4 right-4 animate-slide-up">
                    <button onclick="app.showDifficultySelection('${id}', 'directIndirect')" class="w-full bg-primary text-white font-bold py-4 rounded-3xl shadow-lg active:scale-95 transition">
                        Practice Narration
                    </button>
                </div>

                ${this.getBottomNav()}
            </div>
        `;
    }
    async renderTenseDetail(id) {
        const tense = tenses[id];
        if (!tense) return this.navigate('learn-tenses');

        this.container.innerHTML = `
            <div class="flex flex-col min-h-screen bg-soft-gray animate-fade-in pb-24">
                <div class="bg-white p-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
                    <div class="flex items-center space-x-4">
                        <button onclick="app.navigate('learn-tenses')" class="p-2 -ml-2 text-xl">←</button>
                        <div>
                            <h2 class="text-lg font-bold leading-none">${tense.name}</h2>
                            <p class="text-xs text-gray-500">${tense.urduName}</p>
                        </div>
                    </div>
                </div>

                <div class="p-4 space-y-6 overflow-y-auto">
                    <!-- Formula Card -->
                    <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 animate-slide-up">
                        <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Formula</h3>
                        <p class="text-2xl font-bold text-primary">${tense.formula}</p>
                    </div>

                    <!-- Tabs -->
                    <div class="flex bg-gray-200 p-1 rounded-2xl animate-fade-in">
                        <button id="tab-theory" class="flex-1 py-2 rounded-xl text-sm font-bold bg-white shadow-sm transition">Theory</button>
                        <button id="tab-examples" class="flex-1 py-2 rounded-xl text-sm font-bold text-gray-500 transition">Examples</button>
                    </div>

                    <!-- Content -->
                    <div id="tense-content" class="space-y-6">
                        <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
                            <h4 class="font-bold mb-3">What is it?</h4>
                            <p class="text-gray-700 leading-relaxed mb-6">${tense.theory.english}</p>
                            
                            <hr class="mb-6 opacity-30">
                            
                            <h4 class="font-bold mb-3 font-urdu">یہ کیا ہے؟</h4>
                            <p class="text-gray-800 font-urdu">${tense.theory.urdu}</p>
                        </div>
                    </div>
                </div>

                <div class="fixed bottom-24 left-4 right-4 animate-slide-up">
                    <button onclick="app.showDifficultySelection('${id}', 'tenses')" class="w-full bg-secondary text-white font-bold py-4 rounded-3xl shadow-lg active:scale-95 transition">
                        Practice with game
                    </button>
                </div>

                ${this.getBottomNav()}
            </div>
        `;

        document.getElementById('tab-theory').onclick = () => this.switchTenseTab('theory', tense);
        document.getElementById('tab-examples').onclick = () => this.switchTenseTab('examples', tense);
    }

    switchTenseTab(tab, tense) {
        const theoryBtn = document.getElementById('tab-theory');
        const examplesBtn = document.getElementById('tab-examples');
        const content = document.getElementById('tense-content');

        if (tab === 'theory') {
            theoryBtn.className = 'flex-1 py-2 rounded-xl text-sm font-bold bg-white shadow-sm transition';
            examplesBtn.className = 'flex-1 py-2 rounded-xl text-sm font-bold text-gray-500 transition';
            content.innerHTML = `
                <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
                    <h4 class="font-bold mb-3">What is it?</h4>
                    <p class="text-gray-700 leading-relaxed mb-6">${tense.theory.english}</p>
                    
                    <hr class="mb-6 opacity-30">
                    
                    <h4 class="font-bold mb-3 font-urdu">یہ کیا ہے؟</h4>
                    <p class="text-gray-800 font-urdu">${tense.theory.urdu}</p>
                </div>
            `;
        } else {
            examplesBtn.className = 'flex-1 py-2 rounded-xl text-sm font-bold bg-white shadow-sm transition';
            theoryBtn.className = 'flex-1 py-2 rounded-xl text-sm font-bold text-gray-500 transition';
            content.innerHTML = `
                <div class="space-y-4 animate-fade-in">
                    ${tense.examples.map((ex, idx) => `
                        <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center group">
                            <div>
                                <p class="font-bold text-gray-800">${ex.english}</p>
                                <p class="text-sm text-gray-600 font-urdu mt-1">${ex.urdu}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }

    async showDifficultySelection(id, mode = 'tenses', isTest = false) {
        const overlay = document.createElement('div');
        overlay.id = 'difficulty-overlay';
        overlay.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in';

        const title = isTest ? 'Daily Test Challenge' : 'Select Difficulty';
        const subtitle = isTest ? 'روزانہ ٹیسٹ کی مشکل کا انتخاب کریں' : 'مشکل کا انتخاب کریں';

        overlay.innerHTML = `
            <div class="w-full max-w-sm bg-white rounded-[40px] overflow-hidden shadow-2xl animate-bounce-in relative">
                <!-- Header with pattern -->
                <div class="bg-primary/5 p-8 pb-12 text-center relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16"></div>
                    <div class="absolute bottom-0 left-0 w-24 h-24 bg-secondary/10 rounded-full -ml-12 -mb-12"></div>
                    
                    <div class="relative z-10">
                        <div class="w-20 h-20 bg-white rounded-3xl shadow-lg flex items-center justify-center text-primary text-4xl mx-auto mb-4 animate-float">🎮</div>
                        <h3 class="text-2xl font-bold text-gray-800 mb-1">${title}</h3>
                        <p class="text-gray-500 font-urdu text-sm">${subtitle}</p>
                    </div>
                </div>

                <!-- Options -->
                <div class="px-6 py-6 space-y-3 -mt-6 relative z-20">
                    <!-- Easy -->
                    <button onclick="document.getElementById('difficulty-overlay').remove(); app.${isTest ? 'startTest' : 'startGame'}('${id}', '${mode}', 'easy')" 
                        class="w-full p-4 rounded-[2.5rem] bg-white border-2 border-gray-50 hover:border-green-400 hover:bg-green-50/50 flex items-center space-x-4 group transition-all duration-300 shadow-sm hover:shadow-md active:scale-95">
                        <div class="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🌱</div>
                        <div class="flex-1 text-left">
                            <div class="flex items-center justify-between">
                                <span class="font-bold text-gray-800 text-lg">Easy</span>
                                <span class="text-xs text-green-600 font-urdu">آسان</span>
                            </div>
                            <p class="text-[10px] text-gray-400 font-medium">Basic concepts & simple sentences</p>
                        </div>
                    </button>

                    <!-- Medium -->
                    <button onclick="document.getElementById('difficulty-overlay').remove(); app.${isTest ? 'startTest' : 'startGame'}('${id}', '${mode}', 'medium')" 
                        class="w-full p-4 rounded-[2.5rem] bg-white border-2 border-gray-50 hover:border-orange-400 hover:bg-orange-50/50 flex items-center space-x-4 group transition-all duration-300 shadow-sm hover:shadow-md active:scale-95">
                        <div class="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">⚡</div>
                        <div class="flex-1 text-left">
                            <div class="flex items-center justify-between">
                                <span class="font-bold text-gray-800 text-lg">Medium</span>
                                <span class="text-xs text-orange-600 font-urdu">درمیانہ</span>
                            </div>
                            <p class="text-[10px] text-gray-400 font-medium">Moderate speed & word scrambling</p>
                        </div>
                    </button>

                    <!-- Hard -->
                    <button onclick="document.getElementById('difficulty-overlay').remove(); app.${isTest ? 'startTest' : 'startGame'}('${id}', '${mode}', 'hard')" 
                        class="w-full p-4 rounded-[2.5rem] bg-white border-2 border-gray-50 hover:border-red-400 hover:bg-red-50/50 flex items-center space-x-4 group transition-all duration-300 shadow-sm hover:shadow-md active:scale-95">
                        <div class="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🔥</div>
                        <div class="flex-1 text-left">
                            <div class="flex items-center justify-between">
                                <span class="font-bold text-gray-800 text-lg">Hard</span>
                                <span class="text-xs text-red-600 font-urdu">مشکل</span>
                            </div>
                            <p class="text-[10px] text-gray-400 font-medium">Advanced grammar & Verb Race!</p>
                        </div>
                    </button>
                    
                    <button onclick="document.getElementById('difficulty-overlay').remove()" 
                        class="w-full text-gray-400 font-bold py-3 hover:text-gray-600 transition-colors text-sm">
                        Cancel / منسوخ کریں
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    async startGame(tenseId, mode = 'tenses', difficulty = 'easy') {
        let pool;
        if (mode === 'tenses') {
            pool = questions;
        } else if (mode === 'activePassive') {
            pool = apQuestions;
        } else {
            pool = diQuestions;
        }

        let tenseQuestions = [...(pool[tenseId] || [])];

        // Filter by difficulty
        tenseQuestions = tenseQuestions.filter(q => q.difficulty === difficulty);

        // If no questions for this difficulty, fall back to any available or dynamic
        if (tenseQuestions.length === 0) {
            tenseQuestions = [...(pool[tenseId] || [])];
        }

        // Dynamically add questions from examples to increase variety if in tenses mode
        if (mode === 'tenses') {
            const dynamicQuestions = this.generateDynamicQuestions(tenseId, difficulty);
            tenseQuestions = [...tenseQuestions, ...dynamicQuestions];
        } else if (mode === 'activePassive') {
            const dynamicQuestions = this.generateAPDynamicQuestions(tenseId, difficulty);
            tenseQuestions = [...tenseQuestions, ...dynamicQuestions];
        } else {
            const dynamicQuestions = this.generateDIDynamicQuestions(tenseId, difficulty);
            tenseQuestions = [...tenseQuestions, ...dynamicQuestions];
        }

        if (tenseQuestions.length === 0) {
            alert('No questions available for this module yet!');
            const route = mode === 'tenses' ? 'tense-detail' : 'ap-detail';
            return this.navigate(route, { id: tenseId });
        }

        this.gameState = {
            isTest: false,
            mode,
            tenseId,
            difficulty,
            questions: tenseQuestions.sort(() => Math.random() - 0.5),
            currentIndex: 0,
            score: 0,
            lives: 5,
            xpEarned: 0,
            coinsEarned: 0,
            scrambledWords: null,
            userWords: [],
            matchingData: {
                leftItems: null,
                rightItems: null,
                selectedLeft: null,
                selectedRight: null,
                matchedPairs: []
            }
        };

        this.renderQuestion();
    }

    generateDynamicQuestions(tenseId, difficulty = 'easy') {
        const tenseData = tenses[tenseId];
        if (!tenseData || !tenseData.examples) return [];

        // In a real app we might vary the type based on difficulty
        const count = difficulty === 'hard' ? 5 : (difficulty === 'medium' ? 3 : 2);

        // Add a new game type: Verb Race (for all dynamic questions now)
        return tenseData.examples.slice(0, count).map((ex, index) => {
            const type = (difficulty === 'hard' || Math.random() > 0.5) ? 'verb_race' : 'mcq';

            if (type === 'verb_race') {
                return {
                    id: `race_${tenseId}_${index}`,
                    type: 'verb_race',
                    difficulty: difficulty,
                    baseVerb: this.extractBaseVerb(ex.english),
                    targetTense: tenseData.name,
                    answer: ex.english,
                    options: this.generateOptions(ex.english, tenseId),
                    urdu: ex.urdu,
                    isDynamic: true
                };
            }

            return {
                id: `dynamic_${tenseId}_${index}`,
                type: 'mcq',
                difficulty: difficulty,
                question: `Complete the sentence: "${ex.urdu}"`,
                options: this.generateOptions(ex.english, tenseId),
                answer: ex.english,
                urdu: ex.urdu,
                isDynamic: true
            };
        });
    }

    extractBaseVerb(sentence) {
        // Simple extraction for demo: return first verb-like word
        const words = sentence.split(' ');
        return words[1] || words[0]; // He goes -> goes
    }

    generateAPDynamicQuestions(tenseId, difficulty = 'easy') {
        const data = activePassive[tenseId];
        if (!data || !data.examples) return [];

        const count = difficulty === 'hard' ? 4 : 2;

        return data.examples.slice(0, count).map((ex, index) => {
            return {
                id: `ap_dynamic_${tenseId}_${index}`,
                type: 'mcq',
                difficulty: difficulty,
                question: `Change to Passive: "${ex.active}"`,
                options: this.generateAPOptions(ex.passive, tenseId),
                answer: ex.passive,
                urdu: ex.urdu,
                isDynamic: true
            };
        });
    }

    generateAPOptions(correctAnswer, tenseId) {
        const options = [correctAnswer];
        const otherExamples = Object.values(activePassive)
            .flatMap(t => t.examples)
            .filter(ex => ex.passive !== correctAnswer);

        const distractors = [...otherExamples]
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(ex => ex.passive);

        const finalOptions = Array.from(new Set([...options, ...distractors]));
        while (finalOptions.length < 4) {
            const extra = 'The work is done.';
            if (!finalOptions.includes(extra)) finalOptions.push(extra);
        }
        return finalOptions.sort(() => Math.random() - 0.5);
    }

    generateDIDynamicQuestions(tenseId, difficulty = 'easy') {
        const item = directIndirect[tenseId];
        if (!item || !item.examples) return [];
        return item.examples.map((ex, idx) => ({
            id: `di_dyn_${tenseId}_${idx}`,
            type: 'mcq',
            difficulty,
            question: `Change to Indirect: "${ex.direct}"`,
            options: this.generateDIOptions(ex.indirect, tenseId),
            answer: ex.indirect,
            urdu: ex.urdu
        }));
    }

    generateDIOptions(correctAnswer, tenseId) {
        const options = [correctAnswer];
        const otherExamples = Object.values(directIndirect)
            .flatMap(t => t.examples)
            .filter(ex => ex.indirect !== correctAnswer);

        const distractors = [...otherExamples]
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(ex => ex.indirect);

        const finalOptions = Array.from(new Set([...options, ...distractors]));
        while (finalOptions.length < 4) {
            const extra = 'He said that he was busy.';
            if (!finalOptions.includes(extra)) finalOptions.push(extra);
        }
        return finalOptions.sort(() => Math.random() - 0.5);
    }

    generateOptions(correctAnswer, tenseId) {
        const options = [correctAnswer];
        const otherExamples = Object.values(tenses)
            .filter(t => t.examples && Array.isArray(t.examples))
            .flatMap(t => t.examples)
            .filter(ex => ex.english !== correctAnswer);

        // Pick 3 random distractors from other examples
        const distractors = [...otherExamples]
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(ex => ex.english);

        // Ensure we always have 4 unique options if possible
        const finalOptions = Array.from(new Set([...options, ...distractors]));

        // Add fallbacks if not enough distractors
        const fallbacks = ['I go to school.', 'She is happy.', 'They play here.', 'We are learning.'];
        while (finalOptions.length < 4) {
            const extra = fallbacks[Math.floor(Math.random() * fallbacks.length)];
            if (!finalOptions.includes(extra)) finalOptions.push(extra);
        }

        return finalOptions.sort(() => Math.random() - 0.5);
    }

    async startTest(mode = 'tenses', difficulty = 'easy') {
        let allQuestions = [];
        if (mode === 'tenses') {
            Object.keys(tenses).forEach(tenseId => {
                const q = (questions[tenseId] || []).filter(item => item.difficulty === difficulty);
                const dq = this.generateDynamicQuestions(tenseId, difficulty);
                allQuestions = [...allQuestions, ...q, ...dq];
            });
        } else if (mode === 'activePassive') {
            Object.keys(activePassive).forEach(tenseId => {
                const q = (apQuestions[tenseId] || []).filter(item => item.difficulty === difficulty);
                const dq = this.generateAPDynamicQuestions(tenseId, difficulty);
                allQuestions = [...allQuestions, ...q, ...dq];
            });
        } else {
            Object.keys(directIndirect).forEach(tenseId => {
                const q = (diQuestions[tenseId] || []).filter(item => item.difficulty === difficulty);
                const dq = this.generateDIDynamicQuestions(tenseId, difficulty);
                allQuestions = [...allQuestions, ...q, ...dq];
            });
        }

        if (allQuestions.length === 0) {
            alert('No questions found for this difficulty level!');
            return;
        }

        const testPool = allQuestions.sort(() => Math.random() - 0.5).slice(0, 10);

        this.gameState = {
            isTest: true,
            mode: mode,
            difficulty,
            tenseId: mode === 'tenses' ? 'Mixed Tense Test' : (mode === 'activePassive' ? 'Mixed Voice Test' : 'Mixed Narration Test'),
            questions: testPool,
            currentIndex: 0,
            score: 0,
            lives: Infinity,
            xpEarned: 0,
            scrambledWords: [],
            userWords: [],
            timeLeft: 60, // 60 seconds survival timer
            timerInterval: null,
            matchingData: {
                leftItems: null,
                rightItems: null,
                selectedLeft: null,
                selectedRight: null,
                matchedPairs: []
            }
        };

        // Start Survival Timer
        this.gameState.timerInterval = setInterval(() => {
            if (this.currentView !== 'test' && this.currentView !== 'game') {
                clearInterval(this.gameState.timerInterval);
                return;
            }
            this.gameState.timeLeft--;

            // Update UI
            const timerEl = document.getElementById('test-timer');
            const timerBar = document.getElementById('test-timer-bar');
            if (timerEl) {
                timerEl.innerText = this.gameState.timeLeft + 's';
                if (this.gameState.timeLeft <= 10) timerEl.classList.add('text-red-500', 'animate-pulse');
            }
            if (timerBar) {
                timerBar.style.width = Math.min(100, (this.gameState.timeLeft / 60) * 100) + '%';
                if (this.gameState.timeLeft <= 10) timerBar.classList.replace('bg-success', 'bg-red-500');
            }

            if (this.gameState.timeLeft <= 0) {
                clearInterval(this.gameState.timerInterval);
                this.endGame(true, true); // Time out end
            }
        }, 1000);

        this.renderQuestion();
    }

    renderQuestion() {
        try {
            if (!this.gameState || !this.gameState.questions || this.gameState.questions.length === 0) {
                console.error("No questions found in gameState", this.gameState);
                return this.navigate('home');
            }

            const q = this.gameState.questions[this.gameState.currentIndex];
            if (!q) {
                console.error("Question at current index is missing", this.gameState.currentIndex);
                return this.navigate('home');
            }

            const progress = ((this.gameState.currentIndex) / this.gameState.questions.length) * 100;

            // PRE-RENDER content to variable to ensure we don't clear container if render logic fails
            let questionContent = '';
            let extraQuestionUI = '';

            if (q.type === 'mcq') {
                questionContent = q.options.map((opt, idx) => `
                    <button onclick="app.handleMCQClick(this)" data-answer="${String(opt).replace(/"/g, "&quot;")}" 
                            class="w-full p-4 rounded-2xl border-2 border-gray-100 hover:border-primary hover:bg-primary/5 text-lg font-medium transition active:scale-95 animate-slide-up"
                            style="animation-delay: ${idx * 0.1}s">
                        ${opt}
                    </button>
                `).join('');
            } else if (q.type === 'scramble') {
                questionContent = this.renderScramble(q);
            } else if (q.type === 'match_pairs') {
                questionContent = this.renderMatchPairs(q);
            } else if (q.type === 'verb_race') {
                questionContent = this.renderVerbRace(q);
                extraQuestionUI = `
                    <div class="mt-4 flex flex-col items-center">
                        <span class="text-xs font-bold text-gray-400 mb-1">BASE VERB</span>
                        <div class="bg-primary/10 text-primary px-6 py-2 rounded-full font-bold text-xl">${q.baseVerb}</div>
                    </div>
                `;
            } else {
                questionContent = `
                    <div class="space-y-4">
                        <input type="text" id="fill-answer" class="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-primary outline-none text-lg text-center" placeholder="Type your answer...">
                        <button onclick="app.checkAnswer(document.getElementById('fill-answer').value)" class="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg">Check Answer</button>
                    </div>
                `;
            }

            this.container.innerHTML = `
                <div class="flex flex-col min-h-screen bg-white animate-fade-in relative">
                    <!-- Difficulty Badge -->
                    <div class="absolute top-20 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${this.gameState.difficulty === 'easy' ? 'bg-green-100 text-green-600' :
                    this.gameState.difficulty === 'medium' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'
                }">
                        ${this.gameState.difficulty}
                    </div>

                    <!-- Game Header -->
                    <div class="p-4 flex items-center justify-between">
                        <button onclick="app.navigate(app.gameState.isTest ? 'test' : (app.gameState.mode === 'tenses' ? 'tense-detail' : 'ap-detail'), {id: '${this.gameState.tenseId}'})" class="text-2xl p-2">✕</button>
                        <div class="flex-1 mx-4">
                            <div class="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                                ${this.gameState.isTest
                    ? `<div id="test-timer-bar" class="bg-success h-full transition-all duration-1000" style="width: ${Math.min(100, (this.gameState.timeLeft / 60) * 100)}%"></div>`
                    : `<div class="bg-success h-full transition-all duration-500" style="width: ${progress}%"></div>`
                }
                            </div>
                        </div>
                        <div class="flex items-center space-x-1">
                            ${this.gameState.isTest ? `
                                <span class="text-2xl leading-none">⏳</span>
                                <span id="test-timer" class="font-bold text-lg w-8 text-right ${this.gameState.timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-gray-700'}">${this.gameState.timeLeft}s</span>
                            ` : `
                            <span class="text-error text-xl">❤️</span>
                            <span class="font-bold">${this.gameState.lives}</span>
                            `}
                        </div>
                    </div>

                    <!-- Question Area -->
                    <div class="flex-1 p-6 flex flex-col items-center justify-center text-center">
                        <p class="text-gray-400 text-sm font-bold mb-2 uppercase tracking-widest">Question ${this.gameState.currentIndex + 1} of ${this.gameState.questions.length}</p>
                        <h2 class="text-2xl font-bold mb-2">${q.question || q.targetTense || 'Practice Time!'}</h2>
                        ${extraQuestionUI}
                        ${q.urdu ? `<p class="text-gray-500 font-urdu border-t pt-4 w-full mt-4">${q.urdu}</p>` : ''}
                    </div>

                    <!-- Answer Options -->
                    <div class="p-6 space-y-3 pb-12">
                        ${questionContent}
                    </div>
                </div>
            `;

            // Attach listeners

            if (q.type === 'fill') {
                const input = document.getElementById('fill-answer');
                if (input) {
                    input.onkeypress = (e) => {
                        if (e.key === 'Enter') this.checkAnswer(e.target.value);
                    };
                }
            }
        } catch (error) {
            console.error("Error in renderQuestion:", error);
            this.container.innerHTML = `<div class="p-10 text-center"><p class="text-error">Rendering Error. Please try again.</p></div>`;
        }
    }

    checkAnswer(userAnswer) {
        try {
            const q = this.gameState.questions[this.gameState.currentIndex];
            if (!q) return;

            // Disable all buttons in the answer area to prevent multi-clicks
            const buttons = this.container.querySelectorAll('button, input');
            buttons.forEach(btn => {
                btn.disabled = true;
                btn.classList.add('opacity-50', 'pointer-events-none');
            });

            let isCorrect = false;
            if (q.type === 'mcq' || q.type === 'fill' || q.type === 'verb_race') {
                isCorrect = String(userAnswer || '').toLowerCase().trim() === String(q.answer).toLowerCase().trim();
            } else {
                // For scramble/match, logic is handled in their specific check methods
                isCorrect = arguments[1] !== undefined ? arguments[1] : false;
            }

            if (isCorrect) {
                let xp = this.gameState.isTest ? 20 : 10;
                let coins = Math.floor(xp / 5);
                this.gameState.score++;
                this.gameState.xpEarned += xp;
                this.gameState.coinsEarned = (this.gameState.coinsEarned || 0) + coins;

                let timeBonus = '';
                if (this.gameState.isTest) {
                    this.gameState.timeLeft = Math.min(60, this.gameState.timeLeft + 3);
                    timeBonus = ' | +3s ⏳';
                }

                this.showFeedback(true, `+${xp} XP & +${coins} 💰${timeBonus}`);
            } else {
                if (!this.gameState.isTest) {
                    this.gameState.lives--;
                } else {
                    // Time penalty in test mode
                    this.gameState.timeLeft -= 5;
                }

                const correctText = typeof q.answer === 'string' ? q.answer : (q.answer ? (Array.isArray(q.answer) ? q.answer.join(' ') : q.answer) : (q.sentence || 'Incorrect'));
                this.showFeedback(false, correctText + (this.gameState.isTest ? ' | -5s ⏳' : ''));
            }
        } catch (error) {
            console.error("Error checking answer:", error);
            // Re-enable in case of crash to avoid soft-lock
            const buttons = this.container.querySelectorAll('button, input');
            buttons.forEach(btn => {
                btn.disabled = false;
                btn.classList.remove('opacity-50', 'pointer-events-none');
            });
            this.showFeedback(false, "Error occurred / ایرر آ گیا");
        }
    }

    renderScramble(q) {
        if (!this.gameState.scrambledWords || this.gameState.scrambledWords.length === 0) {
            const words = Array.isArray(q.answer) ? q.answer : String(q.sentence || q.question).split(' ');
            this.gameState.scrambledWords = [...words].sort(() => Math.random() - 0.5);
            this.gameState.userWords = [];
        }

        const userArea = this.gameState.userWords.map((word, idx) => `
            <div onclick="app.handleScrambleClick('remove', ${idx})" class="px-4 py-2 bg-primary text-white rounded-xl font-bold cursor-pointer shadow-md transform transition hover:scale-105">
                ${word}
            </div>
        `).join('') || '<span class="text-gray-400 opacity-50">Tap words below to build the sentence...</span>';

        const poolArea = this.gameState.scrambledWords.map((word, idx) => {
            const isUsed = this.gameState.userWords.includes(word);
            return `
                <div ${isUsed ? '' : `onclick="app.handleScrambleClick('add', '${String(word).replace(/'/g, "\\'")}')"`} 
                     class="px-4 py-2 rounded-xl font-bold transition-all duration-300 ${isUsed ? 'bg-gray-100 text-gray-300 pointer-events-none scale-95' : 'bg-white border-2 border-gray-200 text-gray-700 cursor-pointer shadow-sm hover:border-primary hover:text-primary active:scale-95'}">
                    ${word}
                </div>
            `;
        }).join('');

        return `
            <div class="space-y-6 w-full">
                <!-- User built sentence -->
                <div class="min-h-[80px] p-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-3xl flex flex-wrap gap-2 items-center justify-center transition-all duration-300 ${this.gameState.userWords.length > 0 ? 'border-primary/50 bg-primary/5' : ''}">
                    ${userArea}
                </div>
                
                <!-- Word pool -->
                <div class="flex flex-wrap gap-3 justify-center">
                    ${poolArea}
                </div>

                <div class="flex space-x-3 pt-4 border-t border-gray-100">
                    <button onclick="app.checkScramble()" class="flex-1 bg-primary text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition flex items-center justify-center space-x-2">
                        <span>Check Sentence</span>
                    </button>
                    ${this.gameState.userWords.length > 0 ? `
                        <button onclick="app.gameState.userWords=[]; app.renderQuestion()" class="p-4 bg-gray-100 text-gray-500 rounded-2xl hover:bg-gray-200 active:scale-95 transition">
                            ↺
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }

    handleScrambleClick(action, payload) {
        if (action === 'add') {
            this.gameState.userWords.push(payload);
        } else if (action === 'remove') {
            this.gameState.userWords.splice(payload, 1);
        }

        if (this.gameState && this.gameState.isBattle) {
            this.renderBattleQuestion();
        } else {
            this.renderQuestion();
        }
    }

    checkScramble() {
        this.checkScrambleAnswer();
    }

    renderVerbRace(q) {
        // Similar to MCQ but styled fast-paced
        return q.options.map((opt, idx) => `
            <button onclick="app.handleVerbRaceClick(this)" data-answer="${String(opt).replace(/"/g, "&quot;")}" 
                    class="w-full relative overflow-hidden p-5 rounded-2xl border-b-4 border-gray-200 bg-white hover:border-b-4 hover:border-primary hover:bg-primary/5 hover:-translate-y-1 text-lg font-bold transition-all active:translate-y-1 active:border-b-0 animate-slide-up shadow-sm"
                    style="animation-delay: ${idx * 0.1}s">
                <span class="relative z-10">${opt}</span>
            </button>
        `).join('');
    }

    handleVerbRaceClick(btn) {
        const answer = btn.getAttribute('data-answer');
        btn.classList.add('bg-primary', 'text-white', 'border-primary');
        setTimeout(() => this.checkAnswer(answer), 300);
    }

    renderMatchPairs(q) {
        return '<p class="text-error">Match Pairs game is not fully constructed yet.</p>';
    }

    showFeedback(isCorrect, correctAnswer) {
        const overlay = document.createElement('div');
        overlay.className = `fixed inset-0 z-50 flex items-end justify-center p-4 animate-slide-up bg-black/20`; // Added bg-black/20 for better focus
        overlay.innerHTML = `
            <div class="w-full max-w-md ${isCorrect ? 'bg-success' : 'bg-error'} p-6 rounded-3xl text-white shadow-2xl mb-4 animate-bounce-in">
                <div class="flex items-center space-x-4 mb-4">
                    <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-lg">
                        ${isCorrect ? '✓' : '✕'}
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-white">${isCorrect ? 'Excellent!' : 'Correct Answer:'}</h3>
                        <p class="font-bold opacity-90 text-white">${correctAnswer}</p>
                    </div>
                </div>
                <button id="next-q" class="w-full bg-white ${isCorrect ? 'text-success' : 'text-error'} font-bold py-4 rounded-2xl shadow-md active:scale-95 transition">
                    CONTINUE / آگے بڑھیں
                </button>
            </div>
        `;
        document.body.appendChild(overlay);

        overlay.querySelector('#next-q').onclick = () => {
            overlay.remove();

            // Safety check for gameState
            if (!this.gameState || !this.gameState.questions) {
                return this.navigate('home');
            }

            if (this.gameState.lives <= 0 && !this.gameState.isTest) {
                this.endGame(false);
            } else if (this.gameState.currentIndex >= this.gameState.questions.length - 1) {
                this.endGame(true);
            } else {
                this.gameState.currentIndex++;
                // Reset per-question state
                this.gameState.scrambledWords = null;
                this.gameState.userWords = [];
                if (this.gameState.matchingData) {
                    this.gameState.matchingData.leftItems = null;
                    this.gameState.matchingData.rightItems = null;
                    this.gameState.matchingData.selectedLeft = null;
                    this.gameState.matchingData.selectedRight = null;
                    this.gameState.matchingData.matchedPairs = [];
                }
                if (this.gameState && this.gameState.isBattle) {
                    this.renderBattleQuestion();
                } else {
                    this.renderQuestion();
                }
            }
        };
    }

    async endGame(completed, timeout = false) {
        // Clear survival timer if it exists
        if (this.gameState.timerInterval) {
            clearInterval(this.gameState.timerInterval);
        }

        // Update store
        if (this.gameState.xpEarned > 0) {
            store.addXP(this.gameState.xpEarned);
        }

        if (this.gameState.isTest && completed) {
            // Save daily test record
            store.data.user.lastTestTime = Date.now();
            store.save();
        }

        if (!this.gameState.isTest) {
            const masteryBoost = completed ? 20 : 0;
            const mode = this.gameState.mode || 'tenses';

            // Safety check for progress structure
            if (store.data.progress[mode]) {
                const currentProgress = store.data.progress[mode][this.gameState.tenseId] || 0;
                store.updateProgress(mode, this.gameState.tenseId, Math.min(100, currentProgress + masteryBoost));
            } else {
                console.warn(`Progress category ${mode} not found in store.`);
            }
        }

        const backRoute = this.gameState.isTest ? 'test' : (this.gameState.mode === 'tenses' ? 'learn-tenses' : 'learn-ap');

        this.container.innerHTML = `
            <div class="flex flex-col min-h-screen bg-white animate-fade-in p-6 items-center justify-center text-center">
                <div class="text-6xl mb-6 animate-bounce-in">${timeout ? '⏰' : (completed ? (this.gameState.isTest ? '📜' : '🏆') : '💔')}</div>
                <h2 class="text-3xl font-bold mb-2">${timeout ? 'Time\'s Up!' : (completed ? (this.gameState.isTest ? 'Test Complete!' : 'Tense Mastery!') : 'Game Over')}</h2>
                <p class="text-gray-500 mb-8">${timeout ? 'You survived ' + this.gameState.score + ' questions!' : (completed ? 'You finished the session!' : 'Better luck next time!')}</p>
                
                <div class="w-full bg-soft-gray rounded-3xl p-6 mb-8 space-y-4 animate-bounce-in" style="animation-delay: 0.2s">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-500">Correct Answers</span>
                        <span class="font-bold text-success">${this.gameState.score} / ${this.gameState.questions.length}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-500">XP Earned</span>
                        <span class="font-bold text-primary">+${this.gameState.xpEarned} XP</span>
                    </div>
                    <div class="flex justify-between items-center text-sm border-t pt-4">
                        <span class="text-gray-500">Coins Earned</span>
                        <span class="font-bold text-green-600">+${this.gameState.coinsEarned || 0} 💰</span>
                    </div>
                </div>

                <div class="w-full space-y-3 animate-slide-up" style="animation-delay: 0.4s">
                    <button onclick="app.navigate('home')" class="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition">Back to Home</button>
                    <button onclick="app.navigate('${backRoute}')" class="w-full border-2 border-gray-100 text-gray-400 font-bold py-4 rounded-2xl active:scale-95 transition">Return to Section</button>
                </div>
            </div>
        `;
    }

    async renderProfile() {
        const userAvatar = shopItems.find(i => i.id === store.data.user.selectedAvatar) || shopItems[0];

        this.container.innerHTML = `
            <div class="flex flex-col min-h-screen bg-soft-gray animate-fade-in pb-24">
                <!-- Profile Header -->
                <div class="bg-primary pt-12 pb-24 px-6 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 animate-pulse-soft"></div>
                    
                    <div class="flex items-center space-x-4 text-white relative z-10">
                        <div class="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-primary text-4xl font-bold shadow-xl animate-float">
                            ${userAvatar.icon}
                        </div>
                        <div>
                            <h2 class="text-2xl font-bold flex items-center gap-2">
                                ${store.data.user.name || 'Student'}
                                ${store.data.user.purchasedItems.includes('pro_learner') ? '<span class="text-xs bg-yellow-400 text-black px-2 py-0.5 rounded-full">PRO</span>' : ''}
                            </h2>
                            <p class="opacity-80">Level ${store.data.user.level} Learner</p>
                        </div>
                    </div>
                </div>

                <!-- Stats Cards -->
                <div class="px-4 -mt-16 space-y-4 overflow-y-auto relative z-10 pb-8">
                    <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 grid grid-cols-2 gap-4">
                        <div class="text-center p-3 rounded-2xl bg-primary/5">
                            <p class="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Total XP</p>
                            <p class="text-xl font-bold text-primary">${store.data.user.xp}</p>
                        </div>
                        <div class="text-center p-3 rounded-2xl bg-orange-50">
                            <p class="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Streak</p>
                            <p class="text-xl font-bold text-orange-500">${store.data.user.streak} Days</p>
                        </div>
                        <div class="text-center p-3 rounded-2xl bg-purple-50">
                            <p class="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Level</p>
                            <p class="text-xl font-bold text-purple-600">${store.data.user.level}</p>
                        </div>
                        <div class="text-center p-3 rounded-2xl bg-green-50">
                            <p class="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Coins</p>
                            <p class="text-xl font-bold text-green-600">${store.data.user.coins}</p>
                        </div>
                    </div>

                    <!-- Achievements -->
                    <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <h3 class="font-bold mb-4">Achievements</h3>
                        <div class="grid grid-cols-3 gap-4">
                            ${badges.map(badge => {
            const isLocked = !store.data.user.badges.includes(badge.id);
            return `
                                    <div class="flex flex-col items-center ${isLocked ? 'opacity-30 grayscale' : ''}">
                                        <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl mb-2">
                                            ${badge.icon}
                                        </div>
                                        <p class="text-[10px] font-bold text-center leading-tight">${badge.name}</p>
                                    </div>
                                `;
        }).join('')}
                        </div>
                    </div>
                </div>

                ${this.getBottomNav()}
            </div>
        `;
    }

    async renderShop() {
        this.container.innerHTML = `
            <div class="flex flex-col min-h-screen bg-soft-gray animate-fade-in pb-24">
                <!-- Shop Header -->
                <div class="bg-white p-6 sticky top-0 z-50 flex items-center justify-between border-b border-gray-100">
                    <div class="flex items-center space-x-3">
                        <button onclick="app.navigate('profile')" class="p-2 -ml-2 text-xl hover:bg-gray-50 rounded-full transition">←</button>
                        <h2 class="text-xl font-bold text-primary">Avatar Shop</h2>
                    </div>
                    <div class="flex items-center space-x-1 bg-green-50 px-3 py-1 rounded-full">
                        <span class="text-green-600">💰</span>
                        <span class="font-bold text-green-600">${store.data.user.coins}</span>
                    </div>
                </div>

                <!-- Items Grid -->
                <div class="p-4 space-y-6">
                    <div class="grid grid-cols-2 gap-4">
                        ${shopItems.map(item => {
            const isOwned = store.data.user.purchasedItems.includes(item.id);
            const isEquipped = store.data.user.selectedAvatar === item.id;

            return `
                                <div class="bg-white p-5 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center text-center animate-bounce-in">
                                    <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-4xl mb-4 shadow-inner">
                                        ${item.icon}
                                    </div>
                                    <h3 class="font-bold text-gray-800 text-sm mb-1">${item.name}</h3>
                                    <p class="text-[10px] text-gray-400 mb-4 line-clamp-1">${item.description}</p>
                                    
                                    ${isEquipped ? `
                                        <button disabled class="w-full py-2 bg-gray-100 text-gray-400 rounded-full text-xs font-bold">EQUIPPED</button>
                                    ` : isOwned ? `
                                        <button onclick="app.equipItem('${item.id}')" class="w-full py-2 bg-primary/10 text-primary rounded-full text-xs font-bold hover:bg-primary/20 hover:scale-105 active:scale-95 transition">EQUIP</button>
                                    ` : `
                                        <button onclick="app.buyItem('${item.id}')" class="w-full py-2 bg-primary text-white rounded-full text-xs font-bold shadow-lg hover:shadow-primary/30 hover:scale-105 active:scale-95 transition">
                                            ${item.price} 💰
                                        </button>
                                    `}
                                </div>
                            `;
        }).join('')}
                    </div>
                </div>

                ${this.getBottomNav()}
            </div>
        `;
    }

    async renderMatchmaking() {
        this.container.innerHTML = `
            <div class="flex flex-col min-h-screen bg-primary animate-fade-in p-6 items-center justify-center text-center text-white relative overflow-hidden">
                <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20"></div>
                
                <div class="relative z-10 w-full max-w-sm">
                    <div class="w-32 h-32 mx-auto bg-white/20 rounded-full flex items-center justify-center text-6xl mb-8 shadow-2xl animate-spin-slow border-4 border-white border-t-transparent">
                        ⚔️
                    </div>
                    
                    <h2 class="text-3xl font-black mb-2 animate-pulse" id="match-status">Finding Opponent...</h2>
                    <p class="text-white/80 mb-12">Checking global leaderboard for worthy challengers</p>
                    
                    <div class="flex justify-between items-center bg-white/10 rounded-3xl p-4 shimmer">
                        <div class="flex items-center space-x-3">
                            <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-inner text-primary">
                                ${shopItems.find(i => i.id === store.data.user.selectedAvatar)?.icon || '👤'}
                            </div>
                            <div class="text-left">
                                <p class="font-bold">${store.data.user.name || 'Student'}</p>
                                <p class="text-xs text-white/70">Level ${store.data.user.level || 1}</p>
                            </div>
                        </div>
                        <span class="text-2xl font-black text-white/50 animate-pulse">VS</span>
                        <div class="flex items-center space-x-3">
                            <div class="text-right">
                                <p class="text-xs text-white/70" id="op-name-placeholder">???</p>
                            </div>
                            <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl animate-pulse" id="op-avatar-placeholder">
                                ❓
                            </div>
                        </div>
                    </div>

                    <div id="bot-match-btn" class="hidden mt-8">
                         <button onclick="app.startBotMatch()" class="w-full bg-white text-primary font-black py-4 rounded-2xl shadow-xl active:scale-95 transition animate-slide-up">
                            PLAY AGAINST A.I. 🤖
                         </button>
                    </div>

                    <button onclick="app.cancelMatchmaking()" class="mt-8 text-white/50 hover:text-white font-bold transition active:scale-95">Cancel</button>
                </div>
            </div>
        `;

        // Show bot button after 4 seconds
        this.botSearchTimeout = setTimeout(() => {
            const btn = document.getElementById('bot-match-btn');
            if (btn) btn.classList.remove('hidden');
        }, 4000);

        const myId = store.data.user.id;
        const myData = {
            id: myId,
            name: store.data.user.name || 'Student',
            level: store.data.user.level || 1,
            selectedAvatar: store.data.user.selectedAvatar || 'default',
            timestamp: Date.now()
        };

        const waitingRef = ref(db, 'matchmaking/waitingRoom');

        get(waitingRef).then((snapshot) => {
            const data = snapshot.val();
            // If someone else is waiting
            if (data && data.id !== myId && !data.roomId) {
                // I am Player 2!
                const roomId = 'room_' + Date.now() + '_' + myId;
                const matchData = {
                    roomId: roomId,
                    p1: { ...data, score: 0 },
                    p2: { ...myData, score: 0 }
                };

                // Create the active room
                set(ref(db, 'active_matches/' + roomId), matchData).then(() => {
                    // Tell P1 the room is ready
                    update(waitingRef, { roomId: roomId, p2Data: myData }).then(() => {
                        this.startMatchAs(roomId, 2, data);
                    });
                });
            } else {
                // No one is waiting, or it's just my old stale connection. I am Player 1.
                set(waitingRef, myData).then(() => {
                    // Handle disconnect cleanup
                    onDisconnect(waitingRef).remove();

                    // Listen for P2 to pair with me
                    this.matchmakingListener = onValue(waitingRef, (snap) => {
                        const val = snap.val();
                        if (val && val.id === myId && val.roomId && val.p2Data) {
                            // P2 found me!
                            off(waitingRef, 'value', this.matchmakingListener);
                            this.matchmakingListener = null;
                            remove(waitingRef); // Clean up queue
                            this.startMatchAs(val.roomId, 1, val.p2Data);
                        }
                    });
                });
            }
        });
    }

    startMatchAs(roomId, playerNum, opponentData) {
        if (this.matchmakingListener) {
            off(ref(db, 'matchmaking/waitingRoom'), 'value', this.matchmakingListener);
            this.matchmakingListener = null;
        }

        this.battleState = {
            roomId,
            playerNum,
            myScore: 0,
            opponent: opponentData,
            opponentScore: 0,
            timeLeft: 120
        };

        const matchRef = ref(db, 'active_matches/' + roomId);

        // Handle disconnect during match
        onDisconnect(matchRef).remove();

        this.matchListener = onValue(matchRef, (snap) => {
            const val = snap.val();
            if (!val) {
                if (!this.battleState.opponent.isBot) {
                    this.endBattle(true, 'opponent_left');
                }
                return;
            }

            const myData = playerNum === 1 ? val.p1 : val.p2;
            const opData = playerNum === 1 ? val.p2 : val.p1;

            this.battleState.opponentScore = opData.score;
            this.battleState.myScore = myData.score;
            this.updateBattleUI();

            if (opData.score >= 6) {
                this.endBattle(false, 'score_reached');
            } else if (myData.score >= 6) {
                this.endBattle(true, 'score_reached');
            }
        });

        // Start Battle Timer
        this.battleTimerInterval = setInterval(() => {
            if (!this.battleState) {
                clearInterval(this.battleTimerInterval);
                return;
            }
            this.battleState.timeLeft--;
            this.updateBattleTimerUI();

            if (this.battleState.timeLeft <= 0) {
                clearInterval(this.battleTimerInterval);
                const iWon = this.battleState.myScore > this.battleState.opponentScore;
                this.endBattle(iWon, 'time_up');
            }
        }, 1000);

        if (opponentData.isBot) {
            this.simulateBotMoves();
        }

        this.startBattleGame();
    }

    startBotMatch() {
        const roomId = 'bot_room_' + Date.now();
        const botData = {
            id: 'bot_' + Math.floor(Math.random() * 1000),
            name: 'Grammar Bot 🤖',
            level: Math.max(1, store.data.user.level + (Math.floor(Math.random() * 3) - 1)),
            selectedAvatar: 'bot_pro',
            isBot: true
        };

        const myData = {
            id: store.data.user.id,
            name: store.data.user.name || 'Student',
            level: store.data.user.level || 1,
            selectedAvatar: store.data.user.selectedAvatar || 'default',
            score: 0
        };

        const matchData = {
            roomId: roomId,
            p1: myData,
            p2: { ...botData, score: 0 }
        };

        set(ref(db, 'active_matches/' + roomId), matchData).then(() => {
            this.startMatchAs(roomId, 1, botData);
        });
    }

    simulateBotMoves() {
        if (!this.battleState || !this.battleState.opponent.isBot) return;

        this.botInterval = setInterval(() => {
            if (!this.battleState || !this.battleState.opponent.isBot) {
                clearInterval(this.botInterval);
                return;
            }

            // Bot answers every 5-9 seconds
            if (Math.random() > 0.4) { // 60% chance to score
                this.battleState.opponentScore++;
                const opNum = 2; // Bot is always P2 in bot matches
                const scorePath = `active_matches/${this.battleState.roomId}/p${opNum}/score`;
                set(ref(db, scorePath), this.battleState.opponentScore);
            }

            if (this.battleState && this.battleState.opponentScore >= 6) {
                clearInterval(this.botInterval);
            }
        }, 5000 + Math.random() * 4000);
    }

    cancelMatchmaking() {
        if (this.botSearchTimeout) clearTimeout(this.botSearchTimeout);
        if (this.botInterval) clearInterval(this.botInterval);

        if (this.matchmakingListener) {
            off(ref(db, 'matchmaking/waitingRoom'), 'value', this.matchmakingListener);
            this.matchmakingListener = null;
            remove(ref(db, 'matchmaking/waitingRoom'));
        }
        if (this.matchListener && this.battleState) {
            off(ref(db, 'active_matches/' + this.battleState.roomId), 'value', this.matchListener);
            this.matchListener = null;
            remove(ref(db, 'active_matches/' + this.battleState.roomId));
        }
        this.battleState = null;
        this.navigate('learn-tenses');
    }

    startBattleGame() {
        // Pool random 15 questions from Tenses and AP Data
        let testPool = [];

        // Use the imported questions and apQuestions objects
        if (typeof questions !== 'undefined') {
            Object.values(questions).forEach(qList => testPool = testPool.concat(qList));
        }
        if (typeof apQuestions !== 'undefined') {
            Object.values(apQuestions).forEach(qList => testPool = testPool.concat(qList));
        }

        // If pool is still empty (fallback), try other sources or just notify
        if (testPool.length === 0) {
            testPool = [{ id: 'b1', type: 'mcq', question: 'I ___ to school.', options: ['go', 'goes', 'going'], answer: 'go', urdu: 'میں سکول جاتا ہوں۔' }];
        }

        testPool = testPool.sort(() => Math.random() - 0.5).slice(0, 15);

        this.gameState = {
            isBattle: true,
            questions: testPool,
            currentIndex: 0,
            scrambledWords: [],
            userWords: []
        };

        this.navigate('battle');
    }

    renderBattleQuestion() {
        if (!this.gameState || !this.gameState.questions) return this.navigate('home');
        if (!this.battleState) return this.navigate('home');

        const q = this.gameState.questions[this.gameState.currentIndex];
        const opponentAvatar = shopItems.find(i => i.id === (this.battleState.opponent.selectedAvatar || 'default'))?.icon || '👤';
        const myAvatar = shopItems.find(i => i.id === store.data.user.selectedAvatar)?.icon || '👤';

        this.container.innerHTML = `
            <div class="flex flex-col min-h-screen bg-slate-950 animate-fade-in relative overflow-hidden font-sans">
                <!-- Immersive Background Decoration -->
                <div class="absolute inset-0 pointer-events-none overflow-hidden">
                    <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_20%,rgba(59,130,246,0.15),transparent_70%)]"></div>
                    <div class="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
                    <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] animate-pulse" style="animation-delay: 2s"></div>
                </div>

                <!-- TOP HALF: OPPONENT -->
                <div class="h-1/2 bg-gradient-to-b from-red-600/90 to-red-900/95 p-4 flex flex-col items-center justify-start text-white relative transition-all duration-700 border-b-2 border-white/10">
                    <!-- Opponent Stats Overlay -->
                    <div class="absolute top-4 right-6 flex items-center space-x-3 bg-black/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                        <div class="text-right">
                            <p class="text-[10px] uppercase font-black text-white/60 leading-none">Opponent</p>
                            <p class="font-bold text-sm">${this.battleState.opponent.name || 'Opponent'}</p>
                        </div>
                        <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-2xl shadow-inner">
                            ${opponentAvatar}
                        </div>
                    </div>

                    <!-- Opponent Large Score -->
                    <div class="mt-8 flex flex-col items-center">
                        <div class="text-7xl font-black text-white/20 italic tracking-tighter sm:text-9xl" id="battle-op-score-large">
                            ${this.battleState.opponentScore}
                        </div>
                        <div class="flex space-x-2 mt-2" id="battle-op-stars">
                            ${Array(6).fill(0).map((_, i) => `
                                <div class="w-3 h-3 rounded-full border border-white/30 ${i < this.battleState.opponentScore ? 'bg-yellow-400 shadow-[0_0_15px_#fbbf24]' : 'bg-transparent'} transition-all duration-500"></div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- BOTTOM HALF: PLAYER -->
                <div class="h-1/2 bg-gradient-to-t from-blue-600/90 to-blue-900/95 p-4 flex flex-col items-center justify-end text-white relative transition-all duration-700 border-t-2 border-white/10">
                    <!-- My Stats Overlay -->
                    <div class="absolute bottom-4 left-6 flex items-center space-x-3 bg-black/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                        <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-2xl shadow-lg text-blue-600">
                             ${myAvatar}
                        </div>
                        <div class="text-left">
                            <p class="text-[10px] uppercase font-black text-white/60 leading-none">You</p>
                            <p class="font-bold text-sm">Level ${store.data.user.level}</p>
                        </div>
                    </div>

                    <!-- My Large Score -->
                    <div class="mb-8 flex flex-col items-center">
                        <div class="flex space-x-2 mb-2" id="battle-my-stars">
                            ${Array(6).fill(0).map((_, i) => `
                                <div class="w-3 h-3 rounded-full border border-white/30 ${i < this.battleState.myScore ? 'bg-yellow-400 shadow-[0_0_15px_#fbbf24]' : 'bg-transparent'} transition-all duration-500"></div>
                            `).join('')}
                        </div>
                        <div class="text-7xl font-black text-white/20 italic tracking-tighter sm:text-9xl" id="battle-my-score-large">
                            ${this.battleState.myScore}
                        </div>
                    </div>
                </div>

                <!-- CENTRAL BATTLE HUB -->
                <div class="absolute inset-0 flex items-center justify-center p-4 pt-20 pb-40 overflow-y-auto z-[80] scroll-smooth">
                    <div class="w-full max-w-xl md:max-w-2xl mb-20">
                        <div class="bg-white rounded-[2rem] md:rounded-[3rem] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.6)] overflow-hidden border-b-8 border-gray-200 animate-slide-up transform perspective-1000">
                            <!-- Hub Header -->
                            <div class="bg-gray-50 px-6 py-4 flex justify-between items-center border-b border-gray-100">
                                <div class="flex items-center space-x-2">
                                     <span class="text-xl">⏳</span>
                                     <span id="battle-timer" class="font-black text-primary text-xl">${this.battleState.timeLeft}s</span>
                                </div>
                                <span class="bg-primary/10 text-primary text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                                    ${q.type === 'mcq' ? 'Multiple Choice' : q.type === 'fill' ? 'Fill Gap' : 'Sentence Builder'}
                                </span>
                                <div class="flex items-center space-x-2">
                                    <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <span class="text-[10px] font-black text-gray-400 uppercase tracking-tighter">BATTLE LIVE</span>
                                </div>
                            </div>

                            <!-- Question Content -->
                            <div class="p-8">
                                <div class="text-center mb-6">
                                    <p class="text-xl md:text-3xl text-gray-800 font-extrabold leading-tight mb-4">
                                        ${String(q.sentence || q.question || '...').replace(/_{3,}/g, '<span class="inline-block w-12 md:w-16 border-b-4 border-primary translate-y-1 mx-1"></span>')}
                                    </p>
                                    ${q.urdu ? `
                                        <div class="inline-block px-5 py-2 bg-primary/5 rounded-2xl">
                                            <p class="text-primary/80 font-urdu text-xl md:text-2xl rtl font-bold leading-relaxed" dir="rtl">${q.urdu}</p>
                                        </div>
                                    ` : ''}
                                </div>

                                <!-- Dynamic Game Area -->
                                <div id="battle-game-area" class="space-y-2 min-h-[140px] flex flex-col justify-center">
                                    ${q.type === 'mcq' ? this.renderMCQ(q) :
                q.type === 'fill' ? this.renderFillBlank(q) :
                    q.type === 'scramble' ? this.renderScramble(q) :
                        q.type === 'verb_race' ? this.renderVerbRace(q) :
                            q.type === 'match_pairs' ? this.renderMatchPairs(q) : ''}
                                </div>
                            </div>
                            
                             <!-- VS Footer with Names and Avatars -->
                            <div class="px-6 py-4 md:py-6 bg-gray-50 flex justify-between items-center border-t border-gray-100">
                                <div class="flex items-center space-x-3">
                                    <div class="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-100 flex items-center justify-center text-xl md:text-2xl shadow-sm border border-blue-200">${myAvatar}</div>
                                    <div class="flex flex-col">
                                        <span class="text-[10px] md:text-xs font-black uppercase text-gray-400">Player</span>
                                        <span class="text-xs md:text-sm font-bold text-gray-700 truncate max-w-[70px] md:max-w-[120px]">${store.data.user.name || 'YOU'}</span>
                                    </div>
                                </div>
                                
                                <div class="w-10 h-10 bg-gray-900 border-4 border-white rounded-full flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform">
                                    <span class="text-[10px] md:text-xs font-black italic text-yellow-500">VS</span>
                                </div>

                                <div class="flex items-center space-x-3 flex-row-reverse space-x-reverse text-right text-right">
                                    <div class="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-red-100 flex items-center justify-center text-xl md:text-2xl shadow-sm border border-red-200">${opponentAvatar}</div>
                                    <div class="flex flex-col">
                                        <span class="text-[10px] md:text-xs font-black uppercase text-gray-400">Opponent</span>
                                        <span class="text-xs md:text-sm font-bold text-gray-700 truncate max-w-[70px] md:max-w-[120px]">${this.battleState.opponent.name || 'Opponent'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        if (q.type === 'fill') {
            const fillInp = document.getElementById('fill-input');
            if (fillInp) {
                fillInp.focus();
                fillInp.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.checkBattleAnswer(fillInp.value.trim());
                });
            }
        }
    }

    renderMCQ(q) {
        return q.options.map((opt, idx) => `
            <button onclick="app.handleMCQClick(this)" data-answer="${String(opt).replace(/"/g, "&quot;")}" 
                    class="w-full p-3.5 rounded-2xl border-2 border-gray-100 bg-white text-gray-800 font-bold text-lg shadow-sm transform transition-all hover:border-primary hover:bg-primary/5 hover:scale-[1.02] active:scale-95 animate-slide-up"
                    style="animation-delay: ${idx * 0.1}s">
                <span class="pointer-events-none lowercase first-letter:uppercase text-base">${opt}</span>
            </button>
        `).join('');
    }

    renderFillBlank(q) {
        return `
            <div class="space-y-4 animate-slide-up">
                <div class="relative">
                    <input type="text" id="fill-input" 
                           class="w-full p-5 rounded-3xl border-2 border-gray-100 focus:border-primary outline-none text-xl font-bold text-center bg-gray-50/50 shadow-inner placeholder:text-gray-300 transition-all" 
                           placeholder="Type your answer...">
                    <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                         <span class="text-2xl opacity-20">✍️</span>
                    </div>
                </div>
                <button onclick="app.checkBattleAnswer(document.getElementById('fill-input').value.trim())" 
                        class="w-full bg-primary text-white font-black py-4 rounded-3xl shadow-[0_10px_20px_-5px_rgba(var(--primary-rgb),0.4)] active:scale-95 transition-all text-lg tracking-widest">
                    SUBMIT
                </button>
            </div>
        `;
    }

    updateBattleUI() {
        const myScoreLarge = document.getElementById('battle-my-score-large');
        const opScoreLarge = document.getElementById('battle-op-score-large');
        const myStars = document.getElementById('battle-my-stars');
        const opStars = document.getElementById('battle-op-stars');

        if (myScoreLarge && String(myScoreLarge.innerText) !== String(this.battleState.myScore)) {
            myScoreLarge.innerText = this.battleState.myScore;
            myScoreLarge.classList.add('animate-bounce');
            setTimeout(() => myScoreLarge.classList.remove('animate-bounce'), 500);
        }
        if (opScoreLarge && String(opScoreLarge.innerText) !== String(this.battleState.opponentScore)) {
            opScoreLarge.innerText = this.battleState.opponentScore;
            opScoreLarge.classList.add('animate-bounce');
            setTimeout(() => opScoreLarge.classList.remove('animate-bounce'), 500);
        }

        if (myStars) {
            myStars.innerHTML = Array(6).fill(0).map((_, i) => `
                <div class="w-3 h-3 rounded-full border border-white/30 ${i < this.battleState.myScore ? 'bg-yellow-400 shadow-[0_0_15px_#fbbf24]' : 'bg-transparent'} transition-all duration-500"></div>
            `).join('');
        }
        if (opStars) {
            opStars.innerHTML = Array(6).fill(0).map((_, i) => `
                <div class="w-3 h-3 rounded-full border border-white/30 ${i < this.battleState.opponentScore ? 'bg-yellow-400 shadow-[0_0_15px_#fbbf24]' : 'bg-transparent'} transition-all duration-500"></div>
            `).join('');
        }
    }

    updateBattleTimerUI() {
        const timerEl = document.getElementById('battle-timer');
        if (timerEl) {
            timerEl.innerText = `${this.battleState.timeLeft}s`;
            if (this.battleState.timeLeft <= 10) {
                timerEl.classList.add('text-red-500', 'animate-pulse');
            }
        }
    }

    checkBattleAnswer(userAnswer) {
        try {
            if (!this.gameState || !this.gameState.questions) return;

            const q = this.gameState.questions[this.gameState.currentIndex];

            let isCorrect = false;

            if (Array.isArray(q.answer)) {
                // Scramble/Match case: q.answer is array of words
                isCorrect = userAnswer.toLowerCase().trim() === q.answer.join(' ').toLowerCase().trim();
            } else {
                // MCQ/Fill case: q.answer is string
                isCorrect = userAnswer.toLowerCase().trim() === String(q.answer).toLowerCase().trim();
            }

            const btnContainer = document.getElementById('battle-game-area');
            if (btnContainer) {
                btnContainer.classList.add('pointer-events-none', 'opacity-50'); // Lock UI briefly
            }

            if (isCorrect) {
                this.battleState.myScore++;
                // Alert Firebase!
                if (this.battleState) {
                    const scorePath = `active_matches/${this.battleState.roomId}/p${this.battleState.playerNum}/score`;
                    set(ref(db, scorePath), this.battleState.myScore);
                }

                // Auto-proceed for correct answers in battle to keep it fast
                setTimeout(() => {
                    if (this.gameState) {
                        this.gameState.currentIndex++;
                        this.gameState.scrambledWords = null;
                        this.gameState.userWords = [];
                        if (this.gameState.currentIndex >= this.gameState.questions.length) {
                            this.gameState.currentIndex = 0;
                            this.gameState.questions = this.gameState.questions.sort(() => Math.random() - 0.5);
                        }
                        this.renderBattleQuestion();
                    }
                }, 300);
            } else {
                // For wrong answers, show the correct one like practice tests
                const answerText = Array.isArray(q.answer) ? q.answer.join(' ') : String(q.answer);
                this.showFeedback(false, answerText);
            }
        } catch (error) {
            console.error("Error in checkBattleAnswer:", error);
            this.renderBattleQuestion(); // Force refresh on error
        }
    }

    endBattle(iWon, reason) {
        if (this.battleTimerInterval) clearInterval(this.battleTimerInterval);
        if (this.botInterval) clearInterval(this.botInterval);

        if (this.matchListener && this.battleState && reason !== 'opponent_disconnected' && reason !== 'opponent_left') {
            off(ref(db, 'active_matches/' + this.battleState.roomId), 'value', this.matchListener);
            this.matchListener = null;
            remove(ref(db, 'active_matches/' + this.battleState.roomId));
        }

        this.gameState = null;
        this.battleState = null;

        // Reward logic
        if (iWon) {
            store.addXP(50);
            store.addCoins(25);
        }

        this.container.innerHTML = `
            <div class="flex flex-col min-h-screen bg-white animate-fade-in p-6 items-center justify-center text-center">
                <div class="text-8xl mb-6 animate-bounce-in">${iWon ? '🏆' : '💀'}</div>
                <h2 class="text-3xl font-black mb-2 tracking-tight ${iWon ? 'text-green-500' : 'text-red-500'}">${iWon ? 'VICTORY!' : 'DEFEAT'}</h2>
                <p class="text-gray-500 mb-8 font-bold">${reason === 'opponent_disconnected' ? 'Opponent retreated!' : (iWon ? 'You dominated the match!' : 'Better luck next time!')}</p>
                
                <div class="w-full bg-soft-gray rounded-3xl p-6 mb-8 space-y-4 animate-bounce-in shadow-inner" style="animation-delay: 0.2s">
                    <div class="flex justify-between items-center text-sm border-b pb-4 border-gray-200">
                        <span class="text-gray-500 font-bold">XP Earned</span>
                        <span class="font-black ${iWon ? 'text-primary' : 'text-gray-400'}">${iWon ? '+50 XP' : '+0 XP'}</span>
                    </div>
                    <div class="flex justify-between items-center text-sm pt-2">
                        <span class="text-gray-500 font-bold">Coins Received</span>
                        <span class="font-black ${iWon ? 'text-green-500' : 'text-gray-400'}">${iWon ? '+25 💰' : '+0 💰'}</span>
                    </div>
                </div>

                <div class="w-full space-y-3 animate-slide-up" style="animation-delay: 0.4s">
                    <button onclick="app.navigate('home')" class="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-xl hover:shadow-primary/30 active:scale-95 transition">Return Home</button>
                    <button onclick="app.renderMatchmaking()" class="w-full border-2 border-gray-100 text-gray-500 font-bold py-4 rounded-2xl active:scale-95 transition hover:bg-gray-50">Play Again</button>
                </div>
            </div >
                    `;
    }

    async renderLeaderboard() {
        // Use the real-time leaderboard from our backend 
        // We only want to show real users (no bots!)
        // So we filter out anyone with `isBot: true` and ensure they have an ID.
        console.log("Current leaderboard state:", store.data.leaderboard);

        // Handle case where store.data.leaderboard might be undefined from legacy cache
        const sourceData = Array.isArray(store.data.leaderboard) ? store.data.leaderboard : [];

        let ranking = sourceData
            .filter(p => p.id && !p.isBot) // Server data won't have isBot, but local dummy data does
            .sort((a, b) => (b.xp || 0) - (a.xp || 0));

        // If the ranking list is completely empty (server offline or no data yet), 
        // AT LEAST show the current user so they see themselves.
        if (ranking.length === 0 && store.data.user.id) {
            console.log("Fallback triggering, showing local user only.");
            ranking = [{
                id: store.data.user.id,
                name: store.data.user.name || 'You',
                level: store.data.user.level || 1,
                xp: store.data.user.xp || 0,
                isUser: true,
                selectedAvatar: store.data.user.selectedAvatar,
                badges: store.data.user.badges || []
            }];
        }

        this.container.innerHTML = `
            <div class="flex flex-col min-h-screen bg-soft-gray animate-fade-in pb-24">
                <!--Ranking Header-->
                <div class="bg-primary p-6 pt-12 pb-20 relative overflow-hidden">
                    <div class="absolute inset-0 bg-white opacity-5" style="background-image: radial-gradient(#000 0.5px, transparent 0.5px); background-size: 10px 10px;"></div>
                    <div class="flex items-center space-x-3 text-white relative z-10">
                        <button onclick="app.navigate('profile')" class="p-2 -ml-2 text-xl hover:bg-white/10 rounded-full transition">←</button>
                        <h2 class="text-2xl font-bold">Learner Ranking</h2>
                    </div>
                    <p class="text-white/60 mt-1 relative z-10">Real-time Global Leaderboard!</p>
                </div>

                <!--Leaderboard List-->
                    <div class="px-4 -mt-10 relative z-20 space-y-3 pb-8">
                        ${ranking.length === 0 ? '<p class="text-center text-gray-500 py-10 bg-white rounded-3xl shadow-sm">Loading users or no users yet...</p>' : ''}
                        ${ranking.map((player, index) => {
            const isCurrentUser = player.id === store.data.user.id;
            // Map their selected avatar (or fallback)
            const avatarIcon = shopItems.find(i => i.id === (player.selectedAvatar || 'default'))?.icon || '👤';

            return `
                        <div class="flex items-center p-4 rounded-3xl bg-white ${isCurrentUser ? 'border-2 border-primary shadow-xl scale-102 ring-4 ring-primary/5' : 'border border-gray-50 shadow-sm'} transition-transform">
                            <div class="w-8 font-black text-lg ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-400' : 'text-gray-300'}">
                                #${index + 1}
                            </div>
                            <div class="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-xl mr-4 shadow-inner relative">
                            ${index === 0 ? '<div class="absolute -top-3 -right-2 text-2xl drop-shadow-md z-10 animate-bounce">👑</div>' : ''}
                            ${avatarIcon}
                        </div>
                            <div class="flex-1">
                                <h4 class="font-bold text-gray-800 flex items-center flex-wrap gap-1 ${isCurrentUser ? 'text-primary' : ''}">
                                    ${player.name} ${isCurrentUser ? '(You)' : ''}
                                    ${player.badges && player.badges.length > 0 ? `
                                        <span class="inline-flex items-center justify-center w-5 h-5 bg-gray-100 text-xs rounded-full shadow-sm ml-1" title="Has unlocked badges">
                                            ${badges.find(b => b.id === player.badges[player.badges.length - 1])?.icon || '🏆'}
                                        </span>
                                    ` : ''}
                                </h4>
                                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Level ${player.level || 1}</p>
                            </div>
                            <div class="text-right">
                                <span class="font-black text-primary">${player.xp}</span>
                                <span class="text-[10px] text-gray-400 font-bold block">XP</span>
                            </div>
                        </div>
                    `}).join('')}
                    </div>

                ${this.getBottomNav()}
            </div>
        `;
    }

    buyItem(itemId) {
        const item = shopItems.find(i => i.id === itemId);
        if (!item) return;

        if (store.data.user.coins >= item.price) {
            if (store.deductCoins(item.price)) {
                store.data.user.purchasedItems.push(itemId);
                store.save();
                this.renderShop(); // Refresh view

                // Show success feedback logic could be here, but alert is simple for now
                console.log(`Successfully purchased ${item.name} `);
            }
        } else {
            console.log("Not enough coins!");
        }
    }

    equipItem(itemId) {
        const item = shopItems.find(i => i.id === itemId);
        if (item && item.type === 'avatar') {
            store.updateUser({ selectedAvatar: itemId });
            this.renderShop(); // Refresh
        }
    }

    async renderTestSelection() {
        const lastTestTime = store.data.user.lastTestTime || 0;
        const now = Date.now();
        const cooldown = 24 * 60 * 60 * 1000;
        const timeLeft = cooldown - (now - lastTestTime);

        if (timeLeft > 0) {
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

            this.container.innerHTML = `
                <div class="flex flex-col min-h-screen bg-soft-gray animate-fade-in pb-24">
                    <div class="bg-white p-4 shadow-sm sticky top-0 z-10 text-center">
                        <button onclick="app.navigate('home')" class="absolute left-4 top-4 p-2 text-xl">←</button>
                        <h2 class="text-xl font-bold">Daily Test</h2>
                    </div>

                    <div class="p-6 flex-1 flex flex-col items-center justify-center text-center">
                        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 text-4xl mb-6">🔒</div>
                        <h3 class="text-2xl font-bold mb-2">Test Locked</h3>
                        <p class="text-gray-500 mb-8 px-6">You have already taken your daily test. Next test available in:</p>
                        
                        <div class="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
                            <span class="text-3xl font-bold text-primary">${hours}h ${minutes}m</span>
                        </div>
                    </div>

                    ${this.getBottomNav()}
                </div>
                    `;
            return;
        }

        this.container.innerHTML = `
            <div class="flex flex-col min-h-screen bg-soft-gray animate-fade-in pb-24">
                <div class="bg-white p-4 shadow-sm sticky top-0 z-10 text-center">
                    <button onclick="app.navigate('home')" class="absolute left-4 top-4 p-2 text-xl">←</button>
                    <h2 class="text-xl font-bold">Daily Test / ڈیلی ٹیسٹ</h2>
                </div>

                <div class="p-6 space-y-6">
                    <div class="text-center mb-8">
                        <div class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary text-3xl mx-auto mb-4">📝</div>
                        <h3 class="text-2xl font-bold">Select Test Mode</h3>
                        <p class="text-gray-500">Pick a category for your daily challenge</p>
                    </div>

                    <button onclick="app.showDifficultySelection('tenses', 'tenses', true)" class="w-full bg-white p-6 rounded-[32px] shadow-sm border-2 border-primary/5 hover:border-primary/20 flex items-center space-x-4 active:scale-95 transition-all text-left group">
                        <div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition">📚</div>
                        <div class="flex-1">
                            <h4 class="font-bold text-gray-800 text-lg">Tenses Test</h4>
                            <p class="text-gray-500 text-sm">Mixed questions from all tenses</p>
                        </div>
                        <span class="text-primary text-xl">→</span>
                    </button>

                    <button onclick="app.showDifficultySelection('activePassive', 'activePassive', true)" class="w-full bg-white p-6 rounded-[32px] shadow-sm border-2 border-secondary/5 hover:border-secondary/20 flex items-center space-x-4 active:scale-95 transition-all text-left group">
                        <div class="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition">🔄</div>
                        <div class="flex-1">
                            <h4 class="font-bold text-gray-800 text-lg">Voice Test</h4>
                            <p class="text-gray-500 text-sm">Active & Passive Voice conversion</p>
                        </div>
                        <span class="text-secondary text-xl">→</span>
                    </button>

                    <button onclick="app.showDifficultySelection('directIndirect', 'directIndirect', true)" class="w-full bg-white p-6 rounded-[32px] shadow-sm border-2 border-primary/5 hover:border-primary/20 flex items-center space-x-4 active:scale-95 transition-all text-left group">
                        <div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition">🗣️</div>
                        <div class="flex-1">
                            <h4 class="font-bold text-gray-800 text-lg">Narration Test</h4>
                            <p class="text-gray-500 text-sm">Direct & Indirect Speech questions</p>
                        </div>
                        <span class="text-primary text-xl">→</span>
                    </button>
                    
                    <p class="text-center text-gray-400 text-xs mt-8">Note: You can take only one test every 24 hours.</p>
                </div>

                ${this.getBottomNav()}
            </div>
        `;
    }

    getBottomNav() {
        const views = [
            { id: 'home', icon: '🏠', label: 'Home' },
            { id: 'learn', icon: '📚', label: 'Learn' },
            { id: 'shop', icon: '🏪', label: 'Shop' },
            { id: 'leaderboard', icon: '🏆', label: 'Ranking' },
            { id: 'test', icon: '📝', label: 'Tests' },
            { id: 'profile', icon: '👤', label: 'Profile' }
        ];

        return `
            <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-1 flex items-center justify-around z-20 shadow-[0_-5px_15px_-3px_rgba(0,0,0,0.05)]">
                ${views.map(v => `
                    <button class="flex flex-col items-center py-2 px-1 ${this.currentView === v.id ? 'text-primary' : 'text-gray-400'} transition-colors" onclick="app.navigate('${v.id}')">
                        <span class="text-lg">${v.icon}</span>
                        <span class="text-[8px] font-bold mt-1 uppercase tracking-tighter">${v.label}</span>
                    </button>
                `).join('')}
            </div>
        `;
    }

    renderScramble(q) {
        if (!this.gameState.scrambledWords || (this.gameState.scrambledWords.length === 0 && this.gameState.userWords.length === 0)) {
            this.gameState.scrambledWords = [...q.answer].sort(() => Math.random() - 0.5);
            this.gameState.userWords = [];
        }

        return `
            <div class="space-y-6 animate-slide-up">
                <!-- Drop Zone -->
                <div class="min-h-[120px] p-6 bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-wrap gap-2 items-center justify-center shadow-inner group transition-all hover:bg-white hover:border-primary/30">
                    ${this.gameState.userWords.map((word, idx) => `
                        <button onclick="app.handleScrambleClick(${idx}, true)" 
                                class="px-5 py-3 bg-primary text-white rounded-2xl font-black shadow-lg transform transition active:scale-90 animate-bounce-in border-b-4 border-primary-dark">
                            ${word}
                        </button>
                    `).join('')}
                    ${this.gameState.userWords.length === 0 ? '<span class="text-gray-300 font-bold uppercase tracking-widest text-[10px]">Arrange words here</span>' : ''}
                </div>

                <!-- Word Bank -->
                <div class="flex flex-wrap gap-2 justify-center">
                    ${this.gameState.scrambledWords.map((word, idx) => `
                        <button onclick="app.handleScrambleClick(${idx}, false)" 
                                class="px-4 py-3 bg-white border-2 border-gray-100 rounded-2xl font-bold text-gray-700 shadow-sm transform transition hover:border-primary hover:text-primary active:scale-90 border-b-4 border-gray-200">
                            ${word}
                        </button>
                    `).join('')}
                </div>

                <div class="pt-4 flex space-x-3">
                    <button onclick="app.checkScrambleAnswer()" 
                            class="flex-1 bg-primary text-white font-black py-4 rounded-3xl shadow-xl active:scale-95 transition-all text-sm tracking-widest ${this.gameState.userWords.length === q.answer.length ? 'opacity-100 scale-100' : 'opacity-30 pointer-events-none scale-95'} ">
                        CHECK ANSWER
                    </button>
                    ${this.gameState.userWords.length > 0 ? `
                        <button onclick="app.gameState.userWords=[]; app.renderBattleQuestion()" class="px-6 bg-gray-100 text-gray-400 rounded-3xl font-bold hover:bg-gray-200 transition">↺</button>
                    ` : ''}
                </div>
            </div>
        `;
    }

    renderVerbRace(q) {
        return q.options.map((opt, idx) => `
            <button onclick="app.handleMCQClick(this)" data-answer="${String(opt).replace(/"/g, "&quot;")}" 
                class="w-full p-5 rounded-[2rem] border-2 border-gray-100 hover:border-secondary hover:bg-secondary/5 text-lg font-bold transition active:scale-95 animate-slide-up bg-white group"
                style="animation-delay: ${idx * 0.1}s">
                <div class="flex justify-between items-center">
                    <span>${opt}</span>
                    <span class="opacity-0 group-hover:opacity-100 transition-opacity">🏃‍♂️</span>
                </div>
            </button>
        `).join('');
    }

    handleScrambleClick(index, isFromUser) {
        if (isFromUser) {
            const word = this.gameState.userWords.splice(index, 1)[0];
            this.gameState.scrambledWords.push(word);
        } else {
            const word = this.gameState.scrambledWords.splice(index, 1)[0];
            this.gameState.userWords.push(word);
        }

        if (this.gameState && this.gameState.isBattle) {
            this.renderBattleQuestion();
        } else {
            this.renderQuestion();
        }
    }

    handleMCQClick(btn) {
        if (this.gameState && this.gameState.isBattle) {
            this.checkBattleAnswer(btn.getAttribute('data-answer'));
        } else {
            this.checkAnswer(btn.getAttribute('data-answer'));
        }
    }

    checkScrambleAnswer() {
        const q = this.gameState.questions[this.gameState.currentIndex];
        const isCorrect = JSON.stringify(this.gameState.userWords) === JSON.stringify(q.answer);

        // Reset scramble state for next time to null so it re-initializes
        this.gameState.scrambledWords = null;
        this.gameState.userWords = [];

        if (this.gameState && this.gameState.isBattle) {
            this.checkBattleAnswer(isCorrect ? q.answer.join(' ') : 'wrong');
        } else {
            this.checkAnswer(isCorrect ? q.answer.join(' ') : 'wrong', isCorrect);
        }
    }

    renderMatchPairs(q) {
        if (!this.gameState.matchingData) {
            this.gameState.matchingData = {
                leftItems: null,
                rightItems: null,
                selectedLeft: null,
                selectedRight: null,
                matchedPairs: []
            };
        }

        if (!this.gameState.matchingData.leftItems) {
            const leftItems = q.pairs.map(p => ({ id: Math.random(), text: p.english, matchId: p.english }));
            const rightItems = q.pairs.map(p => ({ id: Math.random(), text: p.urdu, matchId: p.english }));
            this.gameState.matchingData.leftItems = leftItems.sort(() => Math.random() - 0.5);
            this.gameState.matchingData.rightItems = rightItems.sort(() => Math.random() - 0.5);
        }

        const { selectedLeft, selectedRight, matchedPairs } = this.gameState.matchingData;

        return `
                <div class="space-y-6">
                <p class="text-center text-gray-500 text-sm">Match English to Urdu</p>
                <div class="grid grid-cols-2 gap-4">
                    <!-- Left Column (English) -->
                    <div class="space-y-3">
                        ${this.gameState.matchingData.leftItems.map(item => {
            const isMatched = matchedPairs.includes(item.matchId);
            return `
                                <button onclick="${isMatched ? '' : 'app.handleMatchClick(this)'}"
                                        data-match-id="${item.matchId.replace(/"/g, "&quot;")}" data-side="left"
                                        class="w-full p-4 rounded-xl border-2 text-sm transition-all
                                        ${isMatched ? 'bg-success/20 border-success text-success opacity-50' :
                    selectedLeft === item.matchId ? 'border-primary bg-primary/5 text-primary scale-95' : 'border-gray-100 text-gray-700 bg-white shadow-sm'}">
                                    ${item.text}
                                </button>
                            `;
        }).join('')}
                    </div>

                    <!-- Right Column (Urdu) -->
                    <div class="space-y-3">
                        ${this.gameState.matchingData.rightItems.map(item => {
            const isMatched = matchedPairs.includes(item.matchId);
            return `
                                <button onclick="${isMatched ? '' : 'app.handleMatchClick(this)'}"
                                        data-match-id="${item.matchId.replace(/"/g, "&quot;")}" data-side="right"
                                        class="w-full p-4 rounded-xl border-2 text-right text-sm font-urdu transition-all
                                        ${isMatched ? 'bg-success/20 border-success text-success opacity-50' :
                    selectedRight === item.matchId ? 'border-primary bg-primary/5 text-primary scale-95' : 'border-gray-100 text-gray-800 bg-white shadow-sm'}">
                                    ${item.text}
                                </button>
                            `;
        }).join('')}
                    </div>
                </div>

                ${matchedPairs.length === q.pairs.length ? `
                    <button onclick="app.checkAnswer('all matched', true)" class="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition animate-bounce-in">
                        Continue
                    </button>
                ` : ''
            }
            </div >
                `;
    }

    handleMatchClick(target) {
        let matchId, side;
        if (typeof target === 'string') {
            matchId = target;
            side = arguments[1];
        } else {
            matchId = target.getAttribute('data-match-id');
            side = target.getAttribute('data-side');
        }

        if (side === 'left') {
            this.gameState.matchingData.selectedLeft = matchId;
        } else {
            this.gameState.matchingData.selectedRight = matchId;
        }

        if (this.gameState.matchingData.selectedLeft && this.gameState.matchingData.selectedRight) {
            if (this.gameState.matchingData.selectedLeft === this.gameState.matchingData.selectedRight) {
                this.gameState.matchingData.matchedPairs.push(this.gameState.matchingData.selectedLeft);
                // Visual feedback could be added here
            } else {
                // Shake effect or reset
            }
            this.gameState.matchingData.selectedLeft = null;
            this.gameState.matchingData.selectedRight = null;
        }

        if (this.gameState && this.gameState.isBattle) {
            this.renderBattleQuestion();
        } else {
            this.renderQuestion();
        }
    }
}

// Start the app
window.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
