// ==================================================
// GAME VARIABLES
// ==================================================
const GAME = {}
const GM1_E1 = {
   BODY_OBJECTS: [
      { name: 'cloud', x: -800, y: -125, scale:0.15, title: 'Your Thoughts',
         alert: `Sometimes we can think about sad or scary things, ${
            '\n'}this can make us upset or scared. These feelings might ${
            '\n'}be tricky because even if it is normal to have these feelings, ${
            '\n'}they can travel with us to school or while we are with our friends.`,
         hitarea: [ {x:540, y:0}, {x:690, y:330}, {x:400, y:890}, {x:250, y:890}, 
            {x:120, y:750}, {x:20, y:400}, {x:210, y:100}, {x:540, y:0} ]
      },
      { name: 'heart', x: -100, y: -40, scale:0.123, title: 'Your Heart',
         alert: `When you get scared or nervous, your heart can start to beat really fast. ${
            '\n'}It’s ok though, this is just your body’s way of coping with it.`,
         hitarea: [ {x:100, y:0}, {x:750, y:50}, {x:950, y:320},
            {x:510, y:725}, {x:0, y:220}, {x:100, y:0} ]
      },
      { name: 'butterfly', x: 225,  y: 150, scale:0.188, title: 'Butterflies',
         alert: `When our heart beats fast because we are scared or nervous, ${
            '\n'}we can get a funny feeling in our tummies as well.`,
            hitarea: [ {x:0, y:260}, {x:450, y:200}, {x:690, y:0}, {x:950, y:420}, 
               {x:500, y:600}, {x:0, y:260} ]
      },
      { name: 'lightning', x: -150, y: 405, scale:0.123, title: 'Goosebumps',
         alert: `Sometimes we can get little bumps on our skin when we have an exciting ${
            '\n'}or scary thought. This is nothing to worry about.`,
            hitarea: [{x:900, y:0}, {x:525, y:190}, {x:705, y:369}, {x:5, y:494}, 
               {x:350, y:269}, {x:190, y:100}, {x:900, y:0} ]},
      { name: 'rattle', x: 680,  y: -145, scale:0.123, title: 'Shaking',
         alert: `When we get really scared, our hands and other body parts can shake. ${
            '\n'}This will stop when we are not scared anymore. `,
            hitarea: [{x:140, y:0}, {x:350, y:40}, {x:450, y:200}, {x:900, y:200}, {x:900, y:420},
               {x:400, y:360}, {x:260, y:440}, {x:50, y:360}, {x:0, y:150}, {x:140, y:0} ]},
   ],

   PATHS: [
      // HEAD
      [  { x: 120, y: 135 }, { x: 80,  y: 225 }, { x: 80,  y: 290 }, { x: 105, y: 350 },
         { x: 150, y: 390 }, { x: 200, y: 415 }, { x: 230, y: 395 }, { x: 235, y: 360 },
         { x: 225, y: 305 }, { x: 260, y: 180 }, { x: 280, y: 125 }, { x: 275, y: 95  } ],

      // HEART
      [  { x: 790, y: 400 }, { x: 760, y: 345 }, { x: 765, y: 300 }, { x: 830, y: 260 },
         { x: 950, y: 270 }, { x: 975, y: 300 }, { x: 970, y: 340 }, { x: 940, y: 400 } ],

      // STOMACH
      [  { x: 1280, y: 455 }, { x: 1225, y: 430 }, { x: 1150, y: 430 }, { x: 1085, y: 475 },
         { x: 1070, y: 535 }, { x: 1080, y: 620 }, { x: 1100, y: 650 }, { x: 1165, y: 680 },
         { x: 1235, y: 685 }, { x: 1280, y: 665 } ],

      // ARMPIT
      [  { x: 735, y: 740 }, { x: 705, y: 765 }, { x: 690, y: 810 }, { x: 710, y: 830 },
         { x: 800, y: 840 }, { x: 885, y: 840 }, { x: 920, y: 815 }, { x: 920, y: 780 },
         { x: 890, y: 760 } ],

      // HAND
      [  { x: 1725, y: 195 }, { x: 1685, y: 190 }, { x: 1570, y: 205 }, { x: 1510, y: 200 },
         { x: 1505, y: 230 }, { x: 1515, y: 250 }, { x: 1575, y: 290 }, { x: 1650, y: 305 },
         { x: 1725, y: 305 } ],
   ]
}

const GM2_E3 = {
   NPCS: [
      { x: -770, y: 650, angle: 0, name: 'pastor', speechname: 'Minister',
         speech: `This could be the minister or leader at your church, temple or synagogue.` },
      { x: 2380, y: 669, angle: 0, name: 'friend_parents', 
         speechname:`        Friend\'s\n        Parents`,
         speech: `You can talk to parents of a friend you trust.` },
      { x: 3350, y: 1440, angle: 90, name: 'librarian', speechname: 'Librarian',
         speech: `The library is a quiet safe space, librarians are always friendly and helpful.` },
      { x: 1500, y: 1490, angle: 90, name: 'doctor', speechname: 'Your Doctor',
         speech: `You can talk to your doctor about anything that is worrying you.` },
      { x: -550, y: 2750, angle: 0, name: 'teacher', speechname: 'Student Services',
         speech: `This could be a teacher, student services officer or Chaplin at your school.` },
      { x: 50, y: 3444, angle: 90, name: 'teacher_sport', speechname: 'Sports Coach',
         speech: `You can always talk to the sports coach or physical education teacher at your school.` },
      { x: 1400, y: 2676, angle: 0, name: 'police', speechname: 'Police Officer',
         speech: `You can always talk to police officers if you feel unsafe or scared.` },
      { x: 3155, y: 3000, angle: 0, name: 'lifeguard', speechname: 'Lifeguard',
         speech: `A lifeguard has a responsibility to protect you in the pool.` },
   ],

   COINS: [
      { x: -770, y: 775, count: 22, xgen: 1, ygen: 0 },
      { x: 210,  y: 950, count: 13, xgen: 0, ygen: 1 },
      { x: 1767, y: 950, count: 6,  xgen: 0, ygen: 1 },
      { x: 350,  y: 2305, count: 10, xgen: 1, ygen: 0 },
      { x: 2415, y: 2420, count: 6, xgen: 0, ygen: 1 },
      { x: 2600, y: 2869, count: 5, xgen: 1, ygen: 0 }
   ]
}

