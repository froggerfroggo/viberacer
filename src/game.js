import { CharacterSelectState } from './states/characterSelect.js';
import { FightState }           from './states/fight.js';
import { RoundEndState }        from './states/roundEnd.js';
import { clearFrame }           from './input.js';

const FIXED_DT = 1000 / 60; // ms per logic tick

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');
    this.width  = canvas.width;   // 480
    this.height = canvas.height;  // 270

    this.states = {
      characterSelect: new CharacterSelectState(),
      fight:           new FightState(),
      roundEnd:        new RoundEndState(),
    };

    this.currentState = null;
    this.lastTime     = 0;
    this.accumulator  = 0;
  }

  start() {
    this.goToCharacterSelect();
    requestAnimationFrame(ts => this._loop(ts));
  }

  _loop(timestamp) {
    const elapsed = Math.min(timestamp - this.lastTime, 100); // cap spike at 100ms
    this.lastTime = timestamp;
    this.accumulator += elapsed;

    // Fixed-timestep logic updates
    while (this.accumulator >= FIXED_DT) {
      this._update();
      this.accumulator -= FIXED_DT;
    }

    this._draw();
    clearFrame(); // clear justPressed after all updates + draw

    requestAnimationFrame(ts => this._loop(ts));
  }

  _update() {
    if (this.currentState) this.currentState.update(this);
  }

  _draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    if (this.currentState) this.currentState.draw(this, this.ctx);
  }

  // ── State transitions ─────────────────────────────────────────────

  goToCharacterSelect() {
    this.currentState = this.states.characterSelect;
    this.currentState.enter(this);
  }

  startFight(char1, char2) {
    this.currentState = this.states.fight;
    this.currentState.enter(this, { char1, char2 });
  }

  endFight(winner) {
    this.currentState = this.states.roundEnd;
    this.currentState.enter(this, { winner });
  }
}
