// =====================================================================
// WEAPON ROSTER
// =====================================================================
// To add your weapon art:
//   1. Copy assets/weapons/weapon_template.js and add your drawFn
//   2. Import it below and set it on the matching entry's drawFn field
//
// Example (uncomment when your file is ready):
// import { drawFn as swordDraw }   from '../assets/weapons/sword.js';
// import { drawFn as hammerDraw }  from '../assets/weapons/hammer.js';
// =====================================================================

export const WEAPONS = [

  {
    id:          'sword',
    name:        'Sword',
    color:       '#AABBDD',   // cell preview colour when drawFn is null
    accentColor: '#445577',
    drawFn:      null,        // ← set to your imported draw function
    stats: {
      lightDamageBonus: 3,   // added on top of character's lightDamage
      heavyDamageBonus: 6,
      reachBonus:       8,   // extra px of attack reach
    },
  },
  {
    id:          'dagger',
    name:        'Dagger',
    color:       '#DDAAAA',
    accentColor: '#774444',
    drawFn:      null,
    stats: {
      lightDamageBonus: 5,
      heavyDamageBonus: 3,
      reachBonus:       2,
    },
  },
  {
    id:          'hammer',
    name:        'Hammer',
    color:       '#CCAA77',
    accentColor: '#664422',
    drawFn:      null,
    stats: {
      lightDamageBonus: 2,
      heavyDamageBonus: 14,
      reachBonus:       4,
    },
  },
  {
    id:          'staff',
    name:        'Staff',
    color:       '#88AACC',
    accentColor: '#334466',
    drawFn:      null,
    stats: {
      lightDamageBonus: 4,
      heavyDamageBonus: 8,
      reachBonus:       14,
    },
  },
  {
    id:          'axe',
    name:        'Axe',
    color:       '#CC8877',
    accentColor: '#663322',
    drawFn:      null,
    stats: {
      lightDamageBonus: 4,
      heavyDamageBonus: 11,
      reachBonus:       6,
    },
  },
  {
    id:          'claws',
    name:        'Claws',
    color:       '#AADD88',
    accentColor: '#446622',
    drawFn:      null,
    stats: {
      lightDamageBonus: 6,
      heavyDamageBonus: 5,
      reachBonus:       0,
    },
  },

];
