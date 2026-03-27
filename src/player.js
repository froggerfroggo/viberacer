// Player / Fighter class
// Handles movement, physics, attack state machine, and placeholder drawing.
// Teammates: replace drawSprite() to render your sprite sheets.

export const STATE = {
  IDLE:         'idle',
  WALK:         'walk',
  JUMP:         'jump',
  FALL:         'fall',
  ATTACK_LIGHT: 'attackLight',
  ATTACK_HEAVY: 'attackHeavy',
  BLOCKING:     'blocking',
  HURT:         'hurt',
  DEAD:         'dead',
};

// Frame data for each attack type
export const ATTACKS = {
  light: {
    startup:    6,    // frames before hitbox appears
    active:     6,    // frames hitbox is live
    recovery:   12,   // frames after hitbox disappears
    reach:      28,   // horizontal hitbox reach (px)
    hitboxH:    18,   // vertical hitbox size (px)
    knockbackX: 4,
    knockbackY: -2.5,
    hitstun:    18,   // frames defender is stuck in HURT
  },
  heavy: {
    startup:    14,
    active:     8,
    recovery:   22,
    reach:      38,
    hitboxH:    22,
    knockbackX: 7,
    knockbackY: -4,
    hitstun:    30,
  },
};

export class Player {
  constructor(x, y, character, facing, playerId) {
    this.x        = x;        // center X (feet)
    this.y        = y;        // Y of feet (bottom)
    this.vx       = 0;
    this.vy       = 0;
    this.facing   = facing;   // 1 = right, -1 = left
    this.character = character;
    this.playerId  = playerId;

    this.w = 22;   // hurtbox width
    this.h = 38;   // hurtbox height

    this.health   = 100;
    this.grounded = false;
    this.state    = STATE.IDLE;

    // Attack tracking
    this.attackType  = null;   // 'light' | 'heavy'
    this.attackTimer = 0;      // frames remaining in this attack
    this.attackHit   = false;  // prevent multi-hit in one swing

    // Hitstun countdown
    this.hurtTimer = 0;

    // Animation frame counter — increments every update tick (~60/sec)
    this.frameCount = 0;

    // Equipped weapon (set by fight.js after selection)
    this.weapon = null;
  }

  // ── Stat shortcuts ────────────────────────────────────────────────

  get speed()       { return this.character.stats.speed; }
  get jumpForce()   { return this.character.stats.jumpForce; }
  get lightDamage() { return this.character.stats.lightDamage; }
  get heavyDamage() { return this.character.stats.heavyDamage; }

  // ── State queries ─────────────────────────────────────────────────

  isAttacking() {
    return this.state === STATE.ATTACK_LIGHT || this.state === STATE.ATTACK_HEAVY;
  }

  // True only during the active (hitbox-live) frames
  isActiveAttack() {
    if (!this.attackType) return false;
    const a       = ATTACKS[this.attackType];
    const total   = a.startup + a.active + a.recovery;
    const elapsed = total - this.attackTimer;
    return elapsed >= a.startup && elapsed < a.startup + a.active;
  }

  // Body hurtbox — top-left origin
  getHurtbox() {
    return { x: this.x - this.w / 2, y: this.y - this.h, w: this.w, h: this.h };
  }

  // Attack hitbox — only valid during active frames, else null
  getAttackHitbox() {
    if (!this.isAttacking() || !this.isActiveAttack()) return null;
    const a     = ATTACKS[this.attackType];
    const reach = a.reach + (this.weapon ? (this.weapon.stats.reachBonus || 0) : 0);
    return {
      x: this.facing === 1 ? this.x + 1 : this.x - 1 - reach,
      y: this.y - this.h * 0.72,
      w: reach,
      h: a.hitboxH,
    };
  }

  // ── Per-frame update ──────────────────────────────────────────────

