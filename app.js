/**
 * AL IMRAN TENSE LEARNER - App Router
 * Orchestrates component rendering and navigation
 */

import { store } from './js/store.js';
import { tenses } from './js/data/tenses.js';
import { questions } from './js/data/questions.js';
import { badges } from './js/data/badges.js';

class App {
    constructor() {
        this.container = document.getElementById('app');
        this.currentView = null;
        this.gameState = {
            isTest: false,
            tenseId: null,
            questions: [],
            currentIndex: 0,
            score: 0,
            lives: 5,
            xpEarned: 0
        };
        this.init();
    }

    async init() {
        // Show Splash Screen first
        await this.showSplash();

        // Check if user has completed onboarding
        if (!store.data.user.name) {
            this.navigate('onboarding');
        } else {
            this.navigate('home');
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

    navigate(view, params = {}) {
        window.history.pushState({ view, params }, '', `#${view}`);
        this.renderView(view, params);
    }

    async renderView(view, params, storeInHistory = true) {
        this.currentView = view;
        this.container.innerHTML = '';

        switch (view) {
            case 'onboarding':
                await this.renderOnboarding();
                break;
            case 'home':
                await this.renderHome();
                break;
            case 'learn':
                await this.renderLearn();
                break;
            case 'tense-detail':
                await this.renderTenseDetail(params.id);
                break;
            case 'game':
                await this.startGame(params.id);
                break;
            case 'test':
                await this.renderTest();
                break;
            case 'profile':
                await this.renderProfile();
                break;
            default:
                this.container.innerHTML = `<div class="p-10 text-center">View "${view}" coming soon!</div>`;
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
                store.updateUser({ name });
                this.navigate('home');
            } else {
                alert('Please enter your name');
            }
        };
    }

    async renderHome() {
        this.container.innerHTML = `
            <div class="flex flex-col min-h-screen bg-soft-gray animate-fade-in pb-24">
                <!-- Header -->
                <div class="bg-white p-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-bold">
                            ${store.data.user.name[0].toUpperCase()}
                        </div>
                        <div>
                            <p class="text-xs text-gray-500">Welcome back,</p>
                            <p class="font-bold text-gray-800">${store.data.user.name}</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <div class="flex items-center space-x-1">
                            <span class="text-orange-500">🔥</span>
                            <span class="font-bold">${store.data.user.streak}</span>
                        </div>
                        <div class="flex items-center space-x-1">
                            <span class="text-yellow-500 font-bold">Lvl ${store.data.user.level}</span>
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
                            <button class="text-primary text-sm font-bold" onclick="app.navigate('learn')">See all</button>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center cursor-pointer active:scale-95 transition" onclick="app.navigate('tense-detail', {id: 'simplePresent'})">
                                <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 text-xl font-bold mb-3">P</div>
                                <p class="font-bold text-sm">Present</p>
                                <p class="text-[10px] text-gray-500">${store.data.progress.tenses.simplePresent}% Complete</p>
                            </div>
                            <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center cursor-pointer active:scale-95 transition" onclick="app.navigate('tense-detail', {id: 'simplePast'})">
                                <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 text-xl font-bold mb-3">P</div>
                                <p class="font-bold text-sm">Past</p>
                                <p class="text-[10px] text-gray-500">${store.data.progress.tenses.simplePast}% Complete</p>
                            </div>
                        </div>
                    </div>
                </div>

                ${this.getBottomNav()}
            </div>
        `;
    }

    async renderLearn() {
        this.container.innerHTML = `
            <div class="flex flex-col min-h-screen bg-soft-gray animate-fade-in pb-24">
                <div class="bg-white p-4 flex items-center space-x-4 shadow-sm sticky top-0 z-10">
                    <button onclick="app.navigate('home')" class="p-2 -ml-2">←</button>
                    <h2 class="text-xl font-bold">Tense Learning</h2>
                </div>
                
                <div class="p-4 grid grid-cols-1 gap-4 overflow-y-auto">
                    ${Object.values(tenses).map(tense => `
                        <div class="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer active:scale-95 transition" onclick="app.navigate('tense-detail', {id: '${tense.id}'})">
                            <div class="flex items-center space-x-4">
                                <div class="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-xl font-bold">
                                    ${tense.name[0]}
                                </div>
                                <div>
                                    <h3 class="font-bold text-gray-800">${tense.name}</h3>
                                    <p class="text-xs text-gray-500">${tense.urduName}</p>
                                </div>
                            </div>
                            <div class="flex flex-col items-end">
                                <div class="text-sm font-bold text-primary">${store.data.progress.tenses[tense.id] || 0}%</div>
                                <div class="w-16 bg-gray-100 h-1.5 rounded-full mt-1 overflow-hidden">
                                    <div class="bg-primary h-full" style="width: ${store.data.progress.tenses[tense.id] || 0}%"></div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                ${this.getBottomNav()}
            </div>
        `;
    }

    async renderTenseDetail(id) {
        const tense = tenses[id];
        if (!tense) return this.navigate('learn');

        this.container.innerHTML = `
            <div class="flex flex-col min-h-screen bg-soft-gray animate-fade-in pb-24">
                <div class="bg-white p-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
                    <div class="flex items-center space-x-4">
                        <button onclick="app.navigate('learn')" class="p-2 -ml-2">←</button>
                        <div>
                            <h2 class="text-lg font-bold leading-none">${tense.name}</h2>
                            <p class="text-xs text-gray-500">${tense.urduName}</p>
                        </div>
                    </div>
                </div>

                <div class="p-4 space-y-6 overflow-y-auto">
                    <!-- Formula Card -->
                    <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Formula</h3>
                        <p class="text-2xl font-bold text-primary">${tense.formula}</p>
                    </div>

                    <!-- Tabs -->
                    <div class="flex bg-gray-200 p-1 rounded-2xl">
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
                    <button onclick="app.navigate('game', {id: '${tense.id}'})" class="w-full bg-secondary text-white font-bold py-4 rounded-3xl shadow-lg active:scale-95 transition">
                        Practice Game / گیم کھیلیں
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
                            <button onclick="app.speak('${ex.english.replace(/'/g, "\\'")}')" class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-xl active:scale-90 transition">🔊</button>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }

