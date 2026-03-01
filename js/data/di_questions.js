/**
 * AL IMRAN TENSE LEARNER - Direct/Indirect Speech Questions
 * Practice questions for narration transformations
 */

export const diQuestions = {
    assertive: [
        {
            id: 'di_as_1',
            type: 'mcq',
            difficulty: 'easy',
            question: 'Direct: He said, "I am happy." Change to Indirect:',
            options: [
                'He said that he is happy.',
                'He said that he was happy.',
                'He said that he been happy.',
                'He said he happy.'
            ],
            answer: 'He said that he was happy.',
            urdu: 'اس نے کہا، "میں خوش ہوں۔"'
        },
        {
            id: 'di_as_2',
            type: 'mcq',
            difficulty: 'easy',
            question: 'Direct: She said to me, "I have a pen." Change to Indirect:',
            options: [
                'She told me that she had a pen.',
                'She said me that she had a pen.',
                'She told me that I had a pen.',
                'She said that she having a pen.'
            ],
            answer: 'She told me that she had a pen.',
            urdu: 'اس نے مجھ سے کہا، "میرے پاس ایک قلم ہے۔"'
        }
    ],
    interrogative: [
        {
            id: 'di_in_1',
            type: 'mcq',
            difficulty: 'medium',
            question: 'Direct: He said, "Where is your house?" Change to Indirect:',
            options: [
                'He asked where was my house.',
                'He asked where my house was.',
                'He said that where is my house.',
                'He asked if where my house was.'
            ],
            answer: 'He asked where my house was.',
            urdu: 'اس نے کہا، "تمہارا گھر کہاں ہے؟"'
        },
        {
            id: 'di_in_2',
            type: 'mcq',
            difficulty: 'medium',
            question: 'Direct: Ali said to me, "Do you like tea?" Change to Indirect:',
            options: [
                'Ali asked me that did I like tea.',
                'Ali asked me if I liked tea.',
                'Ali told me if I liked tea.',
                'Ali asked me if he liked tea.'
            ],
            answer: 'Ali asked me if I liked tea.',
            urdu: 'علی نے مجھ سے پوچھا، "کیا تمہیں چائے پسند ہے؟"'
        }
    ],
    imperative: [
        {
            id: 'di_im_1',
            type: 'mcq',
            difficulty: 'medium',
            question: 'Direct: The doctor said to him, "Take exercise." Change to Indirect:',
            options: [
                'The doctor advised him that take exercise.',
                'The doctor advised him to take exercise.',
                'The doctor said to him to take exercise.',
                'The doctor ordered him take exercise.'
            ],
            answer: 'The doctor advised him to take exercise.',
            urdu: 'ڈاکٹر نے اس سے کہا، "ورزش کرو۔"'
        },
        {
            id: 'di_im_2',
            type: 'mcq',
            difficulty: 'medium',
            question: 'Direct: He said to me, "Please don\'t go." Change to Indirect:',
            options: [
                'He requested me not to go.',
                'He requested me to not go.',
                'He requested me that do not go.',
                'He begged me to go.'
            ],
            answer: 'He requested me not to go.',
            urdu: 'اس نے مجھ سے کہا، "براہ کرم مت جاؤ۔"'
        }
    ],
    exclamatory: [
        {
            id: 'di_ex_1',
            type: 'mcq',
            difficulty: 'hard',
            question: 'Direct: He said, "Hurrah! I have won." Change to Indirect:',
            options: [
                'He exclaimed with joy that I had won.',
                'He exclaimed with joy that he had won.',
                'He said with joy that he has won.',
                'He exclaimed that he won.'
            ],
            answer: 'He exclaimed with joy that he had won.',
            urdu: 'اس نے کہا، "واہ! میں جیت گیا۔"'
        }
    ],
    optative: [
        {
            id: 'di_op_1',
            type: 'mcq',
            difficulty: 'hard',
            question: 'Direct: She said, "May you succeed!" Change to Indirect:',
            options: [
                'She prayed that I might succeed.',
                'She prayed that I may succeed.',
                'She said that I might succeed.',
                'She wished me success.'
            ],
            answer: 'She prayed that I might succeed.',
            urdu: 'اس نے کہا، "اللہ تمہیں کامیاب کرے۔"'
        }
    ],
    universalTruth: [
        {
            id: 'di_ut_1',
            type: 'mcq',
            difficulty: 'easy',
            question: 'Direct: The teacher said, "Two and two make four." Change to Indirect:',
            options: [
                'The teacher said that two and two made four.',
                'The teacher said that two and two makes four.',
                'The teacher said that two and two make four.',
                'The teacher told that two and two make four.'
            ],
            answer: 'The teacher said that two and two make four.',
            urdu: 'استاد نے کہا، "دو اور دو چار ہوتے ہیں۔"'
        }
    ]
};
