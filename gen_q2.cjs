const fs = require('fs');
const path = require('path');

// 10 base templates. We will conjugate these into 12 tenses x 3 difficulties
const templates = [
    {
        subjEn: 'I', objEn: 'cricket',
        vBase: 'play', vS: 'play', vPast: 'played', vIng: 'playing', vPp: 'played',
        urduSubj: 'میں', urduObj: 'کرکٹ', urduBase: 'کھیلتا', urduIng: 'کھیل رہا', urduPast: 'کھیلا',
        pGender: 'M', pPlural: false, pFirst: true
    },
    {
        subjEn: 'Sara', objEn: 'food',
        vBase: 'cook', vS: 'cooks', vPast: 'cooked', vIng: 'cooking', vPp: 'cooked',
        urduSubj: 'سارہ', urduObj: 'کھانا', urduBase: 'پکاتی', urduIng: 'پکا رہی', urduPast: 'پکایا',
        pGender: 'F', pPlural: false, pFirst: false
    },
    {
        subjEn: 'They', objEn: 'a letter',
        vBase: 'write', vS: 'write', vPast: 'wrote', vIng: 'writing', vPp: 'written',
        urduSubj: 'وہ', urduObj: 'خط', urduBase: 'لکھتے', urduIng: 'لکھ رہے', urduPast: 'لکھا',
        pGender: 'M', pPlural: true, pFirst: false
    },
    {
        subjEn: 'We', objEn: 'to school',
        vBase: 'go', vS: 'go', vPast: 'went', vIng: 'going', vPp: 'gone',
        urduSubj: 'ہم', urduObj: 'سکول', urduBase: 'جاتے', urduIng: 'جا رہے', urduPast: 'گئے',
        pGender: 'M', pPlural: true, pFirst: true
    },
    {
        subjEn: 'He', objEn: 'a book',
        vBase: 'read', vS: 'reads', vPast: 'read', vIng: 'reading', vPp: 'read',
        urduSubj: 'وہ', urduObj: 'کتاب', urduBase: 'پڑھتا', urduIng: 'پڑھ رہا', urduPast: 'پڑھا',
        pGender: 'M', pPlural: false, pFirst: false
    },
    {
        subjEn: 'You', objEn: 'water',
        vBase: 'drink', vS: 'drink', vPast: 'drank', vIng: 'drinking', vPp: 'drunk',
        urduSubj: 'تم', urduObj: 'پانی', urduBase: 'پیتے', urduIng: 'پی رہے', urduPast: 'پیا',
        pGender: 'M', pPlural: true, pFirst: false
    },
    {
        subjEn: 'Ali', objEn: 'a car',
        vBase: 'buy', vS: 'buys', vPast: 'bought', vIng: 'buying', vPp: 'bought',
        urduSubj: 'علی', urduObj: 'ایک کار', urduBase: 'خریدتا', urduIng: 'خرید رہا', urduPast: 'خریدی',
        pGender: 'M', pPlural: false, pFirst: false
    },
    {
        subjEn: 'The boys', objEn: 'a song',
        vBase: 'sing', vS: 'sing', vPast: 'sang', vIng: 'singing', vPp: 'sung',
        urduSubj: 'لڑکے', urduObj: 'گانا', urduBase: 'گاتے', urduIng: 'گا رہے', urduPast: 'گایا',
        pGender: 'M', pPlural: true, pFirst: false
    },
    {
        subjEn: 'I', objEn: 'my homework',
        vBase: 'finish', vS: 'finish', vPast: 'finished', vIng: 'finishing', vPp: 'finished',
        urduSubj: 'میں', urduObj: 'اپنا ہوم ورک', urduBase: 'ختم کرتا', urduIng: 'ختم کر رہا', urduPast: 'ختم کیا',
        pGender: 'M', pPlural: false, pFirst: true
    },
    {
        subjEn: 'She', objEn: 'the room',
        vBase: 'clean', vS: 'cleans', vPast: 'cleaned', vIng: 'cleaning', vPp: 'cleaned',
        urduSubj: 'وہ', urduObj: 'کمرہ', urduBase: 'صاف کرتی', urduIng: 'صاف کر رہی', urduPast: 'صاف کیا',
        pGender: 'F', pPlural: false, pFirst: false
    }
];