    speak(text) {
        const synth = window.speechSynthesis;
        const utter = new SpeechSynthesisUtterance(text);
        utter.rate = 0.9;
        synth.speak(utter);
    }

    async startGame(tenseId) {
        let tenseQuestions = [...(questions[tenseId] || [])];

        // Dynamically add questions from examples to increase variety
        const dynamicQuestions = this.generateDynamicQuestions(tenseId);
        tenseQuestions = [...tenseQuestions, ...dynamicQuestions];

        if (tenseQuestions.length === 0) {
            alert('No questions available for this tense yet!');
            return this.navigate('tense-detail', { id: tenseId });
        }

        this.gameState = {
            isTest: false,
            tenseId,
            // Shuffle all questions
            questions: tenseQuestions.sort(() => Math.random() - 0.5),
            currentIndex: 0,
            score: 0,
            lives: 5,
            xpEarned: 0
        };

        this.renderQuestion();
    }

    generateDynamicQuestions(tenseId) {
        const tenseData = tenses[tenseId];
        if (!tenseData || !tenseData.examples) return [];

        return tenseData.examples.map((ex, index) => {
            return {
                id: `dynamic_${tenseId}_${index}`,
                type: 'mcq',
                question: `Complete the sentence: "${ex.urdu}"`,
                options: this.generateOptions(ex.english, tenseId),
                answer: ex.english,
                urdu: ex.urdu,
                isDynamic: true
            };
        });
    }

    generateOptions(correctAnswer, tenseId) {
        const options = [correctAnswer];
        const otherExamples = Object.values(tenses)
            .flatMap(t => t.examples)
            .filter(ex => ex.english !== correctAnswer);

        // Pick 3 random distractors from other examples
        const distractors = [...otherExamples]
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(ex => ex.english);

        return [...options, ...distractors].sort(() => Math.random() - 0.5);
    }

    async startTest() {
        // Collect all questions from all tenses for a comprehensive test
        let allQuestions = [];
        Object.keys(tenses).forEach(tenseId => {
            const q = questions[tenseId] || [];
            const dq = this.generateDynamicQuestions(tenseId);
            allQuestions = [...allQuestions, ...q, ...dq];
        });

        if (allQuestions.length === 0) {
            alert('Learn some tenses first to start a test!');
            return;
        }

        // Shuffle and take top 10 for a quick test
        const testPool = allQuestions.sort(() => Math.random() - 0.5).slice(0, 10);

        this.gameState = {
            isTest: true,
            tenseId: 'Mixed Test',
            questions: testPool,
            currentIndex: 0,
            score: 0,
            lives: Infinity, // No lives limit in test mode
            xpEarned: 0
        };

        this.renderQuestion();
    }

