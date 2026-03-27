// Shared pixel-art sprite renderer
// Used by all character and weapon drawFn modules.
//
// drawPixelSprite(ctx, x, y, facing, state, gameFrame, data)
//   ctx        — CanvasRenderingContext2D
//   x, y       — center-bottom of the sprite (feet position) in game coords
//   facing     — 1 (right) | -1 (left)
//   state      — game state string (e.g. 'idle', 'walk', 'attackLight' …)
//   gameFrame  — monotonic frame counter from Player.frameCount
//   data       — { PAL, states, stateMap, ANIM_SPEED? }

export function drawPixelSprite(ctx, x, y, facing, state, gameFrame, data) {
  const { PAL, states, stateMap, ANIM_SPEED = 10 } = data;

  // Map game state → sprite state name, fall back to 'idle'
  const spriteName = stateMap[state] || 'idle';
  const frames     = states[spriteName] || states['idle'];
  const frameIdx   = Math.floor(gameFrame / ANIM_SPEED) % frames.length;
  const grid       = frames[frameIdx];

  const H    = grid.length;
  const W    = grid[0].length;
  const drawX = Math.floor(x) - Math.floor(W / 2);
  const drawY = Math.floor(y) - H;

  ctx.save();

  // Flip horizontally for left-facing
  if (facing === -1) {
    ctx.translate(Math.floor(x) * 2, 0);
    ctx.scale(-1, 1);
  }

  // Row-batched rendering: merge consecutive same-colour pixels into one fillRect call
  for (let row = 0; row < H; row++) {
    let col = 0;
    while (col < W) {
      const v = grid[row][col];
      const color = PAL[v];
      if (!color) { col++; continue; }
      let end = col + 1;
      while (end < W && grid[row][end] === v) end++;
      ctx.fillStyle = color;
      ctx.fillRect(drawX + col, drawY + row, end - col, 1);
      col = end;
    }
  }

  ctx.restore();
}

// Default game-state → sprite-state map for characters
export const CHAR_STATE_MAP = {
  idle:         'idle',
  walk:         'walk',
  jump:         'jump',   // falls back to 'idle' if sprite has no jump state
  fall:         'jump',
  attackLight:  'attack',
  attackHeavy:  'attack',
  blocking:     'idle',
  hurt:         'hurt',
  dead:         'hurt',
};
