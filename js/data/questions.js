/**
 * AL IMRAN TENSE LEARNER - Questions Data
 */

export const questions = {
    simplePresent: [
        {
            id: 'sp_q1',
            type: 'mcq',
            question: 'I _____ to school every day.',
            options: ['go', 'goes', 'going', 'gone'],
            answer: 'go',
            urdu: 'میں روزانہ سکول جاتا ہوں۔'
        },
        {
            id: 'sp_q_scramble_1',
            type: 'scramble',
            sentence: 'I go to school every day',
            answer: ['I', 'go', 'to', 'school', 'every', 'day'],
            urdu: 'میں روزانہ سکول جاتا ہوں۔'
        },
        {
            id: 'sp_q2',
            type: 'fill',
            question: 'She _____ (cook) food.',
            answer: 'cooks',
            urdu: 'وہ کھانا پکاتی ہے۔'
        },
        {
            id: 'sp_q_scramble_2',
            type: 'scramble',
            sentence: 'She cooks delicious food',
            answer: ['She', 'cooks', 'delicious', 'food'],
            urdu: 'وہ مزیدار کھانا پکاتی ہے۔'
        },
        {
            id: 'sp_match_1',
            type: 'match_pairs',
            pairs: [
                { english: 'I go', urdu: 'میں جاتا ہوں' },
                { english: 'She cooks', urdu: 'وہ پکاتی ہے' },
                { english: 'They play', urdu: 'وہ کھیلتے ہیں' },
                { english: 'We study', urdu: 'ہم پڑھتے ہیں' }
            ]
        }
    ],
    presentContinuous: [
        {
            id: 'pc_q1',
            type: 'mcq',
            question: 'They _____ playing cricket.',
            options: ['is', 'am', 'are', 'was'],
            answer: 'are',
            urdu: 'وہ کرکٹ کھیل رہے ہیں۔'
        },
        {
            id: 'pc_q_scramble_1',
            type: 'scramble',
            sentence: 'They are playing cricket now',
            answer: ['They', 'are', 'playing', 'cricket', 'now'],
            urdu: 'وہ اب کرکٹ کھیل رہے ہیں۔'
        },
        {
            id: 'pc_match_1',
            type: 'match_pairs',
            pairs: [
                { english: 'I am going', urdu: 'میں جا رہا ہوں' },
                { english: 'She is eating', urdu: 'وہ کھا رہی ہے' },
                { english: 'They are running', urdu: 'وہ بھاگ رہے ہیں' }
            ]
        }
    ],
    presentPerfect: [
        {
            id: 'pp_q1',
            type: 'mcq',
            question: 'I _____ already eaten.',
            options: ['has', 'have', 'had', 'am'],
            answer: 'have',
            urdu: 'میں پہلے ہی کھا چکا ہوں۔'
        },
        {
            id: 'pp_q_scramble_1',
            type: 'scramble',
            sentence: 'I have finished my homework',
            answer: ['I', 'have', 'finished', 'my', 'homework'],
            urdu: 'میں نے اپنا ہوم ورک ختم کر لیا ہے۔'
        },
        {
            id: 'pp_match_1',
            type: 'match_pairs',
            pairs: [
                { english: 'I have seen', urdu: 'میں دیکھ چکا ہوں' },
                { english: 'He has gone', urdu: 'وہ جا چکا ہے' },
                { english: 'They have won', urdu: 'وہ جیت چکے ہیں' }
            ]
        }
    ],
    presentPerfectContinuous: [
        {
            id: 'ppc_q1',
            type: 'mcq',
            question: 'It _____ raining since morning.',
            options: ['is', 'has been', 'have been', 'was'],
            answer: 'has been',
            urdu: 'صبح سے بارش ہو رہی ہے۔'
        },
        {
            id: 'ppc_q_scramble_1',
            type: 'scramble',
            sentence: 'It has been raining since morning',
            answer: ['It', 'has', 'been', 'raining', 'since', 'morning'],
            urdu: 'صبح سے بارش ہو رہی ہے۔'
        }
    ],
    simplePast: [
        {
            id: 'past_q1',
            type: 'mcq',
            question: 'She _____ to the market yesterday.',
            options: ['go', 'goes', 'went', 'gone'],
            answer: 'went',
            urdu: 'وہ کل بازار گئی۔'
        },
        {
            id: 'past_q_scramble_1',
            type: 'scramble',
            sentence: 'She cooked delicious food yesterday',
            answer: ['She', 'cooked', 'delicious', 'food', 'yesterday'],
            urdu: 'اس نے کل مزیدار کھانا پکایا۔'
        },
        {
            id: 'past_match_1',
            type: 'match_pairs',
            pairs: [
                { english: 'I went', urdu: 'میں گیا' },
                { english: 'She cooked', urdu: 'اس نے پکایا' },
                { english: 'They played', urdu: 'وہ کھیلے' }
            ]
        }
    ],
    pastContinuous: [
        {
            id: 'pastc_q1',
            type: 'mcq',
            question: 'I _____ sleeping when you called.',
            options: ['is', 'was', 'were', 'am'],
            answer: 'was',
            urdu: 'جب آپ نے فون کیا تو میں سو رہا تھا۔'
        },
        {
            id: 'pastc_match_1',
            type: 'match_pairs',
            pairs: [
                { english: 'I was sleeping', urdu: 'میں سو رہا تھا' },
                { english: 'She was cooking', urdu: 'وہ پکا رہی تھی' },
                { english: 'They were running', urdu: 'وہ بھاگ رہے تھے' }
            ]
        }
    ],
    pastPerfect: [
        {
            id: 'pastp_q1',
            type: 'mcq',
            question: 'The train _____ left before I arrived.',
            options: ['has', 'have', 'had', 'was'],
            answer: 'had',
            urdu: 'میرے پہنچنے سے پہلے ٹرین جا چکی تھی۔'
        },
        {
            id: 'pastp_q_scramble_1',
            type: 'scramble',
            sentence: 'The train had left before I arrived',
            answer: ['The', 'train', 'had', 'left', 'before', 'I', 'arrived'],
            urdu: 'میرے پہنچنے سے پہلے ٹرین جا چکی تھی۔'
        }
    ],
    pastPerfectContinuous: [
        {
            id: 'pastpc_q1',
            type: 'mcq',
            question: 'They _____ playing for two hours.',
            options: ['are', 'were', 'had been', 'have been'],
            answer: 'had been',
            urdu: 'وہ دو گھنٹے سے کھیل رہے تھے۔'
        }
    ],
    simpleFuture: [
        {
            id: 'future_q1',
            type: 'mcq',
            question: 'I _____ help you tomorrow.',
            options: ['will', 'shall', 'am', 'was'],
            answer: 'will',
            urdu: 'میں کل آپ کی مدد کروں گا۔'
        },
        {
            id: 'future_q_scramble_1',
            type: 'scramble',
            sentence: 'I will go to school tomorrow',
            answer: ['I', 'will', 'go', 'to', 'school', 'tomorrow'],
            urdu: 'میں کل سکول جاؤں گا۔'
        }
    ],
    futureContinuous: [
        {
            id: 'futurec_q1',
            type: 'mcq',
            question: 'I _____ waiting for you.',
            options: ['will', 'will be', 'shall', 'am'],
            answer: 'will be',
            urdu: 'میں آپ کا انتظار کر رہا ہوں گا۔'
        }
    ],
    futurePerfect: [
        {
            id: 'futurep_q1',
            type: 'mcq',
            question: 'She _____ finished her work by then.',
            options: ['will', 'will have', 'shall', 'had'],
            answer: 'will have',
            urdu: 'وہ تب تک اپنا کام ختم کر چکی ہو گی۔'
        }
    ],
    futurePerfectContinuous: [
        {
            id: 'futurepc_q1',
            type: 'mcq',
            question: 'I _____ living here for ten years.',
            options: ['will be', 'will have been', 'am', 'was'],
            answer: 'will have been',
            urdu: 'میں یہاں دس سال سے رہ رہا ہوں گا۔'
        }
    ]
};
