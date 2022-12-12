// ==================================================
// QUIZ DATA
// ==================================================



// WHAT IS DOMESTIC VIOLENCE
const INTRO_E2 = {
    ITEMS: [
        {
            type: 'single',
            question: `1. Do you have the right to feel safe in your home?`,
            choices: [
                { description: 'Yes', value: 'true', x: 633, y: 450 },
                { description: 'No', value: 'false', x: 633, y: 550 }
            ],
            //  answer: 'true',
            //  feedback_correct: 'Good job! You got the correct answer...',
            //  feedback_wrong: 'Whoops! You didn’t get that quite right...'
        },
        {
            type: 'single',
            question: `2. Is violence when someone hurts you, ${
                '\n'}hurts someone else or damages property?`,
            choices: [
                { description: 'Yes', value: 'true', x: 633, y: 450 },
                { description: 'No', value: 'false', x: 633, y: 550 }
            ]
        },
        {
            type: 'single',
            question: `3. If someone was hitting or scaring someone, ${
                '\n'}does this mean they are being violent?`,
            choices: [
                { description: 'Yes', value: 'true', x: 633, y: 450 },
                { description: 'No', value: 'false', x: 633, y: 550 }
            ]
        },
        {
            type: 'single',
            question: `4. Domestic Violence can affect you in this way, ${
                '\n'}select the correct answer.`,
            choices: [
                { description: 'Feel sick',             value: 'false', x: 525, y: 450 },
                { description: 'Trouble concentrating', value: 'false', x: 525, y: 550 },
                { description: 'Feel frightened',       value: 'false', x: 525, y: 650 },
                { description: 'Trouble sleeping',      value: 'false', x: 1050, y: 450 },
                { description: 'All of them',           value: 'true', x: 1050, y: 550 }
            ]
        }
    ],
}

// AFFIRMATIONS
const INTRO_E3 = {
    ITEMS: [
        {
            type: 'single',
            question: `1. No-one should ask me to keep a secret \nthat makes me feel bad.`,
            choices: [
                { description: 'True', value: 'true', x: 633, y: 450 },
                { description: 'False', value: 'false', x: 633, y: 550 }
            ]
        },
        {
            type: 'single',
            question: `2. It is my fault that there is violence at home.`,
            choices: [
                { description: 'True', value: 'false', x: 633, y: 450 },
                { description: 'False', value: 'true', x: 633, y: 550 }
            ]
        }
    ],
}

// FACE MASKS
const GM1_E3 = {
    ITEMS: [
        {
            type: 'single',
            question: `1. Can we show an emotion on the outside ${
                '\n'}like feeling happy, but on the inside be feeling ${
                '\n'}a different emotion like feeling worried?`,
            choices: [
                { description: 'Yes', value: 'true', x: 633, y: 500 },
                { description: 'No', value: 'false', x: 633, y: 600 }
                // { description: 'Detail...', value: 'true', x: 525, y: 500 },
                // { description: 'Detail...', value: 'true', x: 525, y: 600 },
                // { description: 'Detail...', value: 'true', x: 525, y: 700 },
                // { description: 'Detail...', value: 'false', x: 1050, y: 500 },
                // { description: 'Detail...', value: 'false', x: 1050, y: 600 },
                // { description: 'Detail...', value: 'false', x: 1050, y: 700 }
            ]
        },
        {
            type: 'single',
            question: `2. Can some emotions be tricky or ${
                '\n'}hard to talk about sometimes?`,
            choices: [
                { description: 'Yes', value: 'true', x: 633, y: 450 },
                { description: 'No', value: 'false', x: 633, y: 550 }
            ]
        },
        {
            type: 'single',
            question: `3. Can we begin to feel better if we talk ${
                '\n'}to someone about how we are feeling?`,
            choices: [
                { description: 'Yes', value: 'true', x: 633, y: 450 },
                { description: 'No', value: 'false', x: 633, y: 550 }
            ]
        },
    ],
}

