import { Game } from './game.js';

const canvas = document.getElementById('gameCanvas');
const game = new Game(canvas);

// Scale canvas to window while keeping pixel-perfect aspect ratio
function resize() {
  const scaleX = window.innerWidth / 480;
  const scaleY = window.innerHeight / 270;
  const scale = Math.min(scaleX, scaleY);
  canvas.style.width  = `${Math.floor(480 * scale)}px`;
  canvas.style.height = `${Math.floor(270 * scale)}px`;
}
window.addEventListener('resize', resize);
resize();

game.start();
