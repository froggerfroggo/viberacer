// =====================================================================
// HOW TO ADD YOUR WEAPON ART
// =====================================================================
//
// 1. Copy this file, rename it (e.g. assets/weapons/my_sword.js)
// 2. Paste your drawing code inside drawFn below
// 3. Add your weapon entry to src/weapons.js (see bottom of this file)
//
// ── COORDINATE SYSTEM ────────────────────────────────────────────────
//
//   x, y = center-bottom of the CHARACTER holding the weapon (feet).
//   This is the same origin as the character's own drawFn, so your
//   weapon art lines up with the character automatically.
//
//   Useful reference points (right-facing character):
//
//       x,     y-38  ← top of head
//       x+5,   y-28  ← right shoulder
//       x+11,  y-18  ← right hand  ← good weapon origin
//       x,     y-12  ← hip / left hand
//       x,     y     ← feet / floor
//
//   For a sword held in the right hand, start drawing at (x+11, y-18)
//   and extend to the right (in the facing direction).
//
//   facing = 1  → right-facing (draw as normal)
//   facing = -1 → left-facing  (the ctx.scale(-1,1) trick below handles this)
//
// ── ANIMATION STATES ─────────────────────────────────────────────────
//
//   Use 'state' to change the weapon pose:
//
//   'idle'         at rest, hanging or held loosely
//   'walk'         held while walking (maybe slight bob)
//   'attackLight'  quick swing / slash
//   'attackHeavy'  big swing / smash
//   'blocking'     guard position
//   'hurt'         held loosely while staggered
//
// ── FRAME COUNTER ─────────────────────────────────────────────────────
//
//   'frame' increments at ~60 per second.
//   Math.floor(frame / 8) % 2  →  toggles 0/1 every 8 ticks
//
// ── EXTRACTING FROM YOUR HTML FILE ───────────────────────────────────
//
//   Your HTML probably has something like:
//     ctx.fillStyle = '#CCCCDD';
//     ctx.fillRect(246, 200, 18, 3);   // blade at fixed position
//
//   Convert fixed positions to be relative to (x, y):
//     ctx.fillRect(x + 6,  y - 18, 18, 3);  // blade from right hand
//     ctx.fillRect(x + 4,  y - 18, 4,  6);  // handle
//
// =====================================================================

export function drawFn(ctx, x, y, facing, state, frame) {
  ctx.save();

  // Mirror horizontally for left-facing
  if (facing === -1) {
    ctx.translate(x * 2, 0);
    ctx.scale(-1, 1);
  }

  // ── PASTE YOUR DRAWING CODE BELOW ──────────────────────────────────
  //
  // Replace these example shapes with your weapon art.
  // Right hand is at approximately (x+11, y-18).

  // Attack swing: shift weapon forward during active frames
  const swingOffset = (state === 'attackLight' || state === 'attackHeavy')
    ? Math.min(frame % 10, 5) * 2
    : 0;

  // Example sword:
  // Blade
  ctx.fillStyle = '#CCCCEE';
  ctx.fillRect(x + 11 + swingOffset, y - 20, 18, 3);
  // Guard
  ctx.fillStyle = '#886644';
  ctx.fillRect(x + 9,  y - 22, 3, 7);
  // Handle
  ctx.fillStyle = '#664422';
  ctx.fillRect(x + 6,  y - 18, 4, 5);

  // ── END OF YOUR DRAWING CODE ────────────────────────────────────────

  ctx.restore();
}


// ── HOW TO REGISTER IN src/weapons.js ────────────────────────────────
//
// 1. Add this import at the top of src/weapons.js:
//
//      import { drawFn as mySwordDraw } from '../assets/weapons/my_sword.js';
//
// 2. Add (or update) an entry in the WEAPONS array:
//
//      {
//        id:          'my_sword',
//        name:        'My Sword',
//        color:       '#CCCCEE',   // used as fallback preview colour
//        accentColor: '#445577',
//        drawFn:      mySwordDraw, // ← your draw function
//        stats: {
//          lightDamageBonus: 3,
//          heavyDamageBonus: 6,
//          reachBonus:       8,
//        },
//      },
//
// Your weapon art will appear in the weapon-select screen preview
// and drawn on top of the character during the fight automatically.
// =====================================================================