// MANAGING YOUR ANGER
const GM1_E5 = {
    ITEMS: [
        {
            type: 'single',
            question: `1. Is it true that we can release our feelings ${
                '\n'}of anger in ways that are safe and do not hurt ${
                '\n'}ourselves or others?`,
            choices: [
                { description: 'Yes', value: 'true', x: 633, y: 500 },
                { description: 'No', value: 'false', x: 633, y: 600 }
            ]
        },
        {
            type: 'multi',
            question: `2. Which of these is a safe way to release anger?`,
            choices: [
                { description: 'Draw a picture \nof my anger', 
                    value: 'true', x: 525, y: 450 },
                { description: 'Stomp my feet \non the ground', 
                    value: 'true', x: 525, y: 575 },
                { description: 'Yell into a \npillow or cushion', 
                    value: 'true', x: 525, y: 700 },
                { description: 'Listen to \ncalm music', 
                    value: 'true', x: 1050, y: 450 },
                { description: 'Twist up a pillow tightly \nand then let it go', 
                    value: 'true', x: 1050, y: 575 },
                { description: 'Hurt someone', 
                    value: 'false', x: 1050, y: 700 }
            ]
        },
        {
            type: 'multi',
            question: `3. Choose all the ways you can safely release ${
                '\n'}feelings of anger.`,
            choices: [
                { description: 'Draw a picture \nof my anger', 
                    value: 'true', x: 525, y: 450 },
                { description: 'Stomp my feet \non the ground', 
                    value: 'true', x: 525, y: 575 },
                { description: 'Talk to someone', 
                    value: 'true', x: 525, y: 700 },
                { description: 'Yell into a \npillow or cushion', 
                    value: 'true', x: 1050, y: 450 },
                { description: 'Listen to \ncalm music', 
                    value: 'true', x: 1050, y: 575 },
                { description: 'Scrunch up my fists \nfor 2 seconds', 
                    value: 'true', x: 1050, y: 700 }
            ]
        }
    ]
}

// SUPERHEROES AND MAGIC
const GM2_E1 = {
    ITEMS: [
        {
            type: 'single',
            question: `1. If you do not feel safe, would hiding somewhere ${
                '\n'}you can feel safe be a good superpower to have?`,
            choices: [
                { name: 'Yes', description: 'Yes', value: 'true', x: 633, y: 450 },
                { name: 'No', description: 'No', value: 'false', x: 633, y: 550 }
            ]
        },
        {
            type: 'single',
            question: `2. Do you think when someone is yelling hurtful words, ${
                '\n'}imagining that you have a magic shield around you ${
                '\n'}would help protect you from hurtful words?`,
            choices: [
                { name: 'Yes', description: 'Yes', value: 'true', x: 633, y: 500 },
                { name: 'No', description: 'No', value: 'false', x: 633, y: 600 }
            ]
        },
        {
            type: 'single',
            question: `3. Which special skill is your favourite?`,
            choices: [
                { description: 'Invisibility', value: 'true', x: 525, y: 450 },
                { description: 'Superpower', value: 'true', x: 525, y: 550 },
                { description: 'Sneak', value: 'true', x: 525, y: 650 },
                { description: 'Shield', value: 'true', x: 1050, y: 450 }
            ]
        }
    ]
}

// ONLINE SAFETY
const GM2_E5 = {
    ITEMS: [
        {
            type: 'single',
            question: `1. Is it ever safe to give out personal information ${
                '\n'}to people online?`,
            choices: [
                { description: 'Yes', value: 'false', x: 633, y: 450 },
                { description: 'No', value: 'true', x: 633, y: 550 }
            ]
        },
        {
            type: 'single',
            question: `2. Is it okay to accept messages, friend requests ${
                '\n'}or emails from people that you have not met?`,
            choices: [
                { description: 'Yes', value: 'false', x: 633, y: 450 },
                { description: 'No', value: 'true', x: 633, y: 550 }
            ]
        },
        {
            type: 'single',
            question: `3. Is it important to tell an adult you trust ${
                '\n'}if someone makes you uncomfortable online?`,
            choices: [
                { description: 'Yes', value: 'true', x: 633, y: 450 },
                { description: 'No', value: 'false', x: 633, y: 550 }
            ]
        },
    ]
}

// WHAT ARE MY RIGHTS
const GM3_E2 = {
    ITEMS: [
        {
            type: 'single',
            question: `1. If an adult is making me feel uncomfortable, ${
                '\n'}scared, or unsafe, I have the right to tell them ${
                '\n'}to stop or say no?`,
            choices: [
                { description: 'Yes', value: 'true', x: 633, y: 500 },
                { description: 'No', value: 'false', x: 633, y: 600 }
            ]
        },
        {
            type: 'single',
            question: `2. Do children have the same rights as adults?`,
            choices: [
                { description: 'Yes', value: 'true', x: 633, y: 450 },
                { description: 'No', value: 'false', x: 633, y: 550 }
            ]
        },
        {
            type: 'single',
            question: `3. I have the right to talk to an adult that I trust ${
                '\n'}and who can help me, if someone is hurting me`,
            choices: [
                { description: 'Yes', value: 'true', x: 633, y: 500 },
                { description: 'No', value: 'false', x: 633, y: 600 }
            ]
        }
    ]
}

