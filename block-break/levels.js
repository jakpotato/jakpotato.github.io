/*
  LEVELS DATA
  -----------
  Each level is a grid of characters, 12 columns wide.
  Each character = one block:
    '.'      empty space (no block)
    '1'-'6'  a block that takes that many hits to break

  Block color is derived automatically from hit count (see COLORS in game.js):
    1 = red, 2 = orange, 3 = yellow, 4 = green, 5 = blue, 6 = purple
  As a block gets hit, its number goes down and its color updates to match
  (e.g. an orange '2' block becomes a red '1' block after one hit).

  To add a new level: copy a block below, edit the rows (keep each row
  exactly 12 characters), and add it to the LEVELS array in order.
*/

const LEVELS = [

  // Level 1 - simple intro
  {
    name: "First Contact",
    rows: [
      "222222222222",
      "111111111111",
      "111111111111",
      "111111111111",
    ],
  },

  // Level 2 - checkerboard
  {
    name: "Checkerboard",
    rows: [
      "212121212121",
      "121212121212",
      "212121212121",
      "121212121212",
    ],
  },

  // Level 3 - pyramid
  {
    name: "Pyramid",
    rows: [
      "....1111....",
      "...211112...",
      "..21111112..",
      ".2111111112.",
      "211111111112",
      "333333333333",
    ],
  },

  // Level 4 - fortified columns
  {
    name: "Twin Towers",
    rows: [
      "44........44",
      "44.222222.44",
      "44.111111.44",
      "44.222222.44",
      "44........44",
    ],
  },

  // Level 5 - diamond
  {
    name: "Diamond",
    rows: [
      ".....11.....",
      "....2222....",
      "...333333...",
      "..44444444..",
      "...333333...",
      "....2222....",
      ".....11.....",
    ],
  },

  // Level 6 - brick wall with gaps
  {
    name: "Brickyard",
    rows: [
      "555.555.555.",
      ".444.444.444",
      "333.333.333.",
      ".222.222.222",
      "111.111.111.",
    ],
  },

  // Level 7 - dense checkerboard, tougher blocks
  {
    name: "Crossfire",
    rows: [
      "313131313131",
      "131313131313",
      "313131313131",
      "131313131313",
      "313131313131",
    ],
  },

  // Level 8 - the vault (open bottom, thick walls)
  {
    name: "The Vault",
    rows: [
      "666666666666",
      "6..........6",
      "622222222226",
      "6..........6",
      "611111111116",
      "666666666666",
    ],
  },

  // Level 9 - final gauntlet, full coverage, descending toughness
  {
    name: "Last Stand",
    rows: [
      "666666666666",
      "555555555555",
      "444444444444",
      "333333333333",
      "222222222222",
      "111111111111",
    ],
  },

];