function getHelper(t, subjEn) {
    if (t === 'be_pres') return subjEn === 'I' ? 'am' : (['We', 'You', 'They', 'The boys'].includes(subjEn) ? 'are' : 'is');
    if (t === 'be_past') return ['We', 'You', 'They', 'The boys'].includes(subjEn) ? 'were' : 'was';
    if (t === 'have_pres') return ['I', 'We', 'You', 'They', 'The boys'].includes(subjEn) ? 'have' : 'has';
    return '';
}

function getUrduEnd(t, tpl) {
    // simplified urdu ends based on tense
    const p = tpl.pPlural;
    const f = tpl.pGender === 'F';
    const first = tpl.pFirst;

    if (t === 'pres') return p ? 'ہیں' : (first ? 'ہوں' : 'ہے');
    if (t === 'past') return p ? 'تھے' : (f ? 'تھی' : 'تھا');
    if (t === 'fut') return p ? 'گے' : (f ? 'گی' : 'گا');
    return '';
}

function generate() {
    let output = {
        simplePresent: [], presentContinuous: [], presentPerfect: [], presentPerfectContinuous: [],
        simplePast: [], pastContinuous: [], pastPerfect: [], pastPerfectContinuous: [],
        simpleFuture: [], futureContinuous: [], futurePerfect: [], futurePerfectContinuous: []
    };

    let qId = 1;

    templates.forEach(tpl => {
        // Simple Present
        output.simplePresent.push({
            id: `sp_${qId++}`, type: 'mcq', difficulty: 'easy',
            question: `${tpl.subjEn} _____ ${tpl.objEn}.`,
            options: [tpl.vS, tpl.vIng, tpl.vPast, tpl.vBase === tpl.vS ? tpl.vBase + 's' : tpl.vBase].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4),
            answer: tpl.vS,
            urdu: `${tpl.urduSubj} ${tpl.urduObj} ${tpl.urduBase} ${getUrduEnd('pres', tpl)}۔`
        });
        output.simplePresent.push({
            id: `sp_${qId++}`, type: 'scramble', difficulty: 'medium',
            sentence: `${tpl.subjEn} ${tpl.vS} ${tpl.objEn}`,
            answer: [tpl.subjEn, tpl.vS, ...tpl.objEn.split(' ')],
            urdu: `${tpl.urduSubj} ${tpl.urduObj} ${tpl.urduBase} ${getUrduEnd('pres', tpl)}۔`
        });
        output.simplePresent.push({
            id: `sp_${qId++}`, type: 'fill', difficulty: 'hard',
            question: `${tpl.subjEn} _____ (${tpl.vBase}) ${tpl.objEn} every day.`,
            answer: tpl.vS,
            urdu: `${tpl.urduSubj} روزانہ ${tpl.urduObj} ${tpl.urduBase} ${getUrduEnd('pres', tpl)}۔`
        });

        // Present Continuous
        const hPres = getHelper('be_pres', tpl.subjEn);
        output.presentContinuous.push({
            id: `pc_${qId++}`, type: 'mcq', difficulty: 'easy',
            question: `${tpl.subjEn} _____ ${tpl.vIng} ${tpl.objEn}.`,
            options: ['is', 'am', 'are', 'was'],
            answer: hPres,
            urdu: `${tpl.urduSubj} ${tpl.urduObj} ${tpl.urduIng} ${getUrduEnd('pres', tpl)}۔`
        });
        output.presentContinuous.push({
            id: `pc_${qId++}`, type: 'scramble', difficulty: 'medium',
            sentence: `${tpl.subjEn} ${hPres} ${tpl.vIng} ${tpl.objEn}`,
            answer: [tpl.subjEn, hPres, tpl.vIng, ...tpl.objEn.split(' ')],
            urdu: `${tpl.urduSubj} ${tpl.urduObj} ${tpl.urduIng} ${getUrduEnd('pres', tpl)}۔`
        });
        output.presentContinuous.push({
            id: `pc_${qId++}`, type: 'fill', difficulty: 'hard',
            question: `${tpl.subjEn} _____ _____ (${tpl.vBase}) ${tpl.objEn} right now.`,
            answer: `${hPres} ${tpl.vIng}`,
            urdu: `${tpl.urduSubj} اس وقت ${tpl.urduObj} ${tpl.urduIng} ${getUrduEnd('pres', tpl)}۔`
        });

        // Present Perfect
        const hpPres = getHelper('have_pres', tpl.subjEn);
        output.presentPerfect.push({
            id: `pp_${qId++}`, type: 'mcq', difficulty: 'easy',
            question: `${tpl.subjEn} _____ ${tpl.vPp} ${tpl.objEn}.`,
            options: ['has', 'have', 'had', 'is'],
            answer: hpPres,
            urdu: `${tpl.urduSubj} نے ${tpl.urduObj} ${tpl.urduPast} ہے۔`
        });
        output.presentPerfect.push({
            id: `pp_${qId++}`, type: 'scramble', difficulty: 'medium',
            sentence: `${tpl.subjEn} ${hpPres} ${tpl.vPp} ${tpl.objEn}`,
            answer: [tpl.subjEn, hpPres, tpl.vPp, ...tpl.objEn.split(' ')],
            urdu: `${tpl.urduSubj} نے ${tpl.urduObj} ${tpl.urduPast} ہے۔`
        });
        output.presentPerfect.push({
            id: `pp_${qId++}`, type: 'fill', difficulty: 'hard',
            question: `${tpl.subjEn} _____ already _____ (${tpl.vBase}) ${tpl.objEn}.`,
            answer: `${hpPres} ${tpl.vPp}`,
            urdu: `${tpl.urduSubj} پہلے ہی ${tpl.urduObj} ${tpl.urduPast} ہے۔`
        });

        // Present Perfect Continuous
        output.presentPerfectContinuous.push({
            id: `ppc_${qId++}`, type: 'mcq', difficulty: 'easy',
            question: `${tpl.subjEn} _____ been ${tpl.vIng} ${tpl.objEn} for 2 hours.`,
            options: ['has', 'have', 'had', 'is'],
            answer: hpPres,
            urdu: `${tpl.urduSubj} 2 گھنٹے سے ${tpl.urduObj} ${tpl.urduIng} ${getUrduEnd('pres', tpl)}۔`
        });
        output.presentPerfectContinuous.push({
            id: `ppc_${qId++}`, type: 'fill', difficulty: 'hard',
            question: `How long _____ ${tpl.subjEn} _____ (${tpl.vBase}) ${tpl.objEn}?`,
            answer: `${hpPres} been ${tpl.vIng}`,
            urdu: `${tpl.urduSubj} کتنی دیر سے ${tpl.urduObj} ${tpl.urduIng} ${getUrduEnd('pres', tpl)}؟`
        });

        // Simple Past
        output.simplePast.push({
            id: `past_${qId++}`, type: 'mcq', difficulty: 'easy',
            question: `${tpl.subjEn} _____ ${tpl.objEn} yesterday.`,
            options: [tpl.vPast, tpl.vS, tpl.vIng, tpl.vPp],
            answer: tpl.vPast,
            urdu: `${tpl.urduSubj} نے کل ${tpl.urduObj} ${tpl.urduPast}۔`
        });
        output.simplePast.push({
            id: `past_${qId++}`, type: 'scramble', difficulty: 'medium',
            sentence: `${tpl.subjEn} ${tpl.vPast} ${tpl.objEn} yesterday`,
            answer: [tpl.subjEn, tpl.vPast, ...tpl.objEn.split(' '), 'yesterday'],
            urdu: `${tpl.urduSubj} نے کل ${tpl.urduObj} ${tpl.urduPast}۔`
        });
        output.simplePast.push({
            id: `past_${qId++}`, type: 'fill', difficulty: 'hard',
            question: `${tpl.subjEn} _____ (${tpl.vBase}) ${tpl.objEn} last night.`,
            answer: tpl.vPast,
            urdu: `${tpl.urduSubj} نے پچھلی رات ${tpl.urduObj} ${tpl.urduPast}۔`
        });

        // Past Continuous
        const hPast = getHelper('be_past', tpl.subjEn);
        output.pastContinuous.push({
            id: `pc_past_${qId++}`, type: 'mcq', difficulty: 'easy',
            question: `${tpl.subjEn} _____ ${tpl.vIng} ${tpl.objEn}.`,
            options: ['was', 'were', 'is', 'am'],
            answer: hPast,
            urdu: `${tpl.urduSubj} ${tpl.urduObj} ${tpl.urduIng} ${getUrduEnd('past', tpl)}۔`
        });
        output.pastContinuous.push({
            id: `pc_past_${qId++}`, type: 'fill', difficulty: 'hard',
            question: `${tpl.subjEn} _____ _____ (${tpl.vBase}) ${tpl.objEn} when I called.`,
            answer: `${hPast} ${tpl.vIng}`,
            urdu: `جب میں نے کال کی، ${tpl.urduSubj} ${tpl.urduObj} ${tpl.urduIng} ${getUrduEnd('past', tpl)}۔`
        });

        // Past Perfect
        output.pastPerfect.push({
            id: `pp_past_${qId++}`, type: 'mcq', difficulty: 'easy',
            question: `${tpl.subjEn} _____ ${tpl.vPp} ${tpl.objEn} before I arrived.`,
            options: ['had', 'have', 'has', 'was'],
            answer: 'had',
            urdu: `میرے آنے سے پہلے ${tpl.urduSubj} نے ${tpl.urduObj} ${tpl.urduPast} تھا۔`
        });
        output.pastPerfect.push({
            id: `pp_past_${qId++}`, type: 'scramble', difficulty: 'medium',
            sentence: `${tpl.subjEn} had ${tpl.vPp} ${tpl.objEn} already`,
            answer: [tpl.subjEn, 'had', tpl.vPp, ...tpl.objEn.split(' '), 'already'],
            urdu: `${tpl.urduSubj} نے پہلے ہی ${tpl.urduObj} ${tpl.urduPast} تھا۔`
        });

        // Past Perfect Continuous
        output.pastPerfectContinuous.push({
            id: `ppc_past_${qId++}`, type: 'mcq', difficulty: 'easy',
            question: `${tpl.subjEn} _____ been ${tpl.vIng} ${tpl.objEn} for hours.`,
            options: ['had', 'have', 'has', 'was'],
            answer: 'had',
            urdu: `${tpl.urduSubj} گھنٹوں سے ${tpl.urduObj} ${tpl.urduIng} ${getUrduEnd('past', tpl)}۔`
        });

        // Simple Future
        output.simpleFuture.push({
            id: `sf_${qId++}`, type: 'mcq', difficulty: 'easy',
            question: `${tpl.subjEn} _____ ${tpl.vBase} ${tpl.objEn} tomorrow.`,
            options: ['will', 'shall', 'am', 'is'],
            answer: 'will',
            urdu: `${tpl.urduSubj} کل ${tpl.urduObj} ${tpl.urduBase} ${getUrduEnd('fut', tpl)}۔`
        });
        output.simpleFuture.push({
            id: `sf_${qId++}`, type: 'fill', difficulty: 'medium',
            question: `${tpl.subjEn} _____ (${tpl.vBase}) ${tpl.objEn} tomorrow.`,
            answer: `will ${tpl.vBase}`,
            urdu: `${tpl.urduSubj} کل ${tpl.urduObj} ${tpl.urduBase} ${getUrduEnd('fut', tpl)}۔`
        });

        // Future Continuous
        output.futureContinuous.push({
            id: `fc_${qId++}`, type: 'mcq', difficulty: 'easy',
            question: `${tpl.subjEn} _____ be ${tpl.vIng} ${tpl.objEn}.`,
            options: ['will', 'shall', 'would', 'is'],
            answer: 'will',
            urdu: `${tpl.urduSubj} ${tpl.urduObj} ${tpl.urduIng} ہو ${getUrduEnd('fut', tpl)}۔`
        });

        // Future Perfect
        output.futurePerfect.push({
            id: `fp_${qId++}`, type: 'mcq', difficulty: 'easy',
            question: `${tpl.subjEn} will _____ ${tpl.vPp} ${tpl.objEn} by 5 PM.`,
            options: ['have', 'has', 'had', 'be'],
            answer: 'have',
            urdu: `${tpl.urduSubj} شام 5 بجے تک ${tpl.urduObj} ${tpl.urduPast} ہو ${getUrduEnd('fut', tpl)}۔`
        });

        // Future Perfect Continuous
        output.futurePerfectContinuous.push({
            id: `fpc_${qId++}`, type: 'mcq', difficulty: 'hard',
            question: `By next year, ${tpl.subjEn} _____ have been ${tpl.vIng} ${tpl.objEn} for a decade.`,
            options: ['will', 'shall', 'would', 'is'],
            answer: 'will',
            urdu: `اگلے سال تک، ${tpl.urduSubj} ایک دہائی سے ${tpl.urduObj} ${tpl.urduIng} ہو ${getUrduEnd('fut', tpl)}۔`
        });
    });

    const fileContent = `/**
 * AL IMRAN TENSE LEARNER - Questions Data
 * Auto-generated dataset for massive question bank
 */

export const questions = ${JSON.stringify(output, null, 4)};
`;
    fs.writeFileSync(path.join(__dirname, 'js/data/questions.js'), fileContent);
    console.log('Successfully generated questions.js with', qId, 'questions!');
}

generate();