const GM2_E5 = {
   QUIZ: [
      {
         question: `1. Online Safety Question 1?`,
         choices: [
            { description: 'Yes', value: 'true', x: 633, y: 450 },
            { description: 'No', value: 'false', x: 633, y: 550 }
         ],
         answer: 'true',
         feedback_correct: 'Good job! You got the correct answer...',
         feedback_wrong: 'Whoops! You didn’t get that quite right...'
      },
      {
         question: `2. Online Safety Question 2?`,
         choices: [
            { description: 'Yes', value: 'false', x: 633, y: 450 },
            { description: 'No', value: 'true', x: 633, y: 550 }
         ],
         answer: 'true',
         feedback_correct: 'Good job! You got the correct answer...',
         feedback_wrong: 'Whoops! You didn’t get that quite right...'
      },
      {
         question: `3. Online Safety Question 3?`,
         choices: [
            { description: 'Yes', value: 'true', x: 633, y: 450 },
            { description: 'No', value: 'false', x: 633, y: 550 }
         ],
         answer: 'true',
         feedback_correct: 'Good job! You got the correct answer...',
         feedback_wrong: 'Whoops! You didn’t get that quite right...'
      },
   ]
}

const GM3_E1 = {
   CHARACTERS1: [
      { name: 'Mum',    x: 1310, y: 275, rename: false, circle: ''},
      { name: 'Sister', x: 1310, y: 380, rename: false, circle: ''},
      { name: 'Me',     x: 1310, y: 485, rename: false, circle: ''},
      { name: 'Guardian', x: 1310, y: 590, rename: false, circle: ''},
      { name: '   ',    x: 1310, y: 695, rename: true, circle: ''},
      { name: '   ',    x: 1310, y: 800, rename: true, circle: ''},

      { name: 'Dad',    x: 1640, y: 275, rename: false, circle: ''},
      { name: 'Brother', x: 1640, y: 380, rename: false, circle: ''},
      { name: 'Foster carer', x: 1640, y: 485, rename: false, circle: ''},
      { name: 'Aunty',  x: 1640, y: 590, rename: false, circle: ''},
      { name: '   ',    x: 1640, y: 695, rename: true, circle: ''},
      { name: '   ',    x: 1640, y: 800, rename: true, circle: ''}
   ],
   CHARACTERS2: [
      { name: 'Teacher',   x: 1310, y: 275, rename: false, circle: '1'},
      { name: 'Stranger',  x: 1310, y: 380, rename: false, circle: '2'},
      { name: 'Nurse',     x: 1310, y: 485, rename: false, circle: '1'},
      { name: 'Thief',     x: 1310, y: 590, rename: true, circle: '2'},
      { name: 'Fireman',   x: 1310, y: 695, rename: true, circle: '1'},
      { name: 'Bad',       x: 1310, y: 800, rename: true, circle: '2'},

      { name: 'Doctor',    x: 1640, y: 275, rename: false, circle: '1'},
      { name: 'Bully',     x: 1640, y: 380, rename: false, circle: '2'},
      { name: 'Policeman', x: 1640, y: 485, rename: true, circle: '1'},
      { name: 'Counsellor', x: 1640, y: 590, rename: true, circle: '1'},
      { name: 'Gang',      x: 1640, y: 695, rename: true, circle: '2'},
      { name: 'Good',      x: 1640, y: 800, rename: true, circle: '1'}
   ],
   
   CIRCLES1: [
      { name: 'Extended Family', circle: '2', radius: 480,
         x: -400, y: 0, textY: -400 },
      { name: 'Immediate Family', circle: '1', radius: 266,
         x: -400, y: 0, textY: -100 },
  ],
  CIRCLES2: [
     { name: 'Not Safe', circle: '2', radius: 480,
         x: -400, y: 0, textY: -400 },
     { name: 'Friends of our Family', circle: '1', radius: 266,
         x: -400, y: 0, textY: -100 },
 ],
}

const GM3_E4 = {
   MESSAGES: [
      {
         content: 'I want to tell you how I am feeling.'
      },
      {
         content: 'I’m worried about Mum getting hurt.'
      },
      {
         content: 'I have the right to feel safe.'
      },
      {
         content: 'I need you to talk with someone and get some help.'
      },
      {
         content: 'I need you to stop yelling as it scares and upsets me.'
      },
      {
         content: 'I need you to love and respect me and Mum.'
      },
      {
         content: 'Sometimes I feel like running away.'
      },
      {
         content: 'Sometimes I think that it\'s my fault but I know that it isn’t.'
      },
      {
         content: 'I get so scared listening to you fight.'
      },
      {
         content: 'I’m so confused as I love you but I don’t like that you hurt us.'
      },
      {
         content: 'I get so upset when you call Mum mean names.'
      },
      {
         content: 'I want to feel safe.'
      },
      {
         content: 'Even though I hide, I know what’s going on as I hear you.'
      },
      {
         content: 'I don’t feel safe when you get angry.'
      },
   ]
}



export { 
   GAME,
   GM1_E1,
   GM2_E3, GM2_E5,
   GM3_E1, GM3_E4,
};