// RESPECTFUL RELATIONSHIPS
const GM3_E4 = {
    ITEMS: [
        {
            question: `Respectful and disrespectful behaviours: 1/6`,
            choices: [
                { name: 'Not listening', value: 'false', x: 620, y: 425 },
                { name: 'Accepting that "No" means no and "stop" means stop', value: 'true', x: 1300, y: 425 },
                { name: 'Doing something that scares the other person', value: 'false', x: 620, y: 710 },
                { name: 'Shouting or yelling', value: 'false', x: 1300, y: 710 }
            ],
            answer: 'true',
            feedback_correct: 'Good job! You got the correct answer...',
            feedback_wrong: 'Whoops! You didn’t get that quite right...'
        },
        {
            question: `Respectful and disrespectful behaviours: 2/6`,
            choices: [
                { name: 'Becoming angry at the other person', value: 'false', x: 620, y: 425 },
                { name: 'Hurting the other person', value: 'false', x: 1300, y: 425 },
                { name: 'Calling people hurtful names', value: 'false', x: 620, y: 710 },
                { name: 'Free to make own choices', value: 'true', x: 1300, y: 710 }
            ],
            answer: 'true',
            feedback_correct: 'Good job! You got the correct answer...',
            feedback_wrong: 'Whoops! You didn’t get that quite right...'
        },
        {
            question: `Respectful and disrespectful behaviours: 3/6`,
            choices: [
                { name: 'Ignoring the other person', value: 'false', x: 620, y: 425 },
                { name: 'Interrupting the person when they are talking', value: 'false', x: 1300, y: 425 },
                { name: 'Being kind', value: 'true', x: 620, y: 710 },
                { name: 'Getting into other persons personal bubble', value: 'false', x: 1300, y: 710 }
            ],
            answer: 'true',
            feedback_correct: 'Good job! You got the correct answer...',
            feedback_wrong: 'Whoops! You didn’t get that quite right...'
        },
        {
            question: `Respectful and disrespectful behaviours: 4/6`,
            choices: [
                { name: 'Pointing fingers at the other person', value: 'false', x: 620, y: 425 },
                { name: 'Swearing', value: 'false', x: 1300, y: 425 },
                { name: 'Not talking over the other person', value: 'true', x: 620, y: 710 },
                { name: 'Not letting the other person talk', value: 'false', x: 1300, y: 710 }
            ],
            answer: 'true',
            feedback_correct: 'Good job! You got the correct answer...',
            feedback_wrong: 'Whoops! You didn’t get that quite right...'
        },
        {
            question: `Respectful and disrespectful behaviours: 5/6`,
            choices: [
                { name: 'Listening when the other person is talking', value: 'true', x: 620, y: 425 },
                { name: 'Telling the person to shut up or be quiet', value: 'false', x: 1300, y: 425 },
                { name: 'Making fun of the other person or their feelings', value: 'false', x: 620, y: 710 },
                { name: 'Using your body to threaten or intimidate', value: 'false', x: 1300, y: 710 }
            ],
            answer: 'true',
            feedback_correct: 'Good job! You got the correct answer...',
            feedback_wrong: 'Whoops! You didn’t get that quite right...'
        },
        {
            question: `Respectful and disrespectful behaviours: 6/6`,
            choices: [
                { name: 'Not listening to the other person’s opinions', value: 'false', x: 620, y: 425 },
                { name: 'Using kind words with each other', value: 'true', x: 1300, y: 425 },
                { name: 'Pressuring others to do something they don’t want to do', value: 'false', x: 620, y: 710 },
                { name: 'Making someone feel bad', value: 'false', x: 1300, y: 710 }
            ],
            answer: 'true',
            feedback_correct: 'Good job! You got the correct answer...',
            feedback_wrong: 'Whoops! You didn’t get that quite right...'
        }
    ]
}



export { 
   INTRO_E2, INTRO_E3,
   GM1_E3, GM1_E5,
   GM2_E1, GM2_E5,
   GM3_E2, GM3_E4,
};
