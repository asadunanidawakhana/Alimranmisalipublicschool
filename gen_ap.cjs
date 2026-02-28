const fs = require('fs');
const path = require('path');

const templates = [
    {
        active: 'He reads a book',
        passive: 'A book is read by him',
        passivePast: 'A book was read by him',
        passiveFut: 'A book will be read by him',
        passiveCont: 'A book is being read by him',
        passivePastCont: 'A book was being read by him',
        passivePerf: 'A book has been read by him',
        passivePastPerf: 'A book had been read by him',
        passiveFutPerf: 'A book will have been read by him',
        urdu: 'وہ کتاب پڑھتا ہے۔'
    },
    {
        active: 'She cooks food',
        passive: 'Food is cooked by her',
        passivePast: 'Food was cooked by her',
        passiveFut: 'Food will be cooked by her',
        passiveCont: 'Food is being cooked by her',
        passivePastCont: 'Food was being cooked by her',
        passivePerf: 'Food has been cooked by her',
        passivePastPerf: 'Food had been cooked by her',
        passiveFutPerf: 'Food will have been cooked by her',
        urdu: 'وہ کھانا پکاتی ہے۔'
    },
    {
        active: 'They play cricket',
        passive: 'Cricket is played by them',
        passivePast: 'Cricket was played by them',
        passiveFut: 'Cricket will be played by them',
        passiveCont: 'Cricket is being played by them',
        passivePastCont: 'Cricket was being played by them',
        passivePerf: 'Cricket has been played by them',
        passivePastPerf: 'Cricket had been played by them',
        passiveFutPerf: 'Cricket will have been played by them',
        urdu: 'وہ کرکٹ کھیلتے ہیں۔'
    },
    {
        active: 'I write a letter',
        passive: 'A letter is written by me',
        passivePast: 'A letter was written by me',
        passiveFut: 'A letter will be written by me',
        passiveCont: 'A letter is being written by me',
        passivePastCont: 'A letter was being written by me',
        passivePerf: 'A letter has been written by me',
        passivePastPerf: 'A letter had been written by me',
        passiveFutPerf: 'A letter will have been written by me',
        urdu: 'میں خط لکھتا ہوں۔'
    },
    {
        active: 'Ali buys a car',
        passive: 'A car is bought by Ali',
        passivePast: 'A car was bought by Ali',
        passiveFut: 'A car will be bought by Ali',
        passiveCont: 'A car is being bought by Ali',
        passivePastCont: 'A car was being bought by Ali',
        passivePerf: 'A car has been bought by Ali',
        passivePastPerf: 'A car had been bought by Ali',
        passiveFutPerf: 'A car will have been bought by Ali',
        urdu: 'علی کار خریدتا ہے۔'
    },
    {
        active: 'We win the match',
        passive: 'The match is won by us',
        passivePast: 'The match was won by us',
        passiveFut: 'The match will be won by us',
        passiveCont: 'The match is being won by us',
        passivePastCont: 'The match was being won by us',
        passivePerf: 'The match has been won by us',
        passivePastPerf: 'The match had been won by us',
        passiveFutPerf: 'The match will have been won by us',
        urdu: 'ہم میچ جیتتے ہیں۔'
    }
];

