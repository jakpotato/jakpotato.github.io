/* ============================================================
   BRAND CONFIG — change these two lines to rebrand the whole app.
   Everything else reads from these variables.
   ============================================================ */
const APP_NAME = "Fizzle";
const APP_TAGLINE = "where your worst thoughts go to get 3 comments.";
const APP_MARK = "🫧";

/* ============================================================
   PEOPLE
   ============================================================ */
const FIRST_NAMES = [
  "Olivia", "Liam", "Noah", "Emma", "Ava", "Mason", "Kevin", "Gary", "Steve",
  "Denise", "Chad", "Karen", "Todd", "Brenda", "Doug", "Linda", "Kyle",
  "Tiffany", "Nigel", "Priya", "Wei", "Fatima", "Carlos", "Yuki", "Ingrid",
  "Zorb", "Blorptin", "Xanthe", "Muffin", "Waffles", "Pickle", "Reginald",
  "Bartholomew", "Gertrude", "Cheryl", "Dwight", "Sheila", "Big Steve",
  "Lil Kevin", "Aunt Carol", "Uncle Ray", "Moon", "Basil", "Nacho", "Trish",
  "Percival", "Marge", "Chungus", "Dorito", "Susan", "Frank", "Beatrice"
];

const LAST_NAMES = [
  "Smith", "Johnson", "Fizzlebottom", "McGillicuddy", "O'Reilly", "Nguyen",
  "Patel", "Vance", "Thundergoat", "Applewhite", "Kowalski", "Higgins",
  "Von Trapp", "Sparklehorse", "Bumfield", "Rodriguez", "Chen", "Okafor",
  "Larsen", "Beaumont", "Wobblesworth", "Grimshaw", "Featherstone",
  "Crumbcake", "Doomsworth", "Pickleman", "Snoutley", "Von Waffle",
  "Nooniverse", "Baggins", "Struthers", "Kettlewell", "Marsh", "Okonkwo",
  "Delacroix", "Higginbottom", "Trundlebee", "Vasquez", "Yodelmeyer"
];

const AVATAR_EMOJIS = [
  "😀", "😎", "🤓", "🥸", "🤠", "🥳", "🤖", "👽", "🧙", "🧛", "🦸", "🧟",
  "🦊", "🐸", "🐶", "🐱", "🦄", "🐼", "🦖", "🐧", "🦁", "🐢", "🐙", "🦑",
  "🐨", "🐵", "🦥", "🦦", "🦩", "🐝", "🦖", "🐹", "🌵", "🍕", "🍩", "🧀",
  "🥑", "🌮", "⚡", "🎃", "👻", "🔥", "🌈", "🍄", "🎱", "🛸", "🧦", "🪐"
];

/* ============================================================
   TEMPLATE INGREDIENTS
   ============================================================ */
const TOPICS = [
  "pineapple on pizza", "Mercury retrograde", "Wi-Fi passwords", "group chats",
  "capitalism", "astrology", "the meaning of Tuesdays", "existential dread",
  "gluten", "NFTs", "the multiverse", "small talk", "daylight saving time",
  "group projects", "self-checkout machines", "karma", "minimalism",
  "cryptocurrency", "birdwatching", "competitive napping", "feng shui",
  "the office microwave", "parallel parking", "houseplants", "oat milk"
];

const ANIMALS = [
  "raccoon", "capybara", "ferret", "llama", "pigeon", "goose", "possum",
  "hedgehog", "otter", "alpaca", "wombat", "peacock", "iguana", "walrus",
  "chinchilla", "flamingo", "sloth", "badger", "gecko", "ostrich"
];

const FOODS = [
  "nachos", "gas station sushi", "expired yogurt", "mystery casserole",
  "gummy worms", "cold pizza", "protein powder", "ranch dressing",
  "seven-layer dip", "canned soup", "birthday cake", "beef jerky",
  "kombucha", "string cheese", "tater tots", "pickles", "dry cereal",
  "fruit snacks", "hot sauce", "instant noodles"
];

const PLACES = [
  "the DMV", "my in-laws' basement", "the grocery store", "a Waffle House",
  "the office break room", "the airport", "a Denny's parking lot", "the gym",
  "my landlord's office", "the mall food court", "a Costco",
  "the local library", "the vet's waiting room", "a Ren Faire",
  "the county fair", "a Target", "my cousin's wedding", "a laundromat",
  "a gas station", "the DMV parking lot"
];

const ACTIVITIES = [
  "doomscrolling", "alphabetizing the spice rack", "folding laundry",
  "competitive thumb wrestling", "reorganizing the fridge",
  "learning the accordion", "arguing with a self-checkout machine",
  "journaling", "power walking", "assembling IKEA furniture",
  "birdwatching", "meal prepping", "untangling headphones",
  "practicing interpretive dance", "building a blanket fort",
  "negotiating with a vending machine"
];

