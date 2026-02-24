/**
 * AL IMRAN TENSE LEARNER - Questions Data
 */

export const questions = {
    simplePresent: [
        {
            id: 'sp_q1',
            type: 'mcq',
            difficulty: 'easy',
            question: 'I _____ to school every day.',
            options: ['go', 'goes', 'going', 'gone'],
            answer: 'go',
            urdu: 'میں روزانہ سکول جاتا ہوں۔'
        },
        {
            id: 'sp_q_scramble_1',
            type: 'scramble',
            difficulty: 'easy',
            sentence: 'I go to school every day',
            answer: ['I', 'go', 'to', 'school', 'every', 'day'],
            urdu: 'میں روزانہ سکول جاتا ہوں۔'
        },
        {
            id: 'sp_q2',
            type: 'fill',
            difficulty: 'medium',
            question: 'She _____ (cook) food every evening.',
            answer: 'cooks',
            urdu: 'وہ ہر شام کھانا پکاتی ہے۔'
        },
        {
            id: 'sp_q_hard_1',
            type: 'mcq',
            difficulty: 'hard',
            question: 'The Sun _____ in the East and _____ in the West.',
            options: ['rises, sets', 'rise, set', 'rising, setting', 'arises, sets'],
            answer: 'rises, sets',
            urdu: 'سورج مشرق سے نکلتا ہے اور مغرب میں غروب ہوتا ہے۔'
        },
        {
            id: 'sp_q_hard_2',
            type: 'fill',
            difficulty: 'hard',
            question: 'Neither of the boys _____ (want) to play.',
            answer: 'wants',
            urdu: 'دونوں لڑکوں میں سے کوئی بھی کھیلنا نہیں چاہتا۔'
        },
        {
            id: 'sp_q_medium_1',
            type: 'mcq',
            difficulty: 'medium',
            question: 'The water _____ (boil) at 100 degrees Celsius.',
            options: ['boil', 'boils', 'boiling', 'boiled'],
            answer: 'boils',
            urdu: 'پانی 100 ڈگری سیلسیس پر ابلتا ہے۔'
        },
        {
            id: 'sp_match_1',
            type: 'match_pairs',
            difficulty: 'medium',
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
            difficulty: 'easy',
            question: 'They _____ playing cricket.',
            options: ['is', 'am', 'are', 'was'],
            answer: 'are',
            urdu: 'وہ کرکٹ کھیل رہے ہیں۔'
        },
        {
            id: 'pc_q_scramble_1',
            type: 'scramble',
            difficulty: 'medium',
            sentence: 'They are playing cricket now',
            answer: ['They', 'are', 'playing', 'cricket', 'now'],
            urdu: 'وہ اب کرکٹ کھیل رہے ہیں۔'
        },
        {
            id: 'pc_q_hard_1',
            type: 'mcq',
            difficulty: 'hard',
            question: 'Look! The man _____ (try) to open the door of your car.',
            options: ['tries', 'is trying', 'tried', 'try'],
            answer: 'is trying',
            urdu: 'دیکھو! وہ آدمی تمہاری کار کا دروازہ کھولنے کی کوشش کر رہا ہے۔'
        },
        {
            id: 'pc_match_1',
            type: 'match_pairs',
            difficulty: 'medium',
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
            difficulty: 'easy',
            question: 'I _____ already eaten.',
            options: ['has', 'have', 'had', 'am'],
            answer: 'have',
            urdu: 'میں پہلے ہی کھا چکا ہوں۔'
        },
        {
            id: 'pp_q_hard_1',
            type: 'fill',
            difficulty: 'hard',
            question: 'Up to now, no one _____ (ever/succeed) in reaching that mountain peak.',
            answer: 'has ever succeeded',
            urdu: 'اب تک، کوئی بھی اس پہاڑی چوٹی تک پہنچنے میں کامیاب نہیں ہوا ہے۔'
        },
        {
            id: 'pp_q_scramble_1',
            type: 'scramble',
            difficulty: 'medium',
            sentence: 'I have finished my homework',
            answer: ['I', 'have', 'finished', 'my', 'homework'],
            urdu: 'میں نے اپنا ہوم ورک ختم کر لیا ہے۔'
        },
        {
            id: 'pp_match_1',
            type: 'match_pairs',
            difficulty: 'medium',
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
            difficulty: 'easy',
            question: 'It _____ raining since morning.',
            options: ['is', 'has been', 'have been', 'was'],
            answer: 'has been',
            urdu: 'صبح سے بارش ہو رہی ہے۔'
        },
        {
            id: 'ppc_q_hard_1',
            type: 'fill',
            difficulty: 'hard',
            question: 'For how long _____ you _____ (wait) for me?',
            answer: 'have, been waiting',
            urdu: 'تم کب سے میرا انتظار کر رہے ہو؟'
        }
    ],
    simplePast: [
        {
            id: 'past_q1',
            type: 'mcq',
            difficulty: 'easy',
            question: 'She _____ to the market yesterday.',
            options: ['go', 'goes', 'went', 'gone'],
            answer: 'went',
            urdu: 'وہ کل بازار گئی۔'
        },
        {
            id: 'past_q_scramble_1',
            type: 'scramble',
            difficulty: 'medium',
            sentence: 'She cooked delicious food yesterday',
            answer: ['She', 'cooked', 'delicious', 'food', 'yesterday'],
            urdu: 'اس نے کل مزیدار کھانا پکایا۔'
        },
        {
            id: 'past_q_hard_1',
            type: 'mcq',
            difficulty: 'hard',
            question: 'Hardly _____ I _____ (leave) the house when it started to rain.',
            options: ['did, leave', 'had, left', 'have, left', 'was, leaving'],
            answer: 'had, left',
            urdu: 'میں بمشکل گھر سے نکلا ہی تھا کہ بارش شروع ہوگئی۔'
        },
        {
            id: 'past_match_1',
            type: 'match_pairs',
            difficulty: 'medium',
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
            difficulty: 'easy',
            question: 'I _____ sleeping when you called.',
            options: ['is', 'was', 'were', 'am'],
            answer: 'was',
            urdu: 'جب آپ نے فون کیا تو میں سو رہا تھا۔'
        },
        {
            id: 'pastc_q_hard_1',
            type: 'fill',
            difficulty: 'hard',
            question: 'While the kids _____ (play) outside, the mother _____ (cook) food.',
            answer: 'were playing, was cooking',
            urdu: 'جب بچے باہر کھیل رہے تھے، تو ماں کھانا پکا رہی تھی۔'
        }
    ],
    pastPerfect: [
        {
            id: 'pastp_q1',
            type: 'mcq',
            difficulty: 'easy',
            question: 'The train _____ left before I arrived.',
            options: ['has', 'have', 'had', 'was'],
            answer: 'had',
            urdu: 'میرے پہنچنے سے پہلے ٹرین جا چکی تھی۔'
        },
        {
            id: 'pastp_q_hard_1',
            type: 'mcq',
            difficulty: 'hard',
            question: 'By the time the police arrived, the thief _____ (escape).',
            options: ['escaped', 'has escaped', 'had escaped', 'was escaped'],
            answer: 'had escaped',
            urdu: 'پولیس کے پہنچنے تک چور فرار ہو چکا تھا۔'
        }
    ],
    pastPerfectContinuous: [
        {
            id: 'pastpc_q1',
            type: 'mcq',
            difficulty: 'easy',
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
            difficulty: 'easy',
            question: 'I _____ help you tomorrow.',
            options: ['will', 'shall', 'am', 'was'],
            answer: 'will',
            urdu: 'میں کل آپ کی مدد کروں گا۔'
        }
    ],
    futureContinuous: [
        {
            id: 'futurec_q1',
            type: 'mcq',
            difficulty: 'easy',
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
            difficulty: 'easy',
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
            difficulty: 'easy',
            question: 'I _____ living here for ten years.',
            options: ['will be', 'will have been', 'am', 'was'],
            answer: 'will have been',
            urdu: 'میں یہاں دس سال سے رہ رہا ہوں گا۔'
        }
    ]
};