function generate() {
    let output = {
        simplePresent: [], presentContinuous: [], presentPerfect: [],
        simplePast: [], pastContinuous: [], pastPerfect: [],
        simpleFuture: [], futurePerfect: []
    };

    let qId = 1;

    templates.forEach(tpl => {
        // Simple Present
        output.simplePresent.push({
            id: `ap_sp_${qId++}`, type: 'mcq', difficulty: 'easy',
            question: `Change to Passive: "${tpl.active}."`,
            options: [tpl.passive, tpl.passivePast, tpl.passiveCont, tpl.passiveFut].sort(() => Math.random() - 0.5).slice(0, 4),
            answer: tpl.passive, urdu: tpl.urdu
        });
        output.simplePresent.push({
            id: `ap_sp_${qId++}`, type: 'scramble', difficulty: 'medium',
            question: `Passive Voice: "${tpl.active}."`,
            answer: tpl.passive.split(' '), urdu: tpl.urdu
        });

        // Present Continuous
        const activeCont = tpl.active.replace(/ (.) /, ' is $1ing ').replace(/es /, 'ing ').replace(/s /, 'ing ').replace('inging', 'ing').replace('eeing', 'ing').replace('eing', 'ing');
        output.presentContinuous.push({
            id: `ap_pc_${qId++}`, type: 'mcq', difficulty: 'easy',
            question: `Change to Passive: "${activeCont}."`,
            options: [tpl.passiveCont, tpl.passive, tpl.passivePast, tpl.passivePastCont].sort(() => Math.random() - 0.5).slice(0, 4),
            answer: tpl.passiveCont, urdu: tpl.urdu // Roughly correct
        });

        // Present Perfect
        const activePerf = tpl.active.replace(/ (.) /, ' has $1ed ').replace(/s /, 'ed ').replace('eed', 'ed');
        output.presentPerfect.push({
            id: `ap_pp_${qId++}`, type: 'mcq', difficulty: 'easy',
            question: `Change to Passive: "${activePerf}."`,
            options: [tpl.passivePerf, tpl.passive, tpl.passivePastPerf, tpl.passiveFutPerf].sort(() => Math.random() - 0.5).slice(0, 4),
            answer: tpl.passivePerf, urdu: tpl.urdu
        });

        // Simple Past
        const activePast = tpl.active.replace(/ (.) /, ' $1ed ').replace(/es /, 'ed ').replace(/s /, 'ed ').replace('eed', 'ed');
        output.simplePast.push({
            id: `ap_past_${qId++}`, type: 'mcq', difficulty: 'easy',
            question: `Change to Passive: "${activePast}."`,
            options: [tpl.passivePast, tpl.passive, tpl.passivePerf, tpl.passiveFut].sort(() => Math.random() - 0.5).slice(0, 4),
            answer: tpl.passivePast, urdu: tpl.urdu
        });

        // Past Continuous
        const activePastCont = activeCont.replace('is', 'was');
        output.pastContinuous.push({
            id: `ap_pc_${qId++}`, type: 'mcq', difficulty: 'easy',
            question: `Change to Passive: "${activePastCont}."`,
            options: [tpl.passivePastCont, tpl.passiveCont, tpl.passivePast, tpl.passive].sort(() => Math.random() - 0.5).slice(0, 4),
            answer: tpl.passivePastCont, urdu: tpl.urdu
        });

        // Past Perfect
        const activePastPerf = activePerf.replace('has', 'had');
        output.pastPerfect.push({
            id: `ap_pp_${qId++}`, type: 'mcq', difficulty: 'easy',
            question: `Change to Passive: "${activePastPerf}."`,
            options: [tpl.passivePastPerf, tpl.passivePerf, tpl.passive, tpl.passiveFutPerf].sort(() => Math.random() - 0.5).slice(0, 4),
            answer: tpl.passivePastPerf, urdu: tpl.urdu
        });

        // Simple Future
        const activeFut = tpl.active.replace(/ (.) /, ' will $1 ').replace(/s /, ' ');
        output.simpleFuture.push({
            id: `ap_sf_${qId++}`, type: 'mcq', difficulty: 'easy',
            question: `Change to Passive: "${activeFut}."`,
            options: [tpl.passiveFut, tpl.passive, tpl.passivePast, tpl.passivePerf].sort(() => Math.random() - 0.5).slice(0, 4),
            answer: tpl.passiveFut, urdu: tpl.urdu
        });

        // Future Perfect
        const activeFutPerf = activeFut.replace('will', 'will have').replace(/ (.*?) /, ' $1ed ').replace('eed', 'ed');
        output.futurePerfect.push({
            id: `ap_fp_${qId++}`, type: 'mcq', difficulty: 'easy',
            question: `Change to Passive: "${activeFutPerf}."`,
            options: [tpl.passiveFutPerf, tpl.passiveFut, tpl.passivePerf, tpl.passivePastPerf].sort(() => Math.random() - 0.5).slice(0, 4),
            answer: tpl.passiveFutPerf, urdu: tpl.urdu
        });
    });

    const fileContent = `/**
 * AL IMRAN TENSE LEARNER - Active/Passive Voice Questions
 * Auto-generated dataset for massive question bank
 */

export const apQuestions = ${JSON.stringify(output, null, 4)};
`;
    fs.writeFileSync(path.join(__dirname, 'js/data/ap_questions.js'), fileContent);
    console.log('Successfully generated ap_questions.js with', qId, 'questions!');
}

generate();
