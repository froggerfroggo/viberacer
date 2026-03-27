import { getHeld, getPressed } from "../input.js";
import { ATTACKS, Player, STATE } from "../player.js";

// Stage constants — teammates: adjust FLOOR_Y to match your stage art
export const FLOOR_Y = 218;
export const STAGE_LEFT = 24;
export const STAGE_RIGHT = 456;
const ROUND_SECONDS = 99;

function rectsOverlap(a, b) {
  return (
    a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
  );
}

export class FightState {
  enter(game, { char1, char2, weapon1, weapon2, stage }) {
    this.p1 = new Player(100, FLOOR_Y, char1, 1, 1);
    this.p2 = new Player(380, FLOOR_Y, char2, -1, 2);
    this.p1.weapon = weapon1 || null;
    this.p2.weapon = weapon2 || null;
    this.stage = stage || null;
    this.platforms = [];

    // Load platforms from map if available
    if (
      this.stage &&
      this.stage.mapType &&
      typeof globalThis.getFieldPlatforms === "function"
    ) {
      try {
        this.platforms =
          globalThis.getFieldPlatforms(480, 270, {
            mapType: this.stage.mapType,
          }) || [];
      } catch (err) {
        console.error("Error loading platforms:", err);
        this.platforms = [];
      }
    }

    this.timer = ROUND_SECONDS * 60; // in frames
    this.winner = null;
    this.endTimer = 0;
  }

  update(game) {
    // Wait a moment before transitioning to round-end screen
    if (this.winner !== null) {
      this.endTimer++;
      if (this.endTimer >= 110) game.endFight(this.winner);
      return;
    }

    this.timer = Math.max(0, this.timer - 1);

    // Auto-face: players in neutral states always face each other.
    // Note: this runs BEFORE player.update so directional input still overrides facing.
    const autoFaceStates = [STATE.IDLE, STATE.WALK, STATE.JUMP, STATE.FALL];
    if (autoFaceStates.includes(this.p1.state)) {
      this.p1.facing = this.p1.x <= this.p2.x ? 1 : -1;
    }
    if (autoFaceStates.includes(this.p2.state)) {
      this.p2.facing = this.p2.x <= this.p1.x ? 1 : -1;
    }

    this.p1.update(
      getHeld(1),
      getPressed(1),
      FLOOR_Y,
      STAGE_LEFT,
      STAGE_RIGHT,
      this.platforms,
    );
    this.p2.update(
      getHeld(2),
      getPressed(2),
      FLOOR_Y,
      STAGE_LEFT,
      STAGE_RIGHT,
      this.platforms,
    );

    // Resolve attack hits
    this.resolveAttack(this.p1, this.p2);
    this.resolveAttack(this.p2, this.p1);

    // Push players apart if overlapping (soft collision)
    this.resolveBodyCollision();

    // Win conditions
    if (this.p1.health <= 0 && this.p2.health <= 0) {
      this.winner = "draw";
    } else if (this.p1.health <= 0) {
      this.winner = 2;
    } else if (this.p2.health <= 0) {
      this.winner = 1;
    } else if (this.timer === 0) {
      if (this.p1.health > this.p2.health) this.winner = 1;
      else if (this.p2.health > this.p1.health) this.winner = 2;
      else this.winner = "draw";
    }
  }

  resolveAttack(attacker, defender) {
    if (!attacker.isAttacking() || attacker.attackHit) return;
    if (!attacker.isActiveAttack()) return;

    const hitbox = attacker.getAttackHitbox();
    const hurtbox = defender.getHurtbox();
    if (!hitbox || !rectsOverlap(hitbox, hurtbox)) return;

    attacker.attackHit = true;

    const data = ATTACKS[attacker.attackType];
    const baseDamage =
      attacker.attackType === "light"
        ? attacker.character.stats.lightDamage
        : attacker.character.stats.heavyDamage;
    const weaponBonus = attacker.weapon
      ? attacker.attackType === "light"
        ? attacker.weapon.stats.lightDamageBonus
        : attacker.weapon.stats.heavyDamageBonus
      : 0;
    const damage = baseDamage + weaponBonus;

    // Knockback pushes defender away from attacker's facing direction
    defender.receiveHit(
      damage,
      data.knockbackX * attacker.facing,
      data.knockbackY,
      data.hitstun,
    );
  }

  resolveBodyCollision() {
    const gap = (this.p1.w + this.p2.w) / 2 - 2;
    const dx = this.p2.x - this.p1.x;
    if (Math.abs(dx) < gap) {
      const push = (gap - Math.abs(dx)) / 2;
      const dir = dx < 0 ? -1 : 1;
      if (this.p1.state !== STATE.HURT && this.p1.state !== STATE.DEAD)
        this.p1.x -= push * dir;
      if (this.p2.state !== STATE.HURT && this.p2.state !== STATE.DEAD)
        this.p2.x += push * dir;
    }
  }

  draw(game, ctx) {
    const W = game.width;
    const H = game.height;

    this.drawBackground(ctx, W, H);
    this.drawStage(ctx, W, H);

    this.p1.draw(ctx);
    this.p2.draw(ctx);

    this.drawForeground(ctx, W, H);
    this.drawHUD(ctx, W);

    if (this.winner !== null) this.drawWinOverlay(ctx, W, H);
  }

  // ── Stage / Background drawing ────────────────────────────────────
  // Teammates: replace these methods with your stage art.
  // FLOOR_Y, STAGE_LEFT, STAGE_RIGHT are exported for your use.

