import { CHARACTERS } from '../characters.js';
import { getPressed } from '../input.js';

const COLS   = Math.min(CHARACTERS.length, 4);
const CELL_W = 72;
const CELL_H = 80;
const GRID_X = (480 - COLS * CELL_W) / 2;
const GRID_Y = 90;

export class CharacterSelectState {
  enter() {
    // Each player starts on a different slot
    this.cursors   = [0, Math.min(1, CHARACTERS.length - 1)];
    this.confirmed = [false, false];
    this.flashTimer = 0;
  }

  update(game) {
    this.flashTimer++;

    for (let p = 0; p < 2; p++) {
      if (this.confirmed[p]) continue;

      const pressed = getPressed(p + 1);
      if (pressed.left)  this.cursors[p] = Math.max(0, this.cursors[p] - 1);
      if (pressed.right) this.cursors[p] = Math.min(CHARACTERS.length - 1, this.cursors[p] + 1);
      if (pressed.light || pressed.heavy) this.confirmed[p] = true;
    }

    // Both confirmed → start fight after brief pause
    if (this.confirmed[0] && this.confirmed[1] && this.flashTimer > 90) {
      game.startFight(
        CHARACTERS[this.cursors[0]],
        CHARACTERS[this.cursors[1]]
      );
    }
    if (this.confirmed[0] && this.confirmed[1] && this.flashTimer < 91) {
      // Reset flash timer on second confirmation
      if (this.confirmed.every(Boolean)) this.flashTimer = Math.max(this.flashTimer, 0);
    }
  }

  draw(game, ctx) {
    const W = game.width;
    const H = game.height;

    // Background
    ctx.fillStyle = '#0e0e1a';
    ctx.fillRect(0, 0, W, H);
    this.drawStarfield(ctx);

    // Title
    ctx.fillStyle = '#FFEE44';
    ctx.font      = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SELECT YOUR FIGHTER', W / 2, 22);

    // Subtitle divider line
    ctx.fillStyle = '#332244';
    ctx.fillRect(0, 28, W, 1);

    // Control hints
    ctx.font = '8px monospace';
    ctx.fillStyle = '#4499FF';
    ctx.textAlign = 'left';
    ctx.fillText('P1: A/D  |  F = select', 8, H - 8);
    ctx.fillStyle = '#FF5555';
    ctx.textAlign = 'right';
    ctx.fillText('P2: ←/→  |  , = select', W - 8, H - 8);

    // Character grid
    for (let i = 0; i < CHARACTERS.length; i++) {
      const cellX = GRID_X + i * CELL_W;
      const cellY = GRID_Y;
      this.drawCharacterCell(ctx, i, cellX, cellY);
    }

    // Bottom status
    const bothConfirmed = this.confirmed[0] && this.confirmed[1];
    if (bothConfirmed) {
      const alpha = 0.5 + 0.5 * Math.sin(this.flashTimer * 0.18);
      ctx.fillStyle = `rgba(255,238,68,${alpha})`;
      ctx.font      = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('FIGHT!', W / 2, GRID_Y + CELL_H + 28);
    } else {
      ctx.fillStyle = '#555';
      ctx.font      = '8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Press attack button to confirm', W / 2, GRID_Y + CELL_H + 18);
    }
  }

  drawCharacterCell(ctx, index, cx, cy) {
    const char   = CHARACTERS[index];
    const pad    = 4;
    const innerW = CELL_W - pad * 2;
    const innerH = CELL_H - pad * 2;
    const ix     = cx + pad;
    const iy     = cy + pad;

    // Cell bg
    ctx.fillStyle = '#16162a';
    ctx.fillRect(ix, iy, innerW, innerH);

    // Character colour swatch
    ctx.fillStyle = char.color;
    ctx.fillRect(ix + 2, iy + 2, innerW - 4, innerH - 18);

    // Tiny face
    this.drawTinyFace(ctx, ix + innerW / 2, iy + (innerH - 18) / 2 + 2, char);

    // Name
    ctx.fillStyle   = '#DDD';
    ctx.font        = '7px monospace';
    ctx.textAlign   = 'center';
    ctx.fillText(char.name, ix + innerW / 2, iy + innerH - 5);

    // P1 cursor (blue)
    if (this.cursors[0] === index) {
      ctx.strokeStyle = this.confirmed[0] ? '#88CCFF' : '#4499FF';
      ctx.lineWidth   = this.confirmed[0] ? 3 : 2;
      ctx.strokeRect(ix - 1, iy - 1, innerW + 2, innerH + 2);
      ctx.fillStyle = this.confirmed[0] ? '#4499FF' : '#1a3a88';
      ctx.font      = '7px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(this.confirmed[0] ? 'P1 ✓' : 'P1', ix + innerW / 2, iy - 3);
    }

    // P2 cursor (red) — offset 3px if same slot as P1
    if (this.cursors[1] === index) {
      const off = this.cursors[0] === index ? 3 : 0;
      ctx.strokeStyle = this.confirmed[1] ? '#FFAAAA' : '#FF5555';
      ctx.lineWidth   = this.confirmed[1] ? 3 : 2;
      ctx.strokeRect(ix - 1 + off, iy - 1 + off, innerW + 2, innerH + 2);
      ctx.fillStyle = this.confirmed[1] ? '#FF5555' : '#881a1a';
      ctx.font      = '7px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(this.confirmed[1] ? 'P2 ✓' : 'P2', ix + innerW / 2 + off, iy + innerH + 9);
    }
  }

  drawTinyFace(ctx, cx, cy, char) {
    // Head
    ctx.fillStyle = char.accentColor;
    ctx.fillRect(Math.floor(cx - 9), Math.floor(cy - 11), 18, 16);
    // Body hint
    ctx.fillStyle = char.color;
    ctx.fillRect(Math.floor(cx - 7), Math.floor(cy - 3), 14, 8);
    // Eyes
    ctx.fillStyle = '#FFF';
    ctx.fillRect(Math.floor(cx - 6), Math.floor(cy - 9), 4, 4);
    ctx.fillRect(Math.floor(cx + 2), Math.floor(cy - 9), 4, 4);
    ctx.fillStyle = '#111';
    ctx.fillRect(Math.floor(cx - 5), Math.floor(cy - 8), 2, 2);
    ctx.fillRect(Math.floor(cx + 3), Math.floor(cy - 8), 2, 2);
  }

  drawStarfield(ctx) {
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    const stars = [
      [18,14],[55,38],[98,7],[182,52],[243,18],[301,44],[375,11],
      [428,37],[48,198],[155,215],[251,238],[348,208],[451,225],
      [120,72],[200,85],[310,60],[400,78],
    ];
    for (const [x, y] of stars) ctx.fillRect(x, y, 1, 1);
  }
}
