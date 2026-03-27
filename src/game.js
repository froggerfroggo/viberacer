import { clearFrame } from "./input.js";
import { CharacterSelectState } from "./states/characterSelect.js";
import { FightState } from "./states/fight.js";
import { RoundEndState } from "./states/roundEnd.js";
import { StageSelectState } from "./states/stageSelect.js";
import { WeaponSelectState } from "./states/weaponSelect.js";

const FIXED_DT = 1000 / 60;

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderScale = 2;
    this.width = 480;
    this.height = 270;
    this.canvas.width = this.width * this.renderScale;
    this.canvas.height = this.height * this.renderScale;
    this.ctx = canvas.getContext("2d");

    this.states = {
      characterSelect: new CharacterSelectState(),
      weaponSelect: new WeaponSelectState(),
      stageSelect: new StageSelectState(),
      fight: new FightState(),
      roundEnd: new RoundEndState(),
    };

    this.currentState = null;
    this.lastTime = 0;
    this.accumulator = 0;
  }

  start() {
    this.goToCharacterSelect();
    requestAnimationFrame((ts) => this._loop(ts));
  }

  _loop(timestamp) {
    const elapsed = Math.min(timestamp - this.lastTime, 100);
    this.lastTime = timestamp;
    this.accumulator += elapsed;

    while (this.accumulator >= FIXED_DT) {
      this._update();
      this.accumulator -= FIXED_DT;
    }

    this._draw();
    clearFrame();

    requestAnimationFrame((ts) => this._loop(ts));
  }

  _update() {
    if (this.currentState) this.currentState.update(this);
  }

  _draw() {
    this.ctx.setTransform(this.renderScale, 0, 0, this.renderScale, 0, 0);
    this.ctx.clearRect(0, 0, this.width, this.height);
    if (this.currentState) this.currentState.draw(this, this.ctx);
  }

  // ── State transitions ─────────────────────────────────────────────
  // Flow: characterSelect → weaponSelect → stageSelect → fight → roundEnd → characterSelect

  goToCharacterSelect() {
    this.currentState = this.states.characterSelect;
    this.currentState.enter(this);
  }

  goToWeaponSelect(char1, char2) {
    this.currentState = this.states.weaponSelect;
    this.currentState.enter(this, { char1, char2 });
  }

  goToStageSelect(char1, char2, weapon1, weapon2) {
    this.currentState = this.states.stageSelect;
    this.currentState.enter(this, { char1, char2, weapon1, weapon2 });
  }

  startFight(char1, char2, weapon1, weapon2, stage) {
    this.currentState = this.states.fight;
    this.currentState.enter(this, { char1, char2, weapon1, weapon2, stage });
  }

  endFight(winner) {
    this.currentState = this.states.roundEnd;
    this.currentState.enter(this, { winner });
  }
}
