import { CHARACTERS } from '../characters.js';
import { getPressed } from '../input.js';

// 3×3 grid layout (fits 9 characters exactly)
const COLS   = 3;
const CELL_W = 84;
const CELL_H = 74;
const GRID_X = Math.floor((480 - COLS * CELL_W) / 2);  // 114
const GRID_Y = 38;

export class CharacterSelectState {
  enter() {
    this.cursors    = [0, Math.min(1, CHARACTERS.length - 1)];
    this.confirmed  = [false, false];
    this.flashTimer = 0;
  }

  update(game) {
    this.flashTimer++;

    for (let p = 0; p < 2; p++) {
      if (this.confirmed[p]) continue;

      const pressed = getPressed(p + 1);
      const col = this.cursors[p] % COLS;
      const row = Math.floor(this.cursors[p] / COLS);

      if (pressed.left  && col > 0)                                      this.cursors[p]--;
      if (pressed.right && col < COLS - 1
                        && this.cursors[p] + 1 < CHARACTERS.length)     this.cursors[p]++;
      if (pressed.up    && row > 0)                                      this.cursors[p] -= COLS;
      if (pressed.down  && this.cursors[p] + COLS < CHARACTERS.length)  this.cursors[p] += COLS;

      if (pressed.light || pressed.heavy) this.confirmed[p] = true;
    }

    // Both confirmed → go to weapon select
    if (this.confirmed[0] && this.confirmed[1] && this.flashTimer > 90) {
      game.goToWeaponSelect(
        CHARACTERS[this.cursors[0]],
        CHARACTERS[this.cursors[1]]
      );
    }
  }

  draw(game, ctx) {
    const W = game.width;
    const H = game.height;

    ctx.fillStyle = '#0e0e1a';
    ctx.fillRect(0, 0, W, H);
    this.drawStarfield(ctx);

    ctx.fillStyle = '#FFEE44';
    ctx.font      = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SELECT YOUR FIGHTER', W / 2, 20);

    ctx.fillStyle = '#332244';
    ctx.fillRect(0, 26, W, 1);

    ctx.font      = '7px monospace';
    ctx.fillStyle = '#4499FF';
    ctx.textAlign = 'left';
    ctx.fillText('P1: WASD  |  F = confirm', 6, H - 8);
    ctx.fillStyle = '#FF5555';
    ctx.textAlign = 'right';
    ctx.fillText('P2: ←↑↓→  |  , = confirm', W - 6, H - 8);

    // Character grid
    for (let i = 0; i < CHARACTERS.length; i++) {
      const col   = i % COLS;
      const row   = Math.floor(i / COLS);
      const cellX = GRID_X + col * CELL_W;
      const cellY = GRID_Y + row * CELL_H;
      this.drawCharacterCell(ctx, i, cellX, cellY);
    }

    // Status line
    if (this.confirmed[0] && this.confirmed[1]) {
      const alpha = 0.5 + 0.5 * Math.sin(this.flashTimer * 0.18);
      ctx.fillStyle = `rgba(255,238,68,${alpha})`;
      ctx.font      = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('FIGHT!', W / 2, GRID_Y + 3 * CELL_H + 14);
    } else {
      ctx.fillStyle = '#555';
      ctx.font      = '7px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Press attack to confirm', W / 2, GRID_Y + 3 * CELL_H + 12);
    }
  }

  drawCharacterCell(ctx, index, cx, cy) {
    const char  = CHARACTERS[index];
    const pad   = 4;
    const iw    = CELL_W - pad * 2;
    const ih    = CELL_H - pad * 2;
    const ix    = cx + pad;
    const iy    = cy + pad;
    const nameH = 12;
    const artH  = ih - nameH;

    // Cell background
    ctx.fillStyle = '#16162a';
    ctx.fillRect(ix, iy, iw, ih);

    // Art: use drawFn preview if available, else colour swatch
    if (char.drawFn) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(ix + 1, iy + 1, iw - 2, artH - 1);
      ctx.clip();
      const scale = Math.min(iw / 22, artH / 38) * 0.75;
      const preX  = ix + iw / 2;
      const preY  = iy + artH;
      ctx.translate(preX, preY);
      ctx.scale(scale, scale);
      ctx.translate(-preX, -preY);
      char.drawFn(ctx, preX, preY, 1, 'idle', 0);
      ctx.restore();
    } else {
      ctx.fillStyle = char.color;
      ctx.fillRect(ix + 2, iy + 2, iw - 4, artH - 2);
      this.drawTinyFace(ctx, ix + iw / 2, iy + artH / 2, char);
    }

    // Name
    ctx.fillStyle = '#DDD';
    ctx.font      = '7px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(char.name, ix + iw / 2, iy + ih - 3);

    // P1 cursor (blue)
    if (this.cursors[0] === index) {
      ctx.strokeStyle = this.confirmed[0] ? '#88CCFF' : '#4499FF';
      ctx.lineWidth   = this.confirmed[0] ? 3 : 2;
      ctx.strokeRect(ix - 1, iy - 1, iw + 2, ih + 2);
      ctx.fillStyle = this.confirmed[0] ? '#4499FF' : '#1a3a88';
      ctx.font      = '7px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(this.confirmed[0] ? 'P1 ✓' : 'P1', ix + iw / 2, iy - 3);
    }

    // P2 cursor (red) — slightly offset if on same slot
    if (this.cursors[1] === index) {
      const off = this.cursors[0] === index ? 3 : 0;
      ctx.strokeStyle = this.confirmed[1] ? '#FFAAAA' : '#FF5555';
      ctx.lineWidth   = this.confirmed[1] ? 3 : 2;
      ctx.strokeRect(ix - 1 + off, iy - 1 + off, iw + 2, ih + 2);
      ctx.fillStyle = this.confirmed[1] ? '#FF5555' : '#881a1a';
      ctx.font      = '7px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(this.confirmed[1] ? 'P2 ✓' : 'P2', ix + iw / 2 + off, iy + ih + 8);
    }
  }

  drawTinyFace(ctx, cx, cy, char) {
    ctx.fillStyle = char.accentColor;
    ctx.fillRect(Math.floor(cx - 9), Math.floor(cy - 11), 18, 16);
    ctx.fillStyle = char.color;
    ctx.fillRect(Math.floor(cx - 7), Math.floor(cy - 3), 14, 8);
    ctx.fillStyle = '#FFF';
    ctx.fillRect(Math.floor(cx - 6), Math.floor(cy - 9), 4, 4);
    ctx.fillRect(Math.floor(cx + 2), Math.floor(cy - 9), 4, 4);
    ctx.fillStyle = '#111';
    ctx.fillRect(Math.floor(cx - 5), Math.floor(cy - 8), 2, 2);
    ctx.fillRect(Math.floor(cx + 3), Math.floor(cy - 8), 2, 2);
  }

  drawStarfield(ctx) {
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    [[18,14],[55,38],[98,7],[182,52],[243,18],[301,44],[375,11],
     [428,37],[48,198],[155,215],[251,238],[348,208],[451,225]].forEach(
      ([x, y]) => ctx.fillRect(x, y, 1, 1)
    );
  }
}