  drawBackground(ctx, w, h) {
    if (this.stage && this.stage.drawBackground) {
      this.stage.drawBackground(ctx, w, h);
      return;
    }
    // Placeholder sky
    ctx.fillStyle = "#10082a";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#1c0e3a";
    ctx.fillRect(0, 60, w, 60);
    ctx.fillStyle = "#241448";
    ctx.fillRect(0, 120, w, 40);
    ctx.fillStyle = "#2c1a50";
    ctx.fillRect(0, 160, w, FLOOR_Y - 160);
    ctx.fillStyle = "#1a0d35";
    [
      [40, 80],
      [100, 60],
      [200, 90],
      [310, 70],
      [380, 55],
      [430, 85],
    ].forEach(([cx, ch]) => ctx.fillRect(cx, FLOOR_Y - ch, 20, ch));
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    [
      [20, 8],
      [55, 22],
      [110, 5],
      [190, 18],
      [255, 10],
      [320, 25],
      [395, 8],
      [445, 20],
    ].forEach(([x, y]) => ctx.fillRect(x, y, 1, 1));
  }

  drawStage(ctx, w, h) {
    if (this.stage && this.stage.drawFloor) {
      this.stage.drawFloor(ctx, w, h, FLOOR_Y, STAGE_LEFT, STAGE_RIGHT);
      return;
    }
    // Placeholder floor
    ctx.fillStyle = "#2a1a50";
    ctx.fillRect(STAGE_LEFT, FLOOR_Y, STAGE_RIGHT - STAGE_LEFT, h - FLOOR_Y);
    ctx.fillStyle = "#9955EE";
    ctx.fillRect(STAGE_LEFT, FLOOR_Y, STAGE_RIGHT - STAGE_LEFT, 2);
    ctx.fillStyle = "#3a2460";
    ctx.fillRect(STAGE_LEFT - 6, FLOOR_Y, 6, h - FLOOR_Y);
    ctx.fillRect(STAGE_RIGHT, FLOOR_Y, 6, h - FLOOR_Y);
    ctx.fillStyle = "#7733CC";
    for (let x = STAGE_LEFT + 8; x < STAGE_RIGHT; x += 16) {
      ctx.fillRect(x, FLOOR_Y + 3, 4, 2);
    }
  }

  drawForeground(ctx, w, h) {
    if (this.stage && this.stage.drawForeground) {
      this.stage.drawForeground(ctx, w, h);
    }
  }

  // ── HUD ───────────────────────────────────────────────────────────

  drawHUD(ctx, w) {
    const BAR_W = 155;
    const BAR_H = 10;
    const BAR_Y = 10;
    const PAD = 8;

    // ── P1 health bar (left) ──
    const p1W = Math.floor((this.p1.health / 100) * BAR_W);
    ctx.fillStyle = "#2a2a2a";
    ctx.fillRect(PAD, BAR_Y, BAR_W, BAR_H);
    ctx.fillStyle = this.healthColor(this.p1.health);
    ctx.fillRect(PAD, BAR_Y, p1W, BAR_H);
    ctx.strokeStyle = "#666";
    ctx.lineWidth = 1;
    ctx.strokeRect(PAD, BAR_Y, BAR_W, BAR_H);

    ctx.fillStyle = "#88AAFF";
    ctx.font = "8px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`P1 · ${this.p1.character.name}`, PAD, BAR_Y - 2);

    // ── P2 health bar (right, drains inward) ──
    const p2W = Math.floor((this.p2.health / 100) * BAR_W);
    const p2BX = w - PAD - BAR_W;
    ctx.fillStyle = "#2a2a2a";
    ctx.fillRect(p2BX, BAR_Y, BAR_W, BAR_H);
    ctx.fillStyle = this.healthColor(this.p2.health);
    ctx.fillRect(p2BX + (BAR_W - p2W), BAR_Y, p2W, BAR_H);
    ctx.strokeStyle = "#666";
    ctx.lineWidth = 1;
    ctx.strokeRect(p2BX, BAR_Y, BAR_W, BAR_H);

    ctx.fillStyle = "#FF8888";
    ctx.font = "8px monospace";
    ctx.textAlign = "right";
    ctx.fillText(`P2 · ${this.p2.character.name}`, w - PAD, BAR_Y - 2);

    // ── Timer ──
    const secs = Math.ceil(this.timer / 60);
    ctx.fillStyle = secs <= 10 ? "#FF4444" : "#FFFFFF";
    ctx.font = "bold 14px monospace";
    ctx.textAlign = "center";
    ctx.fillText(String(secs).padStart(2, "0"), w / 2, BAR_Y + BAR_H);
  }

  healthColor(hp) {
    if (hp > 55) return "#33CC44";
    if (hp > 25) return "#FFAA00";
    return "#FF2222";
  }

  // ── Win overlay ───────────────────────────────────────────────────

  drawWinOverlay(ctx, w, h) {
    const alpha = Math.min(1, this.endTimer / 30);
    ctx.fillStyle = `rgba(0,0,0,${alpha * 0.65})`;
    ctx.fillRect(0, 0, w, h);

    if (this.endTimer < 10) return;

    const text =
      this.winner === "draw" ? "DRAW!" : `PLAYER ${this.winner} WINS!`;
    const color =
      this.winner === 1 ? "#88AAFF" : this.winner === 2 ? "#FF8888" : "#FFFFFF";

    ctx.fillStyle = color;
    ctx.font = "bold 22px monospace";
    ctx.textAlign = "center";
    ctx.fillText(text, w / 2, h / 2);
  }
}