  update(held, pressed, floorY, stageLeft, stageRight) {
    this.frameCount++;
    switch (this.state) {
      case STATE.IDLE:
      case STATE.WALK:
      case STATE.BLOCKING:
        this.updateGrounded(held, pressed);
        break;
      case STATE.JUMP:
      case STATE.FALL:
        this.updateAirborne(held, pressed);
        break;
      case STATE.ATTACK_LIGHT:
      case STATE.ATTACK_HEAVY:
        this.updateAttack();
        break;
      case STATE.HURT:
        this.updateHurt();
        break;
      case STATE.DEAD:
        // gravity only
        break;
    }

    // Apply physics
    this.vy += 0.55;
    if (this.vy > 14) this.vy = 14;
    this.x += this.vx;
    this.y += this.vy;

    // Floor collision
    if (this.y >= floorY) {
      this.y  = floorY;
      this.vy = 0;
      if (!this.grounded) {
        this.grounded = true;
        if (this.state === STATE.JUMP || this.state === STATE.FALL) {
          this.state = STATE.IDLE;
        }
      }
    } else {
      this.grounded = false;
    }

    // Stage walls
    const halfW = this.w / 2;
    if (this.x - halfW < stageLeft)  { this.x = stageLeft  + halfW; this.vx = 0; }
    if (this.x + halfW > stageRight) { this.x = stageRight - halfW; this.vx = 0; }
  }

  updateGrounded(held, pressed) {
    const wasBlocking = this.state === STATE.BLOCKING;

    // Block: hold down (no horizontal input)
    if (held.down && !held.left && !held.right) {
      this.state = STATE.BLOCKING;
      this.vx    = 0;
      return;
    }
    if (wasBlocking) this.state = STATE.IDLE;

    // Horizontal movement
    if (held.left && !held.right) {
      this.vx    = -this.speed;
      this.facing = -1;
      this.state  = STATE.WALK;
    } else if (held.right && !held.left) {
      this.vx    = this.speed;
      this.facing = 1;
      this.state  = STATE.WALK;
    } else {
      this.vx   *= 0.6;
      if (Math.abs(this.vx) < 0.2) this.vx = 0;
      this.state = STATE.IDLE;
    }

    // Jump
    if (pressed.up) {
      this.vy       = -this.jumpForce;
      this.grounded = false;
      this.state    = STATE.JUMP;
      return;
    }

    // Attacks (take priority over idle movement state)
    if (pressed.light) { this.startAttack('light'); return; }
    if (pressed.heavy) { this.startAttack('heavy'); return; }
  }

  updateAirborne(held, pressed) {
    // Limited air directional control
    if (held.left) {
      this.vx     = Math.max(this.vx - 0.5, -this.speed * 0.85);
      this.facing = -1;
    } else if (held.right) {
      this.vx     = Math.min(this.vx + 0.5, this.speed * 0.85);
      this.facing = 1;
    } else {
      this.vx *= 0.96;
    }

    this.state = this.vy < 0 ? STATE.JUMP : STATE.FALL;

    // Air attacks
    if (pressed.light) this.startAttack('light');
    else if (pressed.heavy) this.startAttack('heavy');
  }

  startAttack(type) {
    this.attackType  = type;
    this.attackHit   = false;
    const a          = ATTACKS[type];
    this.attackTimer = a.startup + a.active + a.recovery;
    this.state = type === 'light' ? STATE.ATTACK_LIGHT : STATE.ATTACK_HEAVY;
    if (this.grounded) this.vx *= 0.15; // brake on ground attacks
  }

  updateAttack() {
    this.attackTimer--;
    if (this.attackTimer <= 0) {
      this.attackType = null;
      this.state = this.grounded ? STATE.IDLE : STATE.FALL;
    }
  }

  updateHurt() {
    this.hurtTimer--;
    if (this.hurtTimer <= 0) {
      this.state = this.grounded ? STATE.IDLE : STATE.FALL;
    }
  }

  // Called by fight.js when an attack connects
  receiveHit(damage, kbX, kbY, hitstun) {
    if (this.state === STATE.DEAD) return;

    let actualDamage = damage;
    let kbMult       = 1;

    if (this.state === STATE.BLOCKING) {
      actualDamage = Math.max(1, Math.floor(damage * 0.1)); // chip damage
      kbMult       = 0.3;
    }

    this.health = Math.max(0, this.health - actualDamage);
    this.vx     = kbX * kbMult;
    this.vy     = kbY * kbMult;
    this.grounded = false;

    if (this.state !== STATE.BLOCKING) {
      this.hurtTimer = hitstun;
      this.state     = STATE.HURT;
    }

    if (this.health <= 0) {
      this.health = 0;
      this.state  = STATE.DEAD;
      this.vy     = -5;
    }
  }

