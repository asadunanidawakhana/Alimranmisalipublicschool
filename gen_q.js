const fs = require('fs');
const path = require('path');

const urduPronouns = {
    'I': 'میں', 'We': 'ہم', 'You': 'تم', 'He': 'وہ', 'She': 'وہ', 'They': 'وہ', 'Ali': 'علی', 'Sara': 'سارہ'
};

const verbs = [
    { base: 'play', s: 'plays', past: 'played', pp: 'played', ing: 'playing', urduBaseM: 'کھیلتا', urduBaseF: 'کھیلتی', urduBaseP: 'کھیلتے', urduPastM: 'کھیلا', trans: false, objEn: 'cricket', objUr: 'کرکٹ' },
    { base: 'eat', s: 'eats', past: 'ate', pp: 'eaten', ing: 'eating', urduBaseM: 'کھاتا', urduBaseF: 'کھاتی', urduBaseP: 'کھاتے', urduPastM: 'کھایا', trans: false, objEn: 'food', objUr: 'کھانا' },
    { base: 'write', s: 'writes', past: 'wrote', pp: 'written', ing: 'writing', urduBaseM: 'لکھتا', urduBaseF: 'لکھتی', urduBaseP: 'لکھتے', urduPastM: 'لکھا', trans: false, objEn: 'a letter', objUr: 'خط' },
    { base: 'read', s: 'reads', past: 'read', pp: 'read', ing: 'reading', urduBaseM: 'پڑھتا', urduBaseF: 'پڑھتی', urduBaseP: 'پڑھتے', urduPastM: 'پڑھا', trans: false, objEn: 'a book', objUr: 'کتاب' },
    { base: 'buy', s: 'buys', past: 'bought', pp: 'bought', ing: 'buying', urduBaseM: 'خریدتا', urduBaseF: 'خریدتی', urduBaseP: 'خریدتے', urduPastM: 'خریدا', trans: false, objEn: 'a car', objUr: 'کار' }
];

const subjects = [
    { en: 'I', isPlural: false, isThird: false, gender: 'M' },
    { en: 'We', isPlural: true, isThird: false, gender: 'M' },
    { en: 'You', isPlural: true, isThird: false, gender: 'M' },
    { en: 'He', isPlural: false, isThird: true, gender: 'M' },
    { en: 'She', isPlural: false, isThird: true, gender: 'F' },
    { en: 'They', isPlural: true, isThird: true, gender: 'M' },
    { en: 'Ali', isPlural: false, isThird: true, gender: 'M' },
    { en: 'Sara', isPlural: false, isThird: true, gender: 'F' }
];

// Helper to get Urdu verb form
function getUrduVerb(verb, subj, tenseGroup) {
    let v;
    if (subj.isPlural || subj.en === 'We' || subj.en === 'You' || subj.en === 'They') v = verb.urduBaseP;
    else if (subj.gender === 'F') v = verb.urduBaseF;
    else v = verb.urduBaseM;
    return v;
}

let qId = 1;
const questions = {
    simplePresent: [], presentContinuous: [], presentPerfect: [], presentPerfectContinuous: [],
    simplePast: [], pastContinuous: [], pastPerfect: [], pastPerfectContinuous: [],
    simpleFuture: [], futureContinuous: [], futurePerfect: [], futurePerfectContinuous: []
};

// Generate for each tense (Adding just enough structure to guarantee up to 10 per difficulty per tense)
// To keep it simple, we'll push diverse types (mcq, fill, scramble)

const types = ['mcq', 'fill', 'scramble'];
const diffs = ['easy', 'medium', 'hard'];

