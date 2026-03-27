// =====================================================================
// CHARACTER ROSTER
// =====================================================================
// To add a character, push a new entry into this array.
//
// sprite loading example (do this before game starts):
//   import { CHARACTERS } from './characters.js';
//   const img = new Image();
//   img.src = 'assets/sprites/cat.png';
//   img.onload = () => { CHARACTERS[0].sprite = img; };
//
// Sprite sheets are read left-to-right, one row per animation state.
// Frame size is defined by spriteFrameWidth / spriteFrameHeight.
// (Placeholder drawing is used automatically when sprite is null.)
// =====================================================================

export const CHARACTERS = [
  {
    id:               'cat',
    name:             'Cat',
    color:            '#FF9955',   // body color for placeholder art
    accentColor:      '#CC5500',   // head/detail color for placeholder art
    sprite:           null,        // set to HTMLImageElement once loaded
    spriteFrameWidth:  24,
    spriteFrameHeight: 40,
    stats: {
      speed:       3.0,   // walk speed (px/frame)
      jumpForce:   11,    // upward velocity on jump
      lightDamage: 8,     // damage for light attack
      heavyDamage: 18,    // damage for heavy attack
    },
  },
  {
    id:               'rabbit',
    name:             'Rabbit',
    color:            '#AADDFF',
    accentColor:      '#4488BB',
    sprite:           null,
    spriteFrameWidth:  24,
    spriteFrameHeight: 40,
    stats: { speed: 3.5, jumpForce: 13, lightDamage: 7, heavyDamage: 14 },
  },
  {
    id:               'fox',
    name:             'Fox',
    color:            '#FF5533',
    accentColor:      '#991100',
    sprite:           null,
    spriteFrameWidth:  24,
    spriteFrameHeight: 40,
    stats: { speed: 2.5, jumpForce: 10, lightDamage: 12, heavyDamage: 22 },
  },
  {
    id:               'dog',
    name:             'Dog',
    color:            '#99BB66',
    accentColor:      '#446622',
    sprite:           null,
    spriteFrameWidth:  24,
    spriteFrameHeight: 40,
    stats: { speed: 2.8, jumpForce: 10, lightDamage: 10, heavyDamage: 20 },
  },
  // Add more characters here!
];
