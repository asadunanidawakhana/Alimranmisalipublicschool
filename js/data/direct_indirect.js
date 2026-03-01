/**
 * AL IMRAN TENSE LEARNER - Direct/Indirect Speech Data
 * Contains rules and examples for speech transformations (Narration)
 */

export const directIndirect = {
    assertive: {
        id: 'assertive',
        name: 'Assertive Sentences',
        formula: 'Reporting Verb (said/told) + that + Reported Speech (Tense Change)',
        rules: {
            english: 'Use "that" as a conjunction. Change the tense of the reported speech if the reporting verb is in the past. Pronouns also change according to the SON rule (Subject-Object-No Change).',
            urdu: 'ان جملوں میں "that" کا استعمال کیا جاتا ہے۔ اگر "said" کے بعد مفعول (object) ہو تو اسے "told" میں بدل دیتے ہیں۔ زمانے اور ضمیر (pronouns) کے مطابق تبدیلیاں کی جاتی ہیں۔'
        },
        examples: [
            { direct: 'He said, "I am happy."', indirect: 'He said that he was happy.', urdu: 'اس نے کہا، "میں خوش ہوں۔"' },
            { direct: 'She said to me, "I have finished."', indirect: 'She told me that she had finished.', urdu: 'اس نے مجھ سے کہا، "میں نے کام ختم کر لیا ہے۔"' }
        ]
    },
    interrogative: {
        id: 'interrogative',
        name: 'Interrogative Sentences',
        formula: 'Asked/Inquired + if/whether (for yes/no) OR Wh-word + Reported Speech (Question to Statement)',
        rules: {
            english: 'Reporting verb "said" changes to "asked". Use "if" or "whether" for questions starting with helping verbs. For Wh-questions, the Wh-word itself acts as a conjunction. The sentence becomes a statement (Subject before verb).',
            urdu: 'سوالیہ جملوں میں "said" کو "asked" میں بدلا جاتا ہے۔ اگر سوال helping verb سے شروع ہو تو "if" لگاتے ہیں، اور اگر Wh-word سے ہو تو وہی لفظ استعمال ہوتا ہے۔ جملہ سوالیہ سے بیانیہ بن جاتا ہے۔'
        },
        examples: [
            { direct: 'He said, "Are you coming?"', indirect: 'He asked if I was coming.', urdu: 'اس نے کہا، "کیا تم آ رہے ہو؟"' },
            { direct: 'She said, "Where do you live?"', indirect: 'She asked where I lived.', urdu: 'اس نے کہا، "تم کہاں رہتے ہو؟"' }
        ]
    },
    imperative: {
        id: 'imperative',
        name: 'Imperative Sentences',
        formula: 'Ordered/Requested/Advised + to + 1st form of verb',
        rules: {
            english: 'Reporting verb changes to ordered, requested, advised, or forbade. Use "to" before the verb in the reported speech. For negative sentences, use "not to".',
            urdu: 'حکمیہ یا التجائیہ جملوں میں "said" کو "ordered", "requested" یا "advised" میں بدلتے ہیں۔ فعل سے پہلے "to" لگایا جاتا ہے۔ منفی جملوں میں "not to" استعمال ہوتا ہے۔'
        },
        examples: [
            { direct: 'The teacher said, "Sit down."', indirect: 'The teacher ordered to sit down.', urdu: 'استاد نے کہا، "بیٹھ جاؤ۔"' },
            { direct: 'He said, "Please help me."', indirect: 'He requested to help him.', urdu: 'اس نے کہا، "براہ کرم میری مدد کریں۔"' }
        ]
    },
    exclamatory: {
        id: 'exclamatory',
        name: 'Exclamatory Sentences',
        formula: 'Exclaimed with joy/sorrow/wonder + that + Reported Speech',
        rules: {
            english: 'Reporting verb "said" changes to "exclaimed with joy", "exclaimed with sorrow", etc. Use "that" as a conjunction. The sentence becomes assertive.',
            urdu: 'حیرت یا خوشی والے جملوں میں "exclaimed with joy" یا "exclaimed with sorrow" استعمال ہوتا ہے۔ "that" کا استعمال کر کے جملے کو سادہ بنا دیا جاتا ہے۔'
        },
        examples: [
            { direct: 'He said, "Hurrah! We won."', indirect: 'He exclaimed with joy that they had won.', urdu: 'اس نے کہا، "واہ! ہم جیت گئے۔"' },
            { direct: 'She said, "Alas! I failed."', indirect: 'She exclaimed with sorrow that she had failed.', urdu: 'اس نے کہا، "افسوس! میں فیل ہو گئی۔"' }
        ]
    },
    optative: {
        id: 'optative',
        name: 'Optative Sentences',
        formula: 'Prayed/Wished + that + Subject + might + verb',
        rules: {
            english: 'Reporting verb changes to "prayed" or "wished". Use "that" as a conjunction. "May" usually changes to "might".',
            urdu: 'دعا یا تمنا والے جملوں میں "said" کو "prayed" یا "wished" میں بدلتے ہیں۔ "May" کو "might" میں تبدیل کر دیا جاتا ہے۔'
        },
        examples: [
            { direct: 'She said, "May you live long!"', indirect: 'She prayed that I might live long.', urdu: 'اس نے کہا، "اللہ تمہاری عمر دراز کرے!"' },
            { direct: 'He said, "Would that I were rich!"', indirect: 'He wished that he had been rich.', urdu: 'اس نے کہا، "کاش میں امیر ہوتا!"' }
        ]
    },
    universalTruth: {
        id: 'universalTruth',
        name: 'Universal Truths / Facts',
        formula: 'Said + that + Reported Speech (No Tense Change)',
        rules: {
            english: 'If the reported speech expresses a universal truth, habitual fact, or proverb, the tense does NOT change even if the reporting verb is in the past.',
            urdu: 'اگر بات کوئی آفاقی سچائی، عادت یا کہاوت ہو تو زمانے (tense) میں کوئی تبدیلی نہیں کی جاتی، چاہے "said" ہی کیوں نہ ہو۔'
        },
        examples: [
            { direct: 'The teacher said, "The Earth is round."', indirect: 'The teacher said that the Earth is round.', urdu: 'استاد نے کہا، "زمین گول ہے۔"' },
            { direct: 'He said, "Honesty is the best policy."', indirect: 'He said that honesty is the best policy.', urdu: 'اس نے کہا، "ایمانداری بہترین حکمت عملی ہے۔"' }
        ]
    }
};
