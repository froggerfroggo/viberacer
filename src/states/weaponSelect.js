import { WEAPONS } from '../weapons.js';
import { getPressed } from '../input.js';

// 3×2 grid (3 cols, 2 rows) — fits 6 weapons
const COLS   = 3;
const CELL_W = 76;
const CELL_H = 68;
const GRID_X = Math.floor((480 - COLS * CELL_W) / 2);  // 114
const GRID_Y = 50;

export class WeaponSelectState {
  enter(game, { char1, char2 }) {
    this.char1      = char1;
    this.char2      = char2;
    this.cursors    = [0, Math.min(1, WEAPONS.length - 1)];
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

      if (pressed.left  && col > 0)                                     this.cursors[p]--;
      if (pressed.right && col < COLS - 1
                        && this.cursors[p] + 1 < WEAPONS.length)        this.cursors[p]++;
      if (pressed.up    && row > 0)                                      this.cursors[p] -= COLS;
      if (pressed.down  && this.cursors[p] + COLS < WEAPONS.length)     this.cursors[p] += COLS;

      if (pressed.light || pressed.heavy) this.confirmed[p] = true;
    }

    if (this.confirmed[0] && this.confirmed[1] && this.flashTimer > 90) {
      game.goToStageSelect(
        this.char1,
        this.char2,
        WEAPONS[this.cursors[0]],
        WEAPONS[this.cursors[1]]
      );
    }
  }

  draw(game, ctx) {
    const W = game.width;
    const H = game.height;

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, W, H);
    this.drawStarfield(ctx);

    ctx.fillStyle = '#FF9944';
    ctx.font      = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('CHOOSE YOUR WEAPON', W / 2, 20);

    ctx.fillStyle = '#332233';
    ctx.fillRect(0, 26, W, 1);

    // Show chosen characters as reminder
    ctx.font = '7px monospace';
    ctx.fillStyle = '#4499FF';
    ctx.textAlign = 'left';
    ctx.fillText(`P1: ${this.char1.name}`, 8, H - 8);
    ctx.fillStyle = '#FF5555';
    ctx.textAlign = 'right';
    ctx.fillText(`P2: ${this.char2.name}`, W - 8, H - 8);

    ctx.font      = '7px monospace';
    ctx.fillStyle = '#4499FF';
    ctx.textAlign = 'left';
    ctx.fillText('WASD  |  F = confirm', 8, H - 18);
    ctx.fillStyle = '#FF5555';
    ctx.textAlign = 'right';
    ctx.fillText('←↑↓→  |  , = confirm', W - 8, H - 18);

    // Weapon grid
    for (let i = 0; i < WEAPONS.length; i++) {
      const col   = i % COLS;
      const row   = Math.floor(i / COLS);
      const cellX = GRID_X + col * CELL_W;
      const cellY = GRID_Y + row * CELL_H;
      this.drawWeaponCell(ctx, i, cellX, cellY);
    }

    if (this.confirmed[0] && this.confirmed[1]) {
      const alpha = 0.5 + 0.5 * Math.sin(this.flashTimer * 0.18);
      ctx.fillStyle = `rgba(255,153,68,${alpha})`;
      ctx.font      = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('FIGHT!', W / 2, GRID_Y + 2 * CELL_H + 18);
    } else {
      ctx.fillStyle = '#555';
      ctx.font      = '7px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Press attack to confirm', W / 2, GRID_Y + 2 * CELL_H + 16);
    }
  }

  drawWeaponCell(ctx, index, cx, cy) {
    const weapon = WEAPONS[index];
    const pad    = 4;
    const iw     = CELL_W - pad * 2;
    const ih     = CELL_H - pad * 2;
    const ix     = cx + pad;
    const iy     = cy + pad;
    const nameH  = 12;
    const artH   = ih - nameH;

    // Cell background
    ctx.fillStyle = '#1a1220';
    ctx.fillRect(ix, iy, iw, ih);

    // Art: drawFn preview or colour swatch
    if (weapon.drawFn) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(ix + 1, iy + 1, iw - 2, artH - 1);
      ctx.clip();
      // Translate so the weapon's character-anchor (0,0) sits at cell center-bottom
      const scale = 2.5;
      ctx.translate(ix + iw / 2, iy + artH - 4);
      ctx.scale(scale, scale);
      weapon.drawFn(ctx, 0, 0, 1, 'idle', 0);
      ctx.restore();
    } else {
      ctx.fillStyle = weapon.color;
      ctx.fillRect(ix + 2, iy + 2, iw - 4, artH - 2);
      // Small stat indicators on swatch
      this.drawStatBars(ctx, ix + 4, iy + 4, iw - 8, weapon.stats);
    }

    // Name
    ctx.fillStyle = '#DDD';
    ctx.font      = '7px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(weapon.name, ix + iw / 2, iy + ih - 3);

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

    // P2 cursor (red)
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

  // Small coloured mini-bars showing light/heavy/reach bonuses
  drawStatBars(ctx, x, y, w, stats) {
    const bars = [
      { label: 'L', value: stats.lightDamageBonus, max: 10, color: '#FF9944' },
      { label: 'H', value: stats.heavyDamageBonus, max: 16, color: '#FF4444' },
      { label: 'R', value: stats.reachBonus,        max: 16, color: '#44AAFF' },
    ];
    bars.forEach((bar, i) => {
      const by = y + i * 8;
      ctx.fillStyle = '#333';
      ctx.fillRect(x + 8, by, w - 8, 4);
      ctx.fillStyle = bar.color;
      ctx.fillRect(x + 8, by, Math.floor((bar.value / bar.max) * (w - 8)), 4);
      ctx.fillStyle = '#AAA';
      ctx.font      = '5px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(bar.label, x, by + 4);
    });
  }

  drawStarfield(ctx) {
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    [[22,12],[68,35],[130,9],[210,28],[300,14],[390,32],[452,18],
     [85,195],[195,212],[330,198],[445,208]].forEach(
      ([x, y]) => ctx.fillRect(x, y, 1, 1)
    );
  }
}