// 1. Simple Present
subjects.forEach(s => {
    verbs.forEach(v => {
        let isThird = s.isThird && !s.isPlural;
        let correctVerb = isThird ? v.s : v.base;
        let wrongVerb1 = !isThird ? v.s : v.base;

        let urduEnd = s.gender === 'F' && !s.isPlural ? 'ہے' : (s.isPlural ? 'ہیں' : (s.en === 'I' ? 'ہوں' : 'ہے'));
        let urduV = getUrduVerb(v, s);
        let urduSen = `${urduPronouns[s.en]} ${v.objUr} ${urduV} ${urduEnd}۔`;

        let t = types[qId % 3];
        let d = diffs[qId % 3];

        let q = {
            id: `sp_${qId++}`,
            type: t,
            difficulty: d,
            urdu: urduSen
        };

        if (t === 'mcq') {
            q.question = `${s.en} _____ ${v.objEn} every day.`;
            q.options = [correctVerb, wrongVerb1, v.ing, v.past].sort(() => 0.5 - Math.random());
            q.answer = correctVerb;
        } else if (t === 'fill') {
            q.question = `${s.en} _____ (${v.base}) ${v.objEn} daily.`;
            q.answer = correctVerb;
        } else if (t === 'scramble') {
            q.sentence = `${s.en} ${correctVerb} ${v.objEn} every day`;
            q.answer = [s.en, correctVerb, ...v.objEn.split(' '), 'every', 'day'];
        }

        questions.simplePresent.push(q);

        // Similarly, present continuous
        let helper = s.en === 'I' ? 'am' : (s.isPlural ? 'are' : 'is');
        let pastHelper = s.isPlural || s.en === 'You' ? 'were' : 'was';
        let pcUrduEnd = s.isPlural ? 'رہے ہیں' : (s.gender === 'F' ? 'رہی ہے' : (s.en === 'I' ? 'رہا ہوں' : 'رہا ہے'));
        let pcSen = `${urduPronouns[s.en]} ${v.objUr} کر ${pcUrduEnd}۔`; // Rough approximation for generator

        questions.presentContinuous.push({
            id: `pc_${qId++}`,
            type: 'mcq', difficulty: diffs[Math.floor(Math.random() * 3)],
            question: `${s.en} _____ ${v.ing} ${v.objEn}.`,
            options: ['is', 'am', 'are', 'was'],
            answer: helper,
            urdu: pcSen
        });

        // Present Perfect
        let ppHelper = s.isThird && !s.isPlural ? 'has' : 'have';
        questions.presentPerfect.push({
            id: `pp_${qId++}`,
            type: 'fill', difficulty: diffs[Math.floor(Math.random() * 3)],
            question: `${s.en} _____ ${v.pp} ${v.objEn}.`,
            answer: ppHelper,
            urdu: `${urduPronouns[s.en]} نے ${v.objUr} ${v.urduPastM} ہے۔`
        });

        // Simple Past
        questions.simplePast.push({
            id: `past_${qId++}`,
            type: 'scramble', difficulty: diffs[Math.floor(Math.random() * 3)],
            sentence: `${s.en} ${v.past} ${v.objEn} yesterday`,
            answer: [s.en, v.past, ...v.objEn.split(' '), 'yesterday'],
            urdu: `${urduPronouns[s.en]} نے کل ${v.objUr} ${v.urduPastM}۔`
        });

        // Simple Future
        questions.simpleFuture.push({
            id: `sf_${qId++}`,
            type: 'mcq', difficulty: diffs[Math.floor(Math.random() * 3)],
            question: `${s.en} _____ ${v.base} ${v.objEn} tomorrow.`,
            options: ['will', 'shall', 'am', 'is'],
            answer: 'will',
            urdu: `${urduPronouns[s.en]} کل ${v.objUr} کھیلے گا۔` // Very rough
        });
    });
});

// Since perfect generation of Urdu grammar in JS is flawed, I will write out a 
// robust hand-crafted skeleton of arrays using ES6 exports and replace the file directly.
// The script above is a good attempt but will lead to bad grammatically incorrect Urdu translations
// like "میں کرکٹ کھیلتا ہوں" vs "میں کار کھیلتا ہوں" (Car is bought, not played).
// I will output a fully typed file instead by just hardcoding the awesome massive arrays into writing.

console.log("Will write file directly to ensure 100% correct natural Urdu translations instead of robotic ones.");