const OBJECTS = [
  "toaster", "left sock", "garden gnome", "houseplant", "Roomba",
  "umbrella", "lava lamp", "stapler", "rubber duck", "traffic cone",
  "snow globe", "fax machine", "disco ball", "inflatable flamingo",
  "cheese grater"
];

const TIMES = [
  "3am", "Monday morning", "lunch break", "midnight", "6am", "the weekend",
  "Sunday night", "rush hour", "golden hour", "2pm on a Tuesday"
];

const NUMBERS = ["2", "3", "4", "5", "7", "9", "11", "13", "15", "22", "37", "42", "99"];

/* ============================================================
   POST TEMPLATES
   Mix of absurd/funny (majority) and normal-ish (minority),
   shuffled together so they come up mixed in the feed.
   Placeholders: {topic} {animal} {food} {place} {activity}
   {object} {time} {number}
   ============================================================ */
const POST_TEMPLATES = [
  // --- normal-ish ---
  "Just finished {activity}. Feeling weirdly accomplished.",
  "Can't believe it's already {time}, this week flew by.",
  "Anyone have recommendations for good {food} near {place}?",
  "Finally got around to {activity} today. Long overdue.",
  "Coffee count today: {number}. No regrets.",
  "Rainy day, perfect excuse to stay in and do some {activity}.",
  "Just adopted a {animal}. Meet the newest member of the family.",
  "Miss the days when {place} used to be quiet.",
  "Trying to get better about {topic}. Slow progress.",
  "Made {food} for dinner and it actually turned out great.",
  "Early morning {activity} hits different.",
  "Reminder to drink water and maybe think about {topic} less.",

  // --- funny / absurd (majority) ---
  "My {animal} just tried to file taxes. I'm concerned.",
  "Woke up convinced I was a {object}. Recovery ongoing.",
  "Told my {animal} it's not my birthday and it left the room.",
  "Ate {number} {food} in one sitting and I regret nothing except my life choices.",
  "Local {animal} spotted operating a food truck near {place}. Health inspector unavailable for comment.",
  "I speedran {activity} in {number} minutes. Personal best. Nobody asked.",
  "Scientists still can't explain why my {object} smells like {food}.",
  "Broke up with my {object} today. It just wasn't {topic} enough for me.",
  "If {animal}s could vote, {place} would be a very different city.",
  "Started a petition to rename {time} to something with more personality.",
  "My horoscope said I'd find love today. Found a {food} instead. Astrology is dead to me.",
  "Held a full conversation with a {animal} about {topic}. It had strong opinions.",
  "Accidentally joined a cult about {topic}. The snacks are great though.",
  "Day {number} of trying to convince my {animal} that {food} is not a toy.",
  "Just got kicked out of {place} for aggressive interpretive dance about {topic}.",
  "My therapist said I need to stop projecting onto my {object}. We'll see.",
  "Invented a new sport combining {activity} and {topic}. Awaiting Olympic committee response.",
  "Why does {place} smell like {food} at {time}? Asking for a friend.",
  "My {animal} unionized. Demands include more {food} and shorter {activity} hours.",
  "Turns out {number} {object}s is the legal limit before {place} calls security.",
  "Woke up at {time} to my {animal} staring directly into my soul about {topic}.",
  "Tried to return my {object} to {place}. They said it wasn't purchased there. It wasn't purchased anywhere.",
  "PSA: do not let a {animal} near {number} servings of {food}. Learned this the hard way.",
  "Spent {number} hours explaining {topic} to my {object}. It gets it now. I think.",
  "Just witnessed a {animal} cut in line at {place} and honestly, respect.",
  "My New Year's resolution was to stop talking to my {object} about {topic}. It's {time}. I have failed.",
  "Filed a formal complaint against {time} for personally attacking me.",
  "The {object} in my kitchen has opinions about {topic} and won't stop sharing them.",
  "Confirmed: {place} is just a portal to a dimension made entirely of {food}.",
  "My {animal} ran for local office on a platform of more {food} and fewer {activity} restrictions. It's winning.",
  "Update: the {object} is still missing. Last seen near {place} discussing {topic}.",
  "Nothing says 'adulthood' like crying in a {place} parking lot over {food}."
];

/* ============================================================
   COMMENT TEMPLATES
   Placeholders: {animal} {object} {place} {topic} {name}
   ============================================================ */
const COMMENT_TEMPLATES = [
  "lol same",
  "this is the content I signed up for",
  "not the {animal} 😭",
  "wait what",
  "I felt this in my soul",
  "screenshotting this",
  "{name} you need to see this",
  "absolutely unhinged and I love it",
  "the {object} really said what it said",
  "why is this so real",
  "I'm calling the {place} authorities",
  "delete this immediately",
  "this you?",
  "no because {topic} is NOT it",
  "big if true",
  "sir this is a Wendy's",
  "certified {topic} moment",
  "I've never related to anything more",
  "who let {name} post this",
  "10/10 no notes",
  "the way I gasped",
  "okay but the {animal} has a point",
  "sending this to my group chat immediately",
  "this ages like milk and I'm here for it",
  "not me reading this at 2am"
];
