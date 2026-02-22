/**
 * AL IMRAN TENSE LEARNER - Active/Passive Voice Data
 * Contains rules and examples for voice transformations across all tenses
 */

export const activePassive = {
    simplePresent: {
        id: 'simplePresent',
        name: 'Simple Present',
        activeFormula: 'Subject + 1st form of verb (s/es) + Object',
        passiveFormula: 'Object + is/am/are + 3rd form of verb + by + Subject',
        rules: {
            english: 'Use "is/am/are" and the 3rd form of the verb. The object becomes the subject.',
            urdu: 'مفعول کو شروع میں لائیں، اس کے بعد is/am/are لگائیں، پھر فعل کی تیسری فارم اور آخر میں by کے ساتھ فاعل لگائیں۔'
        },
        examples: [
            { active: 'He eats an apple.', passive: 'An apple is eaten by him.', urdu: 'وہ سیب کھاتا ہے۔' },
            { active: 'They play cricket.', passive: 'Cricket is played by them.', urdu: 'وہ کرکٹ کھیلتے ہیں۔' }
        ]
    },
    presentContinuous: {
        id: 'presentContinuous',
        name: 'Present Continuous',
        activeFormula: 'Subject + is/am/are + 1st form of verb-ing + Object',
        passiveFormula: 'Object + is/am/are + being + 3rd form of verb + by + Subject',
        rules: {
            english: 'Use "is/am/are + being" and the 3rd form of the verb.',
            urdu: 'اس میں is/am/are کے ساتھ being کا اضافہ کیا جاتا ہے اور فعل کی تیسری فارم استعمال ہوتی ہے۔'
        },
        examples: [
            { active: 'She is cooking food.', passive: 'Food is being cooked by her.', urdu: 'وہ کھانا پکا رہی ہے۔' },
            { active: 'I am reading a book.', passive: 'A book is being read by me.', urdu: 'میں کتاب پڑھ رہا ہوں۔' }
        ]
    },
    presentPerfect: {
        id: 'presentPerfect',
        name: 'Present Perfect',
        activeFormula: 'Subject + has/have + 3rd form of verb + Object',
        passiveFormula: 'Object + has/have + been + 3rd form of verb + by + Subject',
        rules: {
            english: 'Use "has/have + been" and the 3rd form of the verb.',
            urdu: 'اس میں has/have کے ساتھ been لگایا جاتا ہے اور فعل کی تیسری فارم استعمال ہوتی ہے۔'
        },
        examples: [
            { active: 'They have won the match.', passive: 'The match has been won by them.', urdu: 'وہ میچ جیت چکے ہیں۔' },
            { active: 'He has finished the work.', passive: 'The work has been finished by him.', urdu: 'اس نے کام ختم کر لیا ہے۔' }
        ]
    },
    simplePast: {
        id: 'simplePast',
        name: 'Simple Past',
        activeFormula: 'Subject + 2nd form of verb + Object',
        passiveFormula: 'Object + was/were + 3rd form of verb + by + Subject',
        rules: {
            english: 'Use "was/were" and the 3rd form of the verb.',
            urdu: 'مفعول کے بعد was/were لگایا جاتا ہے اور فعل کی تیسری فارم استعمال ہوتی ہے۔'
        },
        examples: [
            { active: 'I wrote a letter.', passive: 'A letter was written by me.', urdu: 'میں نے خط لکھا۔' },
            { active: 'She bought a car.', passive: 'A car was bought by her.', urdu: 'اس نے کار خریدی۔' }
        ]
    },
    pastContinuous: {
        id: 'pastContinuous',
        name: 'Past Continuous',
        activeFormula: 'Subject + was/were + 1st form of verb-ing + Object',
        passiveFormula: 'Object + was/were + being + 3rd form of verb + by + Subject',
        rules: {
            english: 'Use "was/were + being" and the 3rd form of the verb.',
            urdu: 'اس میں was/were کے ساتھ being کا اضافہ کیا جاتا ہے اور فعل کی تیسری فارم استعمال ہوتی ہے۔'
        },
        examples: [
            { active: 'They were helping him.', passive: 'He was being helped by them.', urdu: 'وہ اس کی مدد کر رہے تھے۔' },
            { active: 'He was painting a picture.', passive: 'A picture was being painted by him.', urdu: 'وہ تصویر بنا رہا تھا۔' }
        ]
    },
    pastPerfect: {
        id: 'pastPerfect',
        name: 'Past Perfect',
        activeFormula: 'Subject + had + 3rd form of verb + Object',
        passiveFormula: 'Object + had + been + 3rd form of verb + by + Subject',
        rules: {
            english: 'Use "had + been" and the 3rd form of the verb.',
            urdu: 'اس میں had کے ساتھ been لگایا جاتا ہے اور فعل کی تیسری فارم استعمال ہوتی ہے۔'
        },
        examples: [
            { active: 'She had lost the keys.', passive: 'The keys had been lost by her.', urdu: 'وہ چابیاں کھو چکی تھی۔' },
            { active: 'I had done my homework.', passive: 'My homework had been done by me.', urdu: 'میں اپنا کام کر چکا تھا۔' }
        ]
    },
    simpleFuture: {
        id: 'simpleFuture',
        name: 'Simple Future',
        activeFormula: 'Subject + will + 1st form of verb + Object',
        passiveFormula: 'Object + will be + 3rd form of verb + by + Subject',
        rules: {
            english: 'Use "will be" and the 3rd form of the verb.',
            urdu: 'اس میں will کے ساتھ be کا اضافہ کیا جاتا ہے اور فعل کی تیسری فارم استعمال ہوتی ہے۔'
        },
        examples: [
            { active: 'They will catch the thief.', passive: 'The thief will be caught by them.', urdu: 'وہ چور کو پکڑ لیں گے۔' },
            { active: 'I will write a story.', passive: 'A story will be written by me.', urdu: 'میں کہانی لکھوں گا۔' }
        ]
    },
    futurePerfect: {
        id: 'futurePerfect',
        name: 'Future Perfect',
        activeFormula: 'Subject + will have + 3rd form of verb + Object',
        passiveFormula: 'Object + will have been + 3rd form of verb + by + Subject',
        rules: {
            english: 'Use "will have been" and the 3rd form of the verb.',
            urdu: 'اس میں will have کے ساتھ been کا اضافہ کیا جاتا ہے اور فعل کی تیسری فارم استعمال ہوتی ہے۔'
        },
        examples: [
            { active: 'He will have invited us.', passive: 'We will have been invited by him.', urdu: 'وہ ہمیں دعوت دے چکا ہو گا۔' },
            { active: 'She will have cooked the meal.', passive: 'The meal will have been cooked by her.', urdu: 'وہ کھانا پکا چکی ہو گی۔' }
        ]
    }
};
