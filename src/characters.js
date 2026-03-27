// =====================================================================
// CHARACTER ROSTER  (9 slots)
// =====================================================================
// To add your character art:
//   1. Copy assets/characters/character_template.js and add your drawFn
//   2. Import it below and set it on the matching entry's drawFn field
//   3. Fill in name, color, accentColor and stats
//
// Example (uncomment when your file is ready):
// import { drawFn as catDraw }     from '../assets/characters/cat.js';
// import { drawFn as rabbitDraw }  from '../assets/characters/rabbit.js';
// =====================================================================

export const CHARACTERS = [

  {
    id:          'cat',
    name:        'Cat',
    color:       '#FF9955',
    accentColor: '#CC5500',
    drawFn:      null,   // ← set to your imported draw function
    sprite:      null,
    stats: { speed: 3.0, jumpForce: 11, lightDamage: 8,  heavyDamage: 18 },
  },
  {
    id:          'rabbit',
    name:        'Rabbit',
    color:       '#AADDFF',
    accentColor: '#4488BB',
    drawFn:      null,
    sprite:      null,
    stats: { speed: 3.5, jumpForce: 13, lightDamage: 7,  heavyDamage: 14 },
  },
  {
    id:          'fox',
    name:        'Fox',
    color:       '#FF5533',
    accentColor: '#991100',
    drawFn:      null,
    sprite:      null,
    stats: { speed: 2.5, jumpForce: 10, lightDamage: 12, heavyDamage: 22 },
  },
  {
    id:          'dog',
    name:        'Dog',
    color:       '#99BB66',
    accentColor: '#446622',
    drawFn:      null,
    sprite:      null,
    stats: { speed: 2.8, jumpForce: 10, lightDamage: 10, heavyDamage: 20 },
  },
  {
    id:          'bear',
    name:        'Bear',
    color:       '#CC8855',
    accentColor: '#664422',
    drawFn:      null,
    sprite:      null,
    stats: { speed: 2.2, jumpForce: 9,  lightDamage: 13, heavyDamage: 25 },
  },
  {
    id:          'bird',
    name:        'Bird',
    color:       '#FFEE55',
    accentColor: '#AA8800',
    drawFn:      null,
    sprite:      null,
    stats: { speed: 4.0, jumpForce: 14, lightDamage: 6,  heavyDamage: 12 },
  },
  {
    id:          'frog',
    name:        'Frog',
    color:       '#55CC88',
    accentColor: '#227744',
    drawFn:      null,
    sprite:      null,
    stats: { speed: 3.2, jumpForce: 15, lightDamage: 8,  heavyDamage: 16 },
  },
  {
    id:          'hamster',
    name:        'Hamster',
    color:       '#FFCC99',
    accentColor: '#CC8855',
    drawFn:      null,
    sprite:      null,
    stats: { speed: 3.8, jumpForce: 11, lightDamage: 7,  heavyDamage: 13 },
  },
  {
    id:          'dragon',
    name:        'Dragon',
    color:       '#AA44CC',
    accentColor: '#551188',
    drawFn:      null,
    sprite:      null,
    stats: { speed: 2.6, jumpForce: 12, lightDamage: 11, heavyDamage: 24 },
  },

];
