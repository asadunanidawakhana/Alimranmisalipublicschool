/**
 * AL IMRAN TENSE LEARNER - Tenses Data
 * Contains rules, Urdu explanations, and examples for all 12 tenses
 */

export const tenses = {
    // PAST TENSES
    simplePast: {
        id: 'simplePast',
        name: 'Simple Past Tense',
        urduName: 'فعل ماضی مطلق',
        formula: 'Subject + 2nd Form of Verb + Object',
        theory: {
            english: 'The simple past tense is used for actions that started and finished in the past.',
            urdu: 'فعل ماضی مطلق ان کاموں کے لیے استعمال ہوتا ہے جو گزرے ہوئے وقت میں مکمل ہو گئے ہوں۔'
        },
        examples: [
            { english: 'I went to school.', urdu: 'میں سکول گیا۔' },
            { english: 'She cooked food.', urdu: 'اس نے کھانا پکایا۔' },
            { english: 'They played cricket.', urdu: 'وہ کرکٹ کھیلے۔' }
        ]
    },
    pastContinuous: {
        id: 'pastContinuous',
        name: 'Past Continuous Tense',
        urduName: 'فعل ماضی جاری',
        formula: 'S + was/were + V1-ing',
        theory: {
            english: 'Used for actions that were ongoing at a specific time in the past.',
            urdu: 'یہ ٹینس ماضی میں کسی خاص وقت پر جاری رہنے والے کاموں کے لیے استعمال ہوتا ہے۔'
        },
        examples: [
            { english: 'I was sleeping.', urdu: 'میں سو رہا تھا۔' },
            { english: 'They were running.', urdu: 'وہ بھاگ رہے تھے۔' }
        ]
    },
    pastPerfect: {
        id: 'pastPerfect',
        name: 'Past Perfect Tense',
        urduName: 'فعل ماضی مکمل',
        formula: 'Subject + had + 3rd Form of Verb + Object',
        theory: {
            english: 'Used for an action that was completed before another action in the past.',
            urdu: 'یہ ٹینس ایسے کاموں کے لیے استعمال ہوتا ہے جو ماضی میں ایک دوسرے کام سے پہلے مکمل ہو چکے ہوں۔'
        },
        examples: [
            { english: 'I had finished my work before he came.', urdu: 'اس کے آنے سے پہلے میں اپنا کام ختم کر چکا تھا۔' },
            { english: 'She had already eaten dinner.', urdu: 'وہ پہلے ہی کھانا کھا چکی تھی۔' }
        ]
    },
    pastPerfectContinuous: {
        id: 'pastPerfectContinuous',
        name: 'Past Perfect Continuous Tense',
        urduName: 'فعل ماضی جاری مکمل',
        formula: 'S + had + been + Verb(ing) + (since/for) + Object',
        theory: {
            english: 'Used for an action that started in the past and continued up until another time in the past.',
            urdu: 'یہ ٹینس ایسے کاموں کے لیے استعمال ہوتا ہے جو ماضی میں شروع ہوئے اور ماضی ہی میں کسی خاص وقت تک جاری رہے۔'
        },
        examples: [
            { english: 'I had been waiting for two hours when he arrived.', urdu: 'جب وہ پہنچا تو میں دو گھنٹے سے انتظار کر رہا تھا۔' },
            { english: 'They had been playing since morning.', urdu: 'وہ صبح سے کھیل رہے تھے۔' }
        ]
    },

    // PRESENT TENSES
    simplePresent: {
        id: 'simplePresent',
        name: 'Simple Present Tense',
        urduName: 'فعل حال مطلق',
        formula: 'Subject + Verb (s/es) + Object',
        theory: {
            english: 'The simple present tense is used to describe habits, unchanging situations, general truths, and fixed arrangements.',
            urdu: 'فعل حال مطلق ان کاموں کے لیے استعمال ہوتا ہے جو ہماری عادت ہوں، یا روزانہ کی بنیاد پر کیے جائیں، یا وہ سچائیاں ہوں جو ہمیشہ رہتی ہیں۔'
        },
        usage: [
            { rule: 'Habits', example: 'I drink coffee every morning.' },
            { rule: 'General Truths', example: 'The sun rises in the east.' }
        ],
        examples: [
            { english: 'I go to school.', urdu: 'میں سکول جاتا ہوں۔' },
            { english: 'She cooks food.', urdu: 'وہ کھانا پکاتی ہے۔' },
            { english: 'They play cricket.', urdu: 'وہ کرکٹ کھیلتے ہیں۔' },
            { english: 'Birds fly in the sky.', urdu: 'پرندے آسمان میں اڑتے ہیں۔' }
        ]
    },
    presentContinuous: {
        id: 'presentContinuous',
        name: 'Present Continuous Tense',
        urduName: 'فعل حال جاری',
        formula: 'Subject + is/am/are + Verb(ing) + Object',
        theory: {
            english: 'The present continuous tense is used for actions happening now or for an action that is unfinished.',
            urdu: 'فعل حال جاری ان کاموں کے لیے استعمال ہوتا ہے جو ابھی ہو رہے ہوں یعنی جاری ہوں۔'
        },
        examples: [
            { english: 'I am going to school.', urdu: 'میں سکول جا رہا ہوں۔' },
            { english: 'She is cooking food.', urdu: 'وہ کھانا پکا رہی ہے۔' },
            { english: 'They are playing cricket.', urdu: 'وہ کرکٹ کھیل رہے ہیں۔' }
        ]
    },
    presentPerfect: {
        id: 'presentPerfect',
        name: 'Present Perfect Tense',
        urduName: 'فعل حال مکمل',
        formula: 'S + has/have + V3',
        theory: {
            english: 'Used for actions that happened at an unspecified time in the past but have relevance now.',
            urdu: 'یہ ٹینس ایسے کاموں کے لیے استعمال ہوتا ہے جو ہو چکے ہوں لیکن ان کا اثر اب بھی ہو۔'
        },
        examples: [
            { english: 'I have eaten.', urdu: 'میں کھانا کھا چکا ہوں۔' },
            { english: 'She has gone.', urdu: 'وہ جا چکی ہے۔' },
            { english: 'We have won.', urdu: 'ہم جیت چکے ہیں۔' }
        ]
    },
    presentPerfectContinuous: {
        id: 'presentPerfectContinuous',
        name: 'Present Perfect Continuous Tense',
        urduName: 'فعل حال جاری مکمل',
        formula: 'S + has/have + been + Verb(ing) + (since/for) + Object',
        theory: {
            english: 'Used for an action that started in the past and is still continuing.',
            urdu: 'یہ ٹینس ایسے کاموں کے لیے استعمال ہوتا ہے جو ماضی میں شروع ہوئے ہوں اور اب bhi جاری ہوں۔'
        },
        examples: [
            { english: 'I have been studying since morning.', urdu: 'میں صبح سے پڑھ رہا ہوں۔' },
            { english: 'It has been raining for two hours.', urdu: 'دو گھنٹے سے بارش ہو رہی ہے۔' },
            { english: 'They have been playing since 4 o\'clock.', urdu: 'وہ چار بجے سے کھیل رہے ہیں۔' }
        ]
    },

    // FUTURE TENSES
    simpleFuture: {
        id: 'simpleFuture',
        name: 'Simple Future Tense',
        urduName: 'فعل مستقبل سادہ',
        formula: 'Subject + will + Verb(1st Form) + Object',
        theory: {
            english: 'The simple future is used for actions that have not happened yet.',
            urdu: 'فعل مستقبل ان کاموں کے لیے استعمال ہوتا ہے جو ابھی ہونے ہوں۔'
        },
        examples: [
            { english: 'I will go to school.', urdu: 'میں سکول جاؤں گا۔' },
            { english: 'They will come.', urdu: 'وہ آئیں گے۔' }
        ]
    },
    futureContinuous: {
        id: 'futureContinuous',
        name: 'Future Continuous Tense',
        urduName: 'فعل مستقبل جاری',
        formula: 'S + will be + Verb(ing) + Object',
        theory: {
            english: 'Used for an action that will be ongoing at a certain time in the future.',
            urdu: 'یہ ٹینس ایسے کاموں کے لیے استعمال ہوتا ہے جو مستقبل میں کسی خاص وقت پر جاری ہوں گے۔'
        },
        examples: [
            { english: 'I will be waiting for you.', urdu: 'میں آپ کا انتظار کر رہا ہوں گا۔' },
            { english: 'They will be playing cricket tomorrow.', urdu: 'وہ کل کرکٹ کھیل رہے ہوں گے۔' }
        ]
    },
    futurePerfect: {
        id: 'futurePerfect',
        name: 'Future Perfect Tense',
        urduName: 'فعل مستقبل مکمل',
        formula: 'S + will have + V3 + Object',
        theory: {
            english: 'Used for an action that will be completed by a certain time in the future.',
            urdu: 'یہ ٹینس ایسے کاموں کے لیے استعمال ہوتا ہے جو مستقبل میں کسی خاص وقت تک مکمل ہو چکے ہوں گے۔'
        },
        examples: [
            { english: 'I will have finished my work by 5 PM.', urdu: 'میں شام پانچ بجے tak اپنا کام ختم کر چکا ہوں گا۔' },
            { english: 'She will have gone to school.', urdu: 'وہ سکول جا چکی ہو گی۔' }
        ]
    },
    futurePerfectContinuous: {
        id: 'futurePerfectContinuous',
        name: 'Future Perfect Continuous Tense',
        urduName: 'فعل مستقبل جاری مکمل',
        formula: 'S + will have been + Verb(ing) + (since/for) + Object',
        theory: {
            english: 'Used for an action that will continue up until a point in the future.',
            urdu: 'یہ ٹینس ایسے کاموں کے لیے استعمال ہوتا ہے جو مستقبل میں کسی خاص وقت تک جاری رہے ہوں گے۔'
        },
        examples: [
            { english: 'I will have been living here for ten years by next month.', urdu: 'اگلے مہینے tak میں یہاں دس سال سے رہ رہا ہوں گا۔' },
            { english: 'They will have been playing since morning.', urdu: 'وہ صبح سے کھیل رہے ہوں گے۔' }
        ]
    }
};
