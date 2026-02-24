/**
 * AL IMRAN TENSE LEARNER - Active/Passive Voice Questions
 */

export const apQuestions = {
    simplePresent: [
        {
            id: 'ap_sp_1',
            type: 'mcq',
            difficulty: 'easy',
            question: 'Change to Passive: "He reads a book."',
            options: ['A book is read by him.', 'A book was read by him.', 'He is read by a book.', 'A book reads him.'],
            answer: 'A book is read by him.',
            urdu: 'وہ کتاب پڑھتا ہے۔'
        },
        {
            id: 'ap_sp_2',
            type: 'scramble',
            difficulty: 'medium',
            question: 'Passive Voice: "They play cricket."',
            answer: ['Cricket', 'is', 'played', 'by', 'them.'],
            urdu: 'وہ کرکٹ کھیلتے ہیں۔'
        },
        {
            id: 'ap_sp_hard_1',
            type: 'mcq',
            difficulty: 'hard',
            question: 'Change to Passive: "Who teaches you English?"',
            options: ['By whom are you taught English?', 'By whom you are taught English?', 'English is taught to you by who?', 'Who is taught English by you?'],
            answer: 'By whom are you taught English?',
            urdu: 'آپ کو انگریزی کون پڑھاتا ہے؟'
        }
    ],
    presentContinuous: [
        {
            id: 'ap_pc_1',
            type: 'mcq',
            difficulty: 'easy',
            question: 'Change to Passive: "She is making tea."',
            options: ['Tea is being made by her.', 'Tea is made by her.', 'Tea was being made by her.', 'She is tea being made.'],
            answer: 'Tea is being made by her.',
            urdu: 'وہ چائے بنا رہی ہے۔'
        },
        {
            id: 'ap_pc_hard_1',
            type: 'mcq',
            difficulty: 'hard',
            question: 'Change to Passive: "Are they not painting the wall?"',
            options: ['Is the wall not being painted by them?', 'Is the wall not painted by them?', 'Are the walls not being painted by them?', 'Is the wall being not painted by them?'],
            answer: 'Is the wall not being painted by them?',
            urdu: 'کیا وہ دیوار پر پینٹ نہیں کر رہے ہیں؟'
        }
    ],
    presentPerfect: [
        {
            id: 'ap_pp_1',
            type: 'mcq',
            difficulty: 'easy',
            question: 'Change to Passive: "I have written a letter."',
            options: ['A letter has been written by me.', 'A letter have been written by me.', 'A letter was written by me.', 'I have been written a letter.'],
            answer: 'A letter has been written by me.',
            urdu: 'میں خط لکھ چکا ہوں۔'
        }
    ],
    simplePast: [
        {
            id: 'ap_past_1',
            type: 'mcq',
            difficulty: 'easy',
            question: 'Change to Passive: "He broke the glass."',
            options: ['The glass was broken by him.', 'The glass is broken by him.', 'The glass had been broken by him.', 'He was broken by the glass.'],
            answer: 'The glass was broken by him.',
            urdu: 'اس نے گلاس توڑ دیا۔'
        },
        {
            id: 'ap_past_hard_1',
            type: 'mcq',
            difficulty: 'hard',
            question: 'Change to Passive: "Did the hunter kill the lion?"',
            options: ['Was the lion killed by the hunter?', 'Is the lion killed by the hunter?', 'Did the lion killed by the hunter?', 'Had the lion been killed by the hunter?'],
            answer: 'Was the lion killed by the hunter?',
            urdu: 'کیا شکاری نے شیر کو مار دیا؟'
        }
    ],
    pastContinuous: [
        {
            id: 'ap_pc_1',
            type: 'mcq',
            difficulty: 'easy',
            question: 'Change to Passive: "They were repairing the car."',
            options: ['The car was being repaired by them.', 'The car were being repaired by them.', 'The car was repaired by them.', 'They were being repaired by the car.'],
            answer: 'The car was being repaired by them.',
            urdu: 'وہ کار کی مرمت کر رہے تھے۔'
        }
    ],
    pastPerfect: [
        {
            id: 'ap_pp_1',
            type: 'mcq',
            difficulty: 'easy',
            question: 'Change to Passive: "She had cleaned the room."',
            options: ['The room had been cleaned by her.', 'The room was cleaned by her.', 'The room had cleaned by her.', 'She had been cleaned by the room.'],
            answer: 'The room had been cleaned by her.',
            urdu: 'وہ کمرہ صاف کر چکی تھی۔'
        }
    ],
    simpleFuture: [
        {
            id: 'ap_sf_1',
            type: 'mcq',
            difficulty: 'easy',
            question: 'Change to Passive: "I will call you."',
            options: ['You will be called by me.', 'You will called by me.', 'You would be called by me.', 'I will be called by you.'],
            answer: 'You will be called by me.',
            urdu: 'میں آپ کو کال کروں گا۔'
        }
    ],
    futurePerfect: [
        {
            id: 'ap_fp_1',
            type: 'mcq',
            difficulty: 'easy',
            question: 'Change to Passive: "He will have finished the project."',
            options: ['The project will have been finished by him.', 'The project will be finished by him.', 'The project would have been finished by him.', 'He will have been finished by the project.'],
            answer: 'The project will have been finished by him.',
            urdu: 'وہ پراجیکٹ ختم کر چکا ہو گا۔'
        }
    ]
};
