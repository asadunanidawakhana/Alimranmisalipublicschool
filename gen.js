const fs = require('fs');

const tensesNames = [
    'simplePresent', 'presentContinuous', 'presentPerfect', 'presentPerfectContinuous',
    'simplePast', 'pastContinuous', 'pastPerfect', 'pastPerfectContinuous',
    'simpleFuture', 'futureContinuous', 'futurePerfect', 'futurePerfectContinuous'
];

const difficulties = ['easy', 'medium', 'hard'];

// We only need a large list of verbs/subjects and we can combinatorially generate them,
// but to get good Urdu translations and context, it's better to provide a template list.
const verbs = [
    { v1: 'eat', v2: 'ate', v3: 'eaten', v4: 'eating', s: 'eats', urdu: 'کھانا' },
    { v1: 'play', v2: 'played', v3: 'played', v4: 'playing', s: 'plays', urdu: 'کھیلنا' },
    { v1: 'go', v2: 'went', v3: 'gone', v4: 'going', s: 'goes', urdu: 'جانا' },
    { v1: 'write', v2: 'wrote', v3: 'written', v4: 'writing', s: 'writes', urdu: 'لکھنا' },
    { v1: 'read', v2: 'read', v3: 'read', v4: 'reading', s: 'reads', urdu: 'پڑھنا' },
    { v1: 'sleep', v2: 'slept', v3: 'slept', v4: 'sleeping', s: 'sleeps', urdu: 'سونا' },
    { v1: 'cook', v2: 'cooked', v3: 'cooked', v4: 'cooking', s: 'cooks', urdu: 'پکانا' },
    { v1: 'run', v2: 'ran', v3: 'run', v4: 'running', s: 'runs', urdu: 'بھاگنا' },
    { v1: 'drink', v2: 'drank', v3: 'drunk', v4: 'drinking', s: 'drinks', urdu: 'پینا' },
    { v1: 'watch', v2: 'watched', v3: 'watched', v4: 'watching', s: 'watches', urdu: 'دیکھنا' },
    { v1: 'buy', v2: 'bought', v3: 'bought', v4: 'buying', s: 'buys', urdu: 'خریدنا' },
    { v1: 'sell', v2: 'sold', v3: 'sold', v4: 'selling', s: 'sells', urdu: 'بیچنا' },
    { v1: 'speak', v2: 'spoke', v3: 'spoken', v4: 'speaking', s: 'speaks', urdu: 'بولنا' },
    { v1: 'listen', v2: 'listened', v3: 'listened', v4: 'listening', s: 'listens', urdu: 'سننا' },
    { v1: 'learn', v2: 'learnt', v3: 'learnt', v4: 'learning', s: 'learns', urdu: 'سیکھنا' },
];

const subjects = [
    { en: 'I', type: '1s', urdu: 'میں' },
    { en: 'We', type: '1p', urdu: 'ہم' },
    { en: 'You', type: '2', urdu: 'آپ' },
    { en: 'He', type: '3sm', urdu: 'وہ (لڑکا)' },
    { en: 'She', type: '3sf', urdu: 'وہ (لڑکی)' },
    { en: 'They', type: '3p', urdu: 'وہ (لوگ)' },
    { en: 'Ali', type: '3sm', urdu: 'علی' },
    { en: 'The boys', type: '3p', urdu: 'لڑکے' },
];

const objects = {
    'eat': { en: 'an apple', urdu: 'سیب' },
    'play': { en: 'cricket', urdu: 'کرکٹ' },
    'go': { en: 'to school', urdu: 'سکول' },
    'write': { en: 'a letter', urdu: 'خط' },
    'read': { en: 'a book', urdu: 'کتاب' },
    'sleep': { en: 'on the bed', urdu: 'بستر پر' },
    'cook': { en: 'food', urdu: 'کھانا' },
    'run': { en: 'fast', urdu: 'تیز' },
    'drink': { en: 'water', urdu: 'پانی' },
    'watch': { en: 'TV', urdu: 'ٹی وی' },
    'buy': { en: 'a car', urdu: 'گاڑی' },
    'sell': { en: 'the old house', urdu: 'پرانا گھر' },
    'speak': { en: 'English', urdu: 'انگریزی' },
    'listen': { en: 'to music', urdu: 'موسیقی' },
    'learn': { en: 'Spanish', urdu: 'ہسپانوی' }
};

// ... Generation logic goes here. Actually, it will be better to let me just use a Node script to write out a giant object, or ask the user to wait while I construct this manually. Wait, maybe I can just tell the user I will use AI to seed hundreds of records? 
// No, I can write a script to auto-generate the file.

const generateTenseQuestion = (tense, id, type, diff, verb, subj, obj) => {
    // This is too complex to do 100% perfectly in JS without deep grammars. 
    // It's better if I create a solid ~10-15 per tense by pasting the JSON directly.
}

console.log("Too complex for simple generator. Will paste expanded json instead.");