  // ── Drawing ───────────────────────────────────────────────────────

  draw(ctx) {
    if (this.state === STATE.DEAD) {
      this.drawDead(ctx);
      return;
    }

    ctx.save();

    // Hurt flash
    if (this.state === STATE.HURT && Math.floor(this.hurtTimer / 3) % 2 === 0) {
      ctx.globalAlpha = 0.35;
    }

    if (this.character.drawFn) {
      this.character.drawFn(ctx, this.x, this.y, this.facing, this.state, this.frameCount);
    } else if (this.character.sprite) {
      this.drawSprite(ctx);
    } else {
      this.drawPlaceholder(ctx);
    }

    // Draw weapon on top of character
    if (this.weapon && this.weapon.drawFn) {
      this.weapon.drawFn(ctx, this.x, this.y, this.facing, this.state, this.frameCount);
    }

    // Active hitbox glow
    if (this.isActiveAttack()) {
      const hb = this.getAttackHitbox();
      if (hb) {
        ctx.fillStyle   = 'rgba(255,220,0,0.25)';
        ctx.strokeStyle = 'rgba(255,220,0,0.7)';
        ctx.lineWidth   = 1;
        ctx.fillRect(hb.x, hb.y, hb.w, hb.h);
        ctx.strokeRect(hb.x, hb.y, hb.w, hb.h);
      }
    }

    ctx.restore();
  }

  drawPlaceholder(ctx) {
    const px = Math.floor(this.x);
    const py = Math.floor(this.y);
    const w  = this.w;
    const h  = this.h;

    const headH = Math.floor(h * 0.38);
    const bodyH = h - headH;

    // Body
    ctx.fillStyle = this.character.color;
    ctx.fillRect(px - w / 2, py - h + headH, w, bodyH);

    // Head
    ctx.fillStyle = this.character.accentColor;
    ctx.fillRect(px - w / 2, py - h, w, headH);

    // Ears
    ctx.fillRect(px - w / 2 + 2, py - h - 4, 4, 5);
    ctx.fillRect(px + w / 2 - 6, py - h - 4, 4, 5);

    // Eye (on the facing side)
    const eyeX = this.facing === 1 ? px + 1 : px - 5;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(eyeX, py - h + 5, 4, 4);
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(eyeX + 1, py - h + 6, 2, 2);

    // Block shield ring
    if (this.state === STATE.BLOCKING) {
      ctx.strokeStyle = '#88CCFF';
      ctx.lineWidth   = 2;
      ctx.strokeRect(px - w / 2 - 3, py - h - 3, w + 6, h + 6);
    }

    // Attack startup tint
    if (this.isAttacking() && !this.isActiveAttack()) {
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.fillRect(px - w / 2, py - h, w, h);
    }
  }

  drawDead(ctx) {
    ctx.save();
    ctx.globalAlpha = 0.45;
    const px = Math.floor(this.x);
    const py = Math.floor(this.y);
    ctx.translate(px, py - this.w / 2);
    ctx.rotate(this.facing === 1 ? Math.PI / 2 : -Math.PI / 2);
    ctx.fillStyle = this.character.color;
    ctx.fillRect(-this.w / 2, -this.h, this.w, this.h);
    ctx.restore();
  }

  // ── Sprite integration (teammates implement here) ─────────────────
  // this.character.sprite         — HTMLImageElement
  // this.character.spriteFrameWidth / spriteFrameHeight — frame size
  // this.state                    — current animation state
  // this.facing                   — 1 right / -1 left (flip horizontally)
  // this.attackType, attackTimer  — for attack animation frame selection
  drawSprite(ctx) {
    // Fallback to placeholder until sprites are integrated
    this.drawPlaceholder(ctx);
  }
}
