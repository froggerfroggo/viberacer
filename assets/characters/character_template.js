// =====================================================================
// HOW TO ADD YOUR CHARACTER ART
// =====================================================================
//
// 1. Copy this file, rename it (e.g. assets/characters/my_cat.js)
// 2. Paste your drawing code inside drawFn below
// 3. Add your character entry to src/characters.js (see bottom of this file)
//
// ── COORDINATE SYSTEM ────────────────────────────────────────────────
//
//   Canvas is 480 × 270 pixels (pixel art scale).
//   x, y = center-bottom of the character (feet position on the ground)
//   Character is approximately 22px wide × 38px tall at game scale.
//
//       x-11        x        x+11
//         |---------|---------|
//   y-38  +----[head]----+
//         |              |
//   y-24  +----[body]----+
//         |              |
//   y     +--------------+  ← feet / floor contact
//
//   facing = 1 → character faces RIGHT (default)
//   facing = -1 → mirror horizontally (ctx.scale(-1,1) trick below)
//
// ── ANIMATION STATES ─────────────────────────────────────────────────
//
//   Use the 'state' parameter to change your character's pose:
//
//   'idle'         standing still
//   'walk'         moving horizontally
//   'jump'         moving upward
//   'fall'         moving downward
//   'attackLight'  quick attack
//   'attackHeavy'  slow powerful attack
//   'blocking'     crouching / blocking
//   'hurt'         hit stun (game auto-flashes alpha — no need to handle)
//   'dead'         K.O. (game draws separately — you can ignore this)
//
// ── FRAME COUNTER ─────────────────────────────────────────────────────
//
//   'frame' increments at 60 per second.
//   Use Math.floor(frame / N) % M for animation cycling:
//     e.g. Math.floor(frame / 8) % 2  →  toggles 0/1 every 8 ticks
//
// ── EXTRACTING FROM YOUR HTML FILE ───────────────────────────────────
//
//   Your HTML probably looks like:
//
//     <canvas id="c" width="480" height="270"></canvas>
//     <script>
//       const ctx = document.getElementById('c').getContext('2d');
//       ctx.fillStyle = '#FF9955';
//       ctx.fillRect(100, 200, 22, 38);
//       ...
//     </script>
//
//   Paste those ctx.fillStyle / ctx.fillRect / ctx.drawImage etc. calls
//   into the function below. Replace any hardcoded x/y offsets with
//   expressions relative to the x, y parameters (see examples below).
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
  // Replace these example shapes with your own character art.
  // All coordinates should be relative to (x, y).
  //
  // Examples of what to change:
  //   ctx.fillRect(230, 180, 22, 38)  →  ctx.fillRect(x - 11, y - 38, 22, 38)
  //   ctx.fillRect(232, 180, 18, 16)  →  ctx.fillRect(x - 9,  y - 38, 18, 16)
  //
  // Walk bob example:
  // const bob = state === 'walk' ? Math.sin(frame * 0.35) * 2 : 0;
  // ctx.translate(0, bob);

  // Body
  ctx.fillStyle = '#FF9955';
  ctx.fillRect(x - 11, y - 38, 22, 38);

  // Head (accent colour)
  ctx.fillStyle = '#CC5500';
  ctx.fillRect(x - 11, y - 38, 22, 14);

  // Eye
  ctx.fillStyle = '#FFF';
  ctx.fillRect(x + 1, y - 33, 4, 4);
  ctx.fillStyle = '#111';
  ctx.fillRect(x + 2, y - 32, 2, 2);

  // ── END OF YOUR DRAWING CODE ────────────────────────────────────────

  ctx.restore();
}


// ── HOW TO REGISTER IN src/characters.js ─────────────────────────────
//
// 1. Add this import at the top of src/characters.js:
//
//      import { drawFn as myCatDraw } from '../assets/characters/my_cat.js';
//
// 2. Add (or update) an entry in the CHARACTERS array:
//
//      {
//        id:          'my_cat',
//        name:        'My Cat',
//        color:       '#FF9955',    // used for HUD health bar colour
//        accentColor: '#CC5500',    // used as fallback in char-select
//        drawFn:      myCatDraw,    // ← your draw function
//        sprite:      null,
//        stats: { speed: 3.0, jumpForce: 11, lightDamage: 8, heavyDamage: 18 },
//      },
//
// That's it! Your art will appear in the character-select screen
// and in the fight automatically.
// =====================================================================