    renderQuestion() {
        const q = this.gameState.questions[this.gameState.currentIndex];
        const progress = ((this.gameState.currentIndex) / this.gameState.questions.length) * 100;

        this.container.innerHTML = `
            <div class="flex flex-col min-h-screen bg-white animate-fade-in">
                <!-- Game Header -->
                <div class="p-4 flex items-center justify-between">
                    <button onclick="app.navigate(app.gameState.isTest ? 'test' : 'tense-detail', {id: '${this.gameState.tenseId}'})" class="text-2xl p-2">✕</button>
                    <div class="flex-1 mx-4">
                        <div class="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                            <div class="bg-success h-full transition-all duration-500" style="width: ${progress}%"></div>
                        </div>
                    </div>
                    <div class="flex items-center space-x-1">
                        ${this.gameState.isTest ? '<span class="text-primary font-bold">TEST MODE</span>' : `
                        <span class="text-error text-xl">❤️</span>
                        <span class="font-bold">${this.gameState.lives}</span>
                        `}
                    </div>
                </div>

                <!-- Question Area -->
                <div class="flex-1 p-6 flex flex-col items-center justify-center text-center">
                    <p class="text-gray-400 text-sm font-bold mb-2 uppercase tracking-widest">Question ${this.gameState.currentIndex + 1} of ${this.gameState.questions.length}</p>
                    <h2 class="text-2xl font-bold mb-4">${q.question}</h2>
                    <p class="text-gray-500 font-urdu border-t pt-4 w-full">${q.urdu}</p>
                    <button onclick="app.speak('${q.question.replace(/'/g, "\\'")}')" class="mt-4 w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-xl">🔊</button>
                </div>

                <!-- Answer Options -->
                <div class="p-6 space-y-3 pb-12">
                    ${q.type === 'mcq' ?
                q.options.map(opt => `
                            <button onclick="app.checkAnswer('${opt.replace(/'/g, "\\'")}')" class="w-full p-4 rounded-2xl border-2 border-gray-100 hover:border-primary hover:bg-primary/5 text-lg font-medium transition active:scale-95">
                                ${opt}
                            </button>
                        `).join('') :
                `
                        <div class="flex flex-col space-y-4">
                            <input type="text" id="fill-answer" class="w-full p-4 rounded-2xl border-2 border-primary text-center text-xl font-bold focus:ring-4 focus:ring-primary/20 outline-none" placeholder="Type answer here..." autofocus>
                            <button onclick="app.checkAnswer(document.getElementById('fill-answer').value)" class="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg">Check Answer</button>
                        </div>
                        `
            }
                </div>
            </div>
        `;

