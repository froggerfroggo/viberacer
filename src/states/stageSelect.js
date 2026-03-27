import { STAGES } from '../stages.js';
import { getPressed } from '../input.js';
import { FLOOR_Y, STAGE_LEFT, STAGE_RIGHT } from './fight.js';

// 5 stage cells in a single row
const CELL_W = 72;
const CELL_H = 54;
const GRID_X = Math.floor((480 - STAGES.length * CELL_W) / 2);
const GRID_Y = 100;

export class StageSelectState {
  enter(game, { char1, char2, weapon1, weapon2 }) {
    this.char1      = char1;
    this.char2      = char2;
    this.weapon1    = weapon1 || null;
    this.weapon2    = weapon2 || null;
    this.cursor     = 0;
    this.confirmed  = false;
    this.flashTimer = 0;
  }

  update(game) {
    this.flashTimer++;

    if (!this.confirmed) {
      // P1 picks the stage
      const pressed = getPressed(1);
      if (pressed.left)  this.cursor = Math.max(0, this.cursor - 1);
      if (pressed.right) this.cursor = Math.min(STAGES.length - 1, this.cursor + 1);

      if (pressed.light || pressed.heavy) this.confirmed = true;
    }

    if (this.confirmed && this.flashTimer > 60) {
      game.startFight(this.char1, this.char2, this.weapon1, this.weapon2, STAGES[this.cursor]);
    }
  }

  draw(game, ctx) {
    const W = game.width;
    const H = game.height;

    ctx.fillStyle = '#0a0010';
    ctx.fillRect(0, 0, W, H);
    this.drawStarfield(ctx);

    // Title
    ctx.fillStyle = '#FFEE44';
    ctx.font      = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('P1 CHOOSE A STAGE', W / 2, 22);

    ctx.fillStyle = '#332244';
    ctx.fillRect(0, 28, W, 1);

    // P2 waiting note
    ctx.fillStyle = '#FF5555';
    ctx.font      = '8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('P2: waiting...', W / 2, H - 10);

    // P1 hint
    ctx.fillStyle = '#4499FF';
    ctx.fillText('P1: A/D to browse  |  F to confirm', W / 2, H - 22);

    // Stage cells
    for (let i = 0; i < STAGES.length; i++) {
      this.drawStageCell(ctx, i, GRID_X + i * CELL_W, GRID_Y);
    }

    // Selected stage name
    ctx.fillStyle = '#FFF';
    ctx.font      = '9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(STAGES[this.cursor].name, W / 2, GRID_Y + CELL_H + 14);

    // Confirm flash
    if (this.confirmed) {
      const alpha = 0.5 + 0.5 * Math.sin(this.flashTimer * 0.18);
      ctx.fillStyle = `rgba(255,238,68,${alpha})`;
      ctx.font      = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('FIGHT!', W / 2, GRID_Y + CELL_H + 30);
    }
  }

  drawStageCell(ctx, index, x, y) {
    const stage = STAGES[index];
    const pad   = 4;
    const iw    = CELL_W - pad * 2;
    const ih    = CELL_H - pad * 2;
    const ix    = x + pad;
    const iy    = y + pad;

    // Stage preview thumbnail — use drawBackground scaled down, or previewColor
    ctx.save();
    ctx.beginPath();
    ctx.rect(ix, iy, iw, ih);
    ctx.clip();

    if (stage.drawBackground) {
      ctx.translate(ix, iy);
      ctx.scale(iw / 480, ih / 270);
      stage.drawBackground(ctx, 480, 270);
      if (stage.drawFloor) {
        stage.drawFloor(ctx, 480, 270, FLOOR_Y, STAGE_LEFT, STAGE_RIGHT);
      }
    } else {
      ctx.fillStyle = stage.previewColor || '#2a1a50';
      ctx.fillRect(ix, iy, iw, ih);
    }
    ctx.restore();

    // Selected border (gold) / unselected (dim)
    if (this.cursor === index) {
      ctx.strokeStyle = this.confirmed ? '#FFEE44' : '#FFD700';
      ctx.lineWidth   = this.confirmed ? 3 : 2;
    } else {
      ctx.strokeStyle = '#444466';
      ctx.lineWidth   = 1;
    }
    ctx.strokeRect(ix - 1, iy - 1, iw + 2, ih + 2);
  }

  drawStarfield(ctx) {
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    [[25,12],[70,40],[140,8],[220,30],[310,15],[400,35],[455,20],
     [90,200],[200,215],[340,195],[430,210]].forEach(
      ([x, y]) => ctx.fillRect(x, y, 1, 1)
    );
  }
}
