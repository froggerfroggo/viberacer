// =====================================================================
// HOW TO ADD YOUR STAGE BACKGROUND
// =====================================================================
//
// 1. Copy this file, rename it (e.g. assets/stages/my_forest.js)
// 2. Paste your drawing code into the three functions below
// 3. Add your stage entry to src/stages.js (see bottom of this file)
//
// ── CANVAS SIZE ───────────────────────────────────────────────────────
//
//   width  = 480 px
//   height = 270 px
//
// ── STAGE BOUNDS (align your art to these) ───────────────────────────
//
//   FLOOR_Y      = 218   ← top surface of the floor (players stand here)
//   STAGE_LEFT   = 24    ← left edge of platform
//   STAGE_RIGHT  = 456   ← right edge of platform
//
//   ┌─────────────────────────────────────────────┐ y=0
//   │                  sky / BG                   │
//   │                                             │ y=218 ← FLOOR_Y
//   ├──[24]───────────────────────────────[456]───┤
//   │                  floor                      │ y=270
//   └─────────────────────────────────────────────┘
//
// ── DRAW ORDER ────────────────────────────────────────────────────────
//
//   drawBackground  → drawn first  (sky, mountains, buildings)
//   drawFloor       → drawn second (platform surface)
//   [players drawn here by the engine]
//   drawForeground  → drawn last   (tree branches, pillars in front)
//
//   Set drawForeground to null in stages.js if you don't need it.
//
// ── EXTRACTING FROM YOUR HTML FILE ───────────────────────────────────
//
//   Your HTML probably looks like:
//
//     <canvas id="c" width="480" height="270"></canvas>
//     <script>
//       const ctx = document.getElementById('c').getContext('2d');
//       // sky
//       ctx.fillStyle = '#87CEEB';
//       ctx.fillRect(0, 0, 480, 270);
//       // ground
//       ctx.fillStyle = '#5a8a3a';
//       ctx.fillRect(24, 218, 432, 52);
//     </script>
//
//   Split your drawing code across drawBackground and drawFloor below.
//   Background = everything above FLOOR_Y.
//   Floor = the platform from FLOOR_Y downward.
//
// =====================================================================

// Drawn first — sky, distant scenery, etc.
export function drawBackground(ctx, width, height) {
  // ── PASTE YOUR BACKGROUND DRAWING CODE HERE ─────────────────────
  // Replace this placeholder:
  ctx.fillStyle = '#1a0a2e';
  ctx.fillRect(0, 0, width, height);
  // ────────────────────────────────────────────────────────────────
}

// Drawn second — the platform/floor surface.
// floorY=218, stageLeft=24, stageRight=456 are passed in so your
// floor art stays aligned even if those constants change.
export function drawFloor(ctx, width, height, floorY, stageLeft, stageRight) {
  // ── PASTE YOUR FLOOR DRAWING CODE HERE ──────────────────────────
  // Replace this placeholder:
  ctx.fillStyle = '#2a1a50';
  ctx.fillRect(stageLeft, floorY, stageRight - stageLeft, height - floorY);
  ctx.fillStyle = '#9955EE';
  ctx.fillRect(stageLeft, floorY, stageRight - stageLeft, 2); // top edge
  // ────────────────────────────────────────────────────────────────
}

// Optional — drawn on top of players (foreground elements).
// Delete this export and set drawForeground: null in stages.js if unused.
export function drawForeground(ctx, width, height) {
  // ── PASTE YOUR FOREGROUND DRAWING CODE HERE (optional) ──────────

  // ────────────────────────────────────────────────────────────────
}


// ── HOW TO REGISTER IN src/stages.js ─────────────────────────────────
//
// 1. Add this import at the top of src/stages.js:
//
//      import {
//        drawBackground as myForestBg,
//        drawFloor      as myForestFloor,
//        drawForeground as myForestFg,   // or omit if null
//      } from '../assets/stages/my_forest.js';
//
// 2. Add (or update) an entry in the STAGES array:
//
//      {
//        id:             'my_forest',
//        name:           'Forest',
//        previewColor:   '#2a4a1a',   // fallback colour for stage-select thumbnail
//        drawBackground: myForestBg,
//        drawFloor:      myForestFloor,
//        drawForeground: myForestFg,  // or null
//      },
//
// Your art will appear in the stage-select screen preview
// and in the fight automatically.
// =====================================================================
