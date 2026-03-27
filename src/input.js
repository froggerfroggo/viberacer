// Dual-player keyboard input handler
//
// Player 1: A/D move  |  W jump  |  S block  |  F light attack  |  G heavy attack
// Player 2: ←/→ move  |  ↑ jump  |  ↓ block  |  , light attack  |  . heavy attack

const held        = new Set();
const justPressed = new Set();

const PREVENT_KEYS = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);

window.addEventListener('keydown', e => {
  if (PREVENT_KEYS.has(e.code)) e.preventDefault();
  if (!held.has(e.code)) justPressed.add(e.code);
  held.add(e.code);
});

window.addEventListener('keyup', e => {
  held.delete(e.code);
});

// Call once per frame after all updates have run
export function clearFrame() {
  justPressed.clear();
}

const BINDINGS = {
  1: { left: 'KeyA', right: 'KeyD', up: 'KeyW', down: 'KeyS', light: 'KeyF', heavy: 'KeyG' },
  2: { left: 'ArrowLeft', right: 'ArrowRight', up: 'ArrowUp', down: 'ArrowDown', light: 'Comma', heavy: 'Period' },
};

export function getHeld(playerId) {
  const b = BINDINGS[playerId];
  return {
    left:  held.has(b.left),
    right: held.has(b.right),
    up:    held.has(b.up),
    down:  held.has(b.down),
    light: held.has(b.light),
    heavy: held.has(b.heavy),
  };
}

export function getPressed(playerId) {
  const b = BINDINGS[playerId];
  return {
    left:  justPressed.has(b.left),
    right: justPressed.has(b.right),
    up:    justPressed.has(b.up),
    down:  justPressed.has(b.down),
    light: justPressed.has(b.light),
    heavy: justPressed.has(b.heavy),
  };
}