        if (q.type === 'fill') {
            document.getElementById('fill-answer').onkeypress = (e) => {
                if (e.key === 'Enter') app.checkAnswer(e.target.value);
            };
        }
    }

    checkAnswer(userAnswer) {
        const q = this.gameState.questions[this.gameState.currentIndex];
        const isCorrect = userAnswer.toLowerCase().trim() === q.answer.toLowerCase().trim();

        if (isCorrect) {
            this.gameState.score++;
            this.gameState.xpEarned += (this.gameState.isTest ? 20 : 10);
            this.showFeedback(true, q.answer);
        } else {
            if (!this.gameState.isTest) this.gameState.lives--;
            this.showFeedback(false, q.answer);
        }
    }

    showFeedback(isCorrect, correctAnswer) {
        const overlay = document.createElement('div');
        overlay.className = `fixed inset-0 z-50 flex items-end justify-center p-4 animate-slide-up`;
        overlay.innerHTML = `
            <div class="w-full max-w-md ${isCorrect ? 'bg-success' : 'bg-error'} p-6 rounded-3xl text-white shadow-2xl mb-4">
                <div class="flex items-center space-x-4 mb-4">
                    <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">
                        ${isCorrect ? '✓' : '✕'}
                    </div>
                    <div>
                        <h3 class="text-xl font-bold">${isCorrect ? 'Excellent!' : 'Correct Answer:'}</h3>
                        <p class="font-bold opacity-90">${isCorrect ? (this.gameState.isTest ? '+20 XP' : '+10 XP') : correctAnswer}</p>
                    </div>
                </div>
                <button id="next-q" class="w-full bg-white ${isCorrect ? 'text-success' : 'text-error'} font-bold py-4 rounded-2xl shadow-md active:scale-95 transition">
                    CONTINUE
                </button>
            </div>
        `;
        document.body.appendChild(overlay);

        document.getElementById('next-q').onclick = () => {
            overlay.remove();
            if (this.gameState.lives <= 0 && !this.gameState.isTest) {
                this.endGame(false);
            } else if (this.gameState.currentIndex >= this.gameState.questions.length - 1) {
                this.endGame(true);
            } else {
                this.gameState.currentIndex++;
                this.renderQuestion();
            }
        };
    }

    async endGame(completed) {
        // Update store
        if (this.gameState.xpEarned > 0) {
            store.addXP(this.gameState.xpEarned);
        }

        if (!this.gameState.isTest) {
            const masteryBoost = completed ? 20 : 0;
            const currentProgress = store.data.progress.tenses[this.gameState.tenseId] || 0;
            store.updateProgress('tenses', this.gameState.tenseId, Math.min(100, currentProgress + masteryBoost));
        }

        this.container.innerHTML = `
            <div class="flex flex-col min-h-screen bg-white animate-fade-in p-6 items-center justify-center text-center">
                <div class="text-6xl mb-6">${completed ? (this.gameState.isTest ? '📜' : '🏆') : '💔'}</div>
                <h2 class="text-3xl font-bold mb-2">${completed ? (this.gameState.isTest ? 'Test Complete!' : 'Tense Mastery!') : 'Game Over'}</h2>
                <p class="text-gray-500 mb-8">${completed ? 'You finished the session!' : 'Better luck next time!'}</p>
                
                <div class="w-full bg-soft-gray rounded-3xl p-6 mb-8 space-y-4">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-500">Correct Answers</span>
                        <span class="font-bold text-success">${this.gameState.score} / ${this.gameState.questions.length}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-500">XP Earned</span>
                        <span class="font-bold text-primary">+${this.gameState.xpEarned} XP</span>
                    </div>
                </div>

                <div class="w-full space-y-3">
                    <button onclick="app.navigate('home')" class="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg">Back to Home</button>
                    <button onclick="app.navigate('${this.gameState.isTest ? 'test' : 'learn'}')" class="w-full border-2 border-gray-100 text-gray-400 font-bold py-4 rounded-2xl">Return to Section</button>
                </div>
            </div>
        `;
    }

    async renderProfile() {
        this.container.innerHTML = `
            <div class="flex flex-col min-h-screen bg-soft-gray animate-fade-in pb-24">
                <!-- Profile Header -->
                <div class="bg-primary pt-12 pb-24 px-6 relative">
                    <div class="flex items-center space-x-4 text-white">
                        <div class="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-primary text-3xl font-bold shadow-xl">
                            ${store.data.user.name[0].toUpperCase()}
                        </div>
                        <div>
                            <h2 class="text-2xl font-bold">${store.data.user.name}</h2>
                            <p class="opacity-80">Level ${store.data.user.level} Learner</p>
                        </div>
                    </div>
                </div>

                <!-- Stats Cards -->
                <div class="px-4 -mt-16 space-y-4 overflow-y-auto">
                    <div class="bg-white rounded-3xl p-6 shadow-lg grid grid-cols-2 gap-4">
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

                    <!-- Badges -->
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

    async renderTest() {
        this.container.innerHTML = `
            <div class="flex flex-col min-h-screen bg-soft-gray animate-fade-in pb-24">
                <div class="bg-white p-4 shadow-sm sticky top-0 z-10 text-center">
                    <h2 class="text-xl font-bold">Daily Test</h2>
                </div>

                <div class="p-6 flex-1 flex flex-col items-center justify-center text-center">
                    <div class="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary text-4xl mb-6">📝</div>
                    <h3 class="text-2xl font-bold mb-2">Ready for Daily Test?</h3>
                    <p class="text-gray-500 mb-8 px-6">Mixed random questions from all tenses. No hints allowed!</p>
                    
                    <div class="w-full space-y-4">
                        <div class="bg-white p-4 rounded-3xl flex items-center justify-between border border-gray-100">
                            <span class="text-gray-500">Number of Questions</span>
                            <span class="font-bold">5</span>
                        </div>
                        <div class="bg-white p-4 rounded-3xl flex items-center justify-between border border-gray-100">
                            <span class="text-gray-500">Reward</span>
                            <span class="font-bold text-success">+100 XP</span>
                        </div>
                    </div>
                </div>

                <div class="p-6">
                    <button onclick="app.startTest()" class="w-full bg-primary text-white font-bold py-5 rounded-3xl shadow-lg active:scale-95 transition text-lg">
                        START TEST / ٹیسٹ شروع کریں
                    </button>
                </div>

                ${this.getBottomNav()}
            </div>
        `;
    }

    getBottomNav() {
        const views = [
            { id: 'home', icon: '🏠', label: 'Home' },
            { id: 'learn', icon: '📚', label: 'Learn' },
            { id: 'test', icon: '📝', label: 'Tests' },
            { id: 'profile', icon: '👤', label: 'Profile' }
        ];

        return `
            <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-2 flex items-center justify-around z-20 shadow-[0_-5px_15px_-3px_rgba(0,0,0,0.05)]">
                ${views.map(v => `
                    <button class="flex flex-col items-center p-2 ${this.currentView === v.id ? 'text-primary' : 'text-gray-400'}" onclick="app.navigate('${v.id}')">
                        <span class="text-xl">${v.icon}</span>
                        <span class="text-[10px] font-bold">${v.label}</span>
                    </button>
                `).join('')}
            </div>
        `;
    }
}

// Start the app
window.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
