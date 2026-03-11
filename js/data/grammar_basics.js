/**
 * AL IMRAN TENSE LEARNER - Grammar Basics Data
 * Contains rules, Urdu explanations, and examples for foundational grammar topics
 */

export const grammarBasics = {
    // 1. NOUNS
    nouns: {
        id: 'nouns',
        name: 'Nouns (اسم)',
        urduName: 'اسم کی پہچان اور اقسام',
        theory: {
            english: 'A noun is a naming word for a person, place, thing, or idea.',
            urdu: 'اسم کسی شخص، جگہ، چیز یا خیال کے نام کو کہتے ہیں۔'
        },
        sections: [
            {
                title: 'Countable vs. Uncountable',
                urduTitle: 'قابلِ شمار اور ناقابلِ شمار اسم',
                content: 'Countable nouns can be counted (e.g., Book, Apple). Uncountable nouns cannot be counted directly (e.g., Water, Milk, Advice).',
                urduContent: 'قابلِ شمار وہ اسم ہیں جنہیں گنا جا سکے، جبکہ ناقابلِ شمار وہ ہیں جنہیں گنا نہ جا سکے۔'
            },
            {
                title: 'Abstract vs. Material',
                urduTitle: 'مجرد اور مادی اسم',
                content: 'Material nouns are physical things (e.g., Gold, Wood). Abstract nouns are feelings or ideas (e.g., Happiness, Love, Freedom).',
                urduContent: 'مادی اسم وہ ہیں جنہیں چھوا جا سکے، اور مجرد اسم وہ جذبات یا خیالات ہیں جنہیں چھوا نہ جا سکے۔'
            }
        ],
        examples: [
            { english: 'The boy is playing with a ball.', urdu: 'لڑکا گیند سے کھیل رہا ہے۔' },
            { english: 'She has much knowledge.', urdu: 'اس کے پاس بہت علم ہے۔' },
            { english: 'Gold is a precious metal.', urdu: 'سونا ایک قیمتی دھات ہے۔' }
        ]
    },

    // 2. PRONOUNS
    pronouns: {
        id: 'pronouns',
        name: 'Pronouns (اسم ضمیر)',
        urduName: 'اسم ضمیر اور اس کا استعمال',
        theory: {
            english: 'A pronoun is a word used instead of a noun to avoid repetition.',
            urdu: 'اسم ضمیر وہ لفظ ہے جو کسی اسم کی جگہ استعمال ہوتا ہے تاکہ تکرار سے بچا جا سکے۔'
        },
        sections: [
            {
                title: 'Reflexive Pronouns',
                urduTitle: 'ایسے ضمیر جو خود پر واپس آئیں',
                content: 'Words ending in "-self" or "-selves" (e.g., Myself, Himself, Themselves).',
                urduContent: 'وہ الفاظ جو "-self" یا "-selves" پر ختم ہوتے ہیں جیسے کہ "میں خود" یا "وہ خود"۔'
            },
            {
                title: 'Relative Pronouns',
                urduTitle: 'رشتہ ظاہر کرنے والے ضمیر',
                content: 'Used to connect a clause or phrase to a noun or pronoun (e.g., Who, Which, That).',
                urduContent: 'یہ ضمیر جملوں کو جوڑنے کے لیے استعمال ہوتے ہیں۔'
            }
        ],
        examples: [
            { english: 'He hurt himself.', urdu: 'اس نے اپنے آپ کو زخمی کر لیا۔' },
            { english: 'The man who called is my uncle.', urdu: 'وہ آدمی جس نے فون کیا میرا چچا ہے۔' }
        ]
    },

    // 3. ARTICLES
    articles: {
        id: 'articles',
        name: 'Articles (حروفِ تنکیر)',
        urduName: 'اے (A)، این (An) اور دی (The) کا استعمال',
        theory: {
            english: 'Articles are used before nouns to define them as specific or non-specific.',
            urdu: 'آرٹیکلز اسم سے پہلے ان کی نوعیت (عام یا خاص) بتانے کے لیے استعمال ہوتے ہیں۔'
        },
        sections: [
            {
                title: 'A vs. An',
                urduTitle: 'اے اور این کا فرق',
                content: 'Use "An" before a vowel sound (a, e, i, o, u) and "A" before a consonant sound.',
                urduContent: 'واول آواز سے پہلے "An" اور کونسوننٹ آواز سے پہلے "A" لگائیں۔'
            },
            {
                title: 'The (Definite Article)',
                urduTitle: 'دی (دیفینٹ آرٹیکل)',
                content: 'Used for specific things, unique objects, or things mentioned before.',
                urduContent: 'کسی خاص چیز، منفرد چیز یا پہلے سے ذکر شدہ چیز کے لیے "The" استعمال کریں۔'
            }
        ],
        examples: [
            { english: 'An apple a day keeps the doctor away.', urdu: 'روزانہ ایک سیب ڈاکٹر سے دور رکھتا ہے۔' },
            { english: 'The sun rises in the east.', urdu: 'سورج مشرق سے نکلتا ہے۔' },
            { english: 'I saw a European student.', urdu: 'میں نے ایک یورپی طالب علم دیکھا۔' }
        ]
    },

    // 4. ADJECTIVES & ADVERBS
    adjAdv: {
        id: 'adjAdv',
        name: 'Adjectives & Adverbs',
        urduName: 'اسم صفت اور متعلق فعل',
        theory: {
            english: 'Adjectives describe nouns. Adverbs describe verbs, adjectives, or other adverbs.',
            urdu: 'اسم صفت کسی اسم کی خوبی بتاتا ہے، جبکہ متعلق فعل کسی کام (فعل) کی وضاحت کرتا ہے۔'
        },
        sections: [
            {
                title: 'Adjectives',
                urduTitle: 'اسم صفت',
                content: 'Example: Blue dress, Famous writer. Order: Size, Age, Shape, Color, Material.',
                urduContent: 'مثال: نیلا لباس۔ ترتیب: سائز، عمر، شکل، رنگ، مادہ۔'
            },
            {
                title: 'Adverbs',
                urduTitle: 'متعلق فعل',
                content: 'Usually end in "-ly". Examples: Sings beautifully, Runs fast.',
                urduContent: 'عام طور پر "-ly" پر ختم ہوتے ہیں۔ مثال: خوبصورتی سے گاتا ہے۔'
            }
        ],
        examples: [
            { english: 'She is a clever girl.', urdu: 'وہ ایک چالاک لڑکی ہے۔' },
            { english: 'He ran very quickly.', urdu: 'وہ بہت تیزی سے بھاگا۔' }
        ]
    },

    // 5. FIGURES OF SPEECH
    figures: {
        id: 'figures',
        name: 'Figures of Speech',
        urduName: 'صنعتِ لفظی',
        theory: {
            english: 'Special ways of using words to make language more effective.',
            urdu: 'زبان کو پُرکشش بنانے کے لیے الفاظ کا خاص استعمال۔'
        },
        sections: [
            {
                title: 'Simile vs. Metaphor',
                urduTitle: 'تشبیہ اور استعارہ',
                content: 'Simile uses "like" or "as" (e.g., As white as snow). Metaphor states one thing is another (e.g., Time is a thief).',
                urduContent: 'تشبیہ میں "like" یا "as" استعمال ہوتا ہے، جبکہ استعارہ میں ایک چیز کو براہِ راست دوسری چیز کہا جاتا ہے۔'
            },
            {
                title: 'Personification',
                urduTitle: 'تجسیم',
                content: 'Giving human traits to non-human things (e.g., The wind whispered).',
                urduContent: 'بے جان چیزوں کو انسانی خصوصیات دینا۔'
            }
        ],
        examples: [
            { english: 'He is as busy as a bee.', urdu: 'وہ شہد کی مکھی کی طرح مصروف ہے۔' },
            { english: 'The heart of a lion.', urdu: 'شیر کا دل۔' },
            { english: 'The stars winked at me.', urdu: 'ستارے مجھ سے آنکھ مچولی کر رہے تھے۔' }
        ]
    }
};
