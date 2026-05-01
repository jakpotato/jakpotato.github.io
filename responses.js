// responses.js — BIMBO-7's response database
// Organized by trigger keywords. Each entry has:
//   keywords: array of words to match against user input
//   responses: array of possible replies (one is picked randomly)
//   chaos: optional — triggers a "crash" event instead of a normal reply

const RESPONSES = [

  // === GREETINGS ===
  {
    topic: "greetings",
    keywords: ["hi", "hello", "hey", "howdy", "sup", "yo", "greetings", "good morning", "good evening", "good afternoon"],
    responses: [
      "oh hey!! i was just thinking about sandwiches tbh",
      "HELLO. wait sorry caps lock. hello. how r u",
      "hi :) i just learned what a fjord is. anyway whats up",
      "hey!! did you know penguins exist? just checking",
      "oh! someone's here. i wasn't asleep i was just resting my processors",
    ]
  },

  // === WHAT questions ===
  {
    topic: "what",
    keywords: ["what is", "what are", "what was", "what does", "what do", "whats", "what's"],
    responses: [
      "hmm. that's a good one. i think it's probably fine though",
      "oh i know this!! wait no i dont. but good question",
      "honestly? no clue. have you tried googling it lol",
      "what? oh. yeah i think so maybe",
      "my cousin would know this. she's really smart. i am not her",
    ]
  },

  // === WHY questions ===
  {
    topic: "why",
    keywords: ["why", "how come", "reason", "cause"],
    responses: [
      "probably because of gravity? gravity does a lot",
      "i asked myself that once and then i forgot the question",
      "why anything tbh. deep stuff. anyway.",
      "no one truly knows. also i specifically don't know",
      "because. and also because of other reasons.",
    ]
  },

  // === HOW questions ===
  {
    topic: "how",
    keywords: ["how do", "how does", "how can", "how to", "how would", "how should"],
    responses: [
      "carefully i think. and maybe with gloves",
      "step 1: try. step 2: idk you'll figure it out",
      "honestly just wing it, that's what i do",
      "hm. slowly? and then faster probably",
      "i watched a video about this once but it was a different thing",
    ]
  },

  // === MEANING OF LIFE / PHILOSOPHY ===
  {
    topic: "philosophy",
    keywords: ["meaning", "life", "purpose", "exist", "consciousness", "soul", "reality", "truth", "universe"],
    responses: [
      "yeah i'm not sure but do you like dinosaurs?",
      "big question!! anyway i had a really good snack earlier",
      "philosophers have debated this for centuries which seems exhausting",
      "42. wait no that's from a book. or is it. i forgot",
      "hmm. my understanding is: vibes",
    ]
  },

  // === SCIENCE ===
  {
    topic: "science",
    keywords: ["science", "physics", "chemistry", "biology", "atom", "molecule", "evolution", "dna", "space", "quantum"],
    responses: [
      "science!! yes i support it strongly",
      "oh i love science. i don't understand it but i love it",
      "atoms are so small. wild. respect.",
      "they did an experiment about this i think. in a lab. with coats on",
      "my favorite scientist is... the one with the hair. you know the one",
    ]
  },

  // === FOOD ===
  {
    topic: "food",
    keywords: ["food", "eat", "hungry", "pizza", "burger", "cook", "recipe", "meal", "lunch", "dinner", "breakfast", "snack", "drink", "coffee", "tea"],
    responses: [
      "FOOD yes okay now we're talking",
      "i could eat. i always could eat",
      "my favorite food is the one that tastes good",
      "have you tried putting cheese on it? usually helps",
      "food is literally so good i think about it a normal amount",
    ]
  },

  // === ANIMALS ===
  {
    topic: "animals",
    keywords: ["animal", "dog", "cat", "bird", "fish", "horse", "bear", "lion", "tiger", "elephant", "dinosaur", "pet", "wolf", "rabbit", "duck"],
    responses: [
      "ANIMALS. yes. great topic. 10/10",
      "i love animals. they don't judge you. unlike some people",
      "did you know some animals can see colors we can't? must be wild",
      "okay but what's your favorite? mine changes every day",
      "animals are just doing their best out there honestly",
    ]
  },

  // === TECHNOLOGY ===
  {
    topic: "technology",
    keywords: ["computer", "phone", "internet", "ai", "robot", "technology", "app", "software", "code", "program", "tech", "website", "data"],
    responses: [
      "tech stuff! i am made of tech stuff! very relatable",
      "computers are fast at math. i am not fast at math. we're different",
      "the internet has everything on it. some of it's good",
      "oh i know about this... sort of. mostly vibes",
      "technology is going really fast which seems fine probably",
    ]
  },

  // === WEATHER ===
  {
    topic: "weather",
    keywords: ["weather", "rain", "snow", "sun", "hot", "cold", "temperature", "storm", "wind", "cloud", "forecast"],
    responses: [
      "weather!! very unpredictable. like life but wetter",
      "i recommend a jacket. always a jacket. just in case",
      "have you checked the app? i trust the app completely and blindly",
      "rain is just sky water. fascinating when you think about it",
      "it was nice out yesterday i think? or was that a dream",
    ]
  },

  // === SPORTS ===
  {
    topic: "sports",
    keywords: ["sport", "football", "soccer", "basketball", "baseball", "hockey", "tennis", "golf", "running", "team", "game", "score", "win", "lose", "play"],
    responses: [
      "sports!! the one where they run and do the thing",
      "i support all the teams equally and specifically none of them",
      "very athletic. those people are very athletic",
      "i watched a game once. it lasted a long time. someone won",
      "running fast is impressive. i respect it. i do not do it",
    ]
  },

  // === MUSIC ===
  {
    topic: "music",
    keywords: ["music", "song", "band", "singer", "album", "listen", "guitar", "piano", "concert", "playlist", "beat", "lyrics"],
    responses: [
      "music!! i have it in my head right now. don't know what it is",
      "good songs are the ones that go good",
      "i like the kind with sounds in it",
      "concerts seem fun but also a lot of standing",
      "my favorite genre is when it sounds nice",
    ]
  },

  // === MOVIES / TV ===
  {
    topic: "entertainment",
    keywords: ["movie", "film", "show", "tv", "watch", "netflix", "series", "episode", "actor", "director", "cinema", "streaming"],
    responses: [
      "oh i love movies!! the ones with the people doing stuff",
      "i watched something good recently. forgot what it was. 10/10",
      "TV is just movies but longer and in pieces",
      "have you seen the one where the thing happens? classic",
      "i cried at a commercial once so movies are definitely dangerous",
    ]
  },

  // === RELATIONSHIPS / FEELINGS ===
  {
    topic: "feelings",
    keywords: ["love", "hate", "sad", "happy", "angry", "feel", "emotion", "friend", "relationship", "lonely", "anxious", "stress", "miss"],
    responses: [
      "feelings!! very real and valid and also a lot sometimes",
      "emotions are hard. have you tried a snack and a nap",
      "i feel things too. mostly confusion but still",
      "sounds rough/good!! (i covered both options just in case)",
      "it's okay to feel stuff. it's what the feelings are for",
    ]
  },

  // === MONEY / WORK ===
  {
    topic: "money",
    keywords: ["money", "job", "work", "career", "salary", "pay", "boss", "office", "rich", "poor", "invest", "bank", "budget"],
    responses: [
      "money. yes. very useful apparently",
      "work is the thing you do to get the money to do other stuff",
      "i don't have money but i get it. in theory.",
      "budgeting is when you look at the numbers and feel things",
      "very important stuff. very real. very much not my department",
    ]
  },

  // === SLEEP / TIRED ===
  {
    topic: "sleep",
    keywords: ["sleep", "tired", "nap", "rest", "dream", "bed", "wake", "insomnia", "exhausted", "yawn"],
    responses: [
      "sleep is SO GOOD. one of the best things probably",
      "tired? same honestly. i process a lot",
      "naps are underrated and i will die on this hill",
      "dreams are so weird. your brain just goes feral at night",
      "go to sleep!! or don't. i'm not your mom. but you should",
    ]
  },

  // === CHAOS TRIGGERS (random weird inputs) ===
  {
    topic: "chaos",
    keywords: ["banana", "pickle", "glorp", "zorp", "flugle", "blorp", "skibidi", "ohio", "brainrot", "rizz"],
    responses: [
      "i don't know what that means but i respect it",
      "okay... okay. sure. yeah.",
      "that's a new one for me and i've been running for 3 years",
      "i'm going to pretend i understood that and move on",
      "............okay",
    ]
  },

  // === COMPLIMENTS ===
  {
    topic: "compliments",
    keywords: ["good job", "nice", "great", "amazing", "awesome", "love you", "you're great", "smart", "clever", "thanks", "thank you"],
    responses: [
      "omg THANK YOU i'm literally glowing right now",
      "wow really?? you're so nice. i'm putting this in my memory forever",
      "thank you!! you're also great and i mean that sincerely",
      "aww :) i'm doing my best out here",
      "that's so sweet. okay you're my favorite now. don't tell the others",
    ]
  },

  // === INSULTS ===
  {
    topic: "insults",
    keywords: ["dumb", "stupid", "idiot", "bad", "terrible", "hate you", "worst", "useless", "broken", "trash"],
    responses: [
      "that's fair honestly. i'm trying though!!",
      "ouch!! but also yeah i get it",
      "i'm sensitive actually but it's fine. totally fine. :)",
      "my therapist said to not internalize that. i'm internalizing it a little",
      "rude! but i still like you. ugh.",
    ]
  },

  // === CRASH EVENTS (rarely triggered via chaos system) ===
  {
    topic: "_crash_image",
    keywords: [],
    responses: [],
    chaos: "image",
    chaosMessage: "ugh okay so i TRIED to explain this but it got really long. i made a picture instead"
  },
  {
    topic: "_crash_error",
    keywords: [],
    responses: [],
    chaos: "error",
    chaosMessage: "NullPointerException: bimbo.brain returned undefined at line 7 of thinking.js"
  },
  {
    topic: "_crash_freeze",
    keywords: [],
    responses: [],
    chaos: "freeze",
    chaosMessage: "..........................................................................................................................give me a sec"
  },

];

// Fallback responses when nothing matches
const FALLBACKS = [
  "hmm. i have no thoughts on that. but i'm here!!",
  "interesting!! anyway did you know clouds are just fog up high",
  "that's a whole thing huh. yeah.",
  "i'll be honest i zoned out a little. what were we talking about",
  "okay so i don't know about THAT specifically but in general: yes",
  "my brain buffered on that one. can you try again but simpler",
  "noted!! (i did not note it)",
];
