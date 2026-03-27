import { getPressed } from '../input.js';

export class RoundEndState {
  enter(game, { winner }) {
    this.winner = winner;
    this.timer  = 0;
  }

  update(game) {
    this.timer++;

    // Let 80 frames pass before accepting input (prevents accidental skip)
    if (this.timer > 80) {
      const p1 = getPressed(1);
      const p2 = getPressed(2);
      if (p1.light || p1.heavy || p2.light || p2.heavy) {
        game.goToCharacterSelect();
      }
    }
  }

  draw(game, ctx) {
    const W = game.width;
    const H = game.height;

    // Dark background
    ctx.fillStyle = '#070010';
    ctx.fillRect(0, 0, W, H);

    // Stars
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    [[28,18],[72,55],[195,28],[342,48],[418,22],[98,195],[292,175],[460,140]].forEach(
      ([x, y]) => ctx.fillRect(x, y, 1, 1)
    );

    // Winner text
    const text  = this.winner === 'draw' ? 'DRAW!'
                : `PLAYER ${this.winner} WINS!`;
    const color = this.winner === 1 ? '#88AAFF'
                : this.winner === 2 ? '#FF8888'
                : '#DDDDDD';

    const scale = Math.min(1, this.timer / 20);
    ctx.save();
    ctx.translate(W / 2, H / 2 - 16);
    ctx.scale(scale, scale);
    ctx.fillStyle = color;
    ctx.font      = 'bold 22px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(text, 0, 0);
    ctx.restore();

    // Play again prompt (fades in after 80 frames)
    if (this.timer > 80) {
      const alpha = Math.min(1, (this.timer - 80) / 20) * (0.55 + 0.45 * Math.sin(this.timer * 0.1));
      ctx.fillStyle = `rgba(200,200,200,${alpha})`;
      ctx.font      = '9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('PRESS ATTACK TO PLAY AGAIN', W / 2, H / 2 + 18);
    }
  }
}
