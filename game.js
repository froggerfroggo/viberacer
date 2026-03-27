const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");
const speedEl = document.getElementById("speed");
const overlayEl = document.getElementById("overlay");
const overlayTitleEl = document.getElementById("overlay-title");
const overlayTextEl = document.getElementById("overlay-text");

const road = {
  x: 85,
  width: 250,
  laneCount: 3,
};

const laneWidth = road.width / road.laneCount;
const player = {
  width: 42,
  height: 78,
  y: canvas.height - 120,
  lane: 1,
  targetX: 0,
  x: 0,
};

const state = {
  running: false,
  crashed: false,
  score: 0,
  best: Number(localStorage.getItem("viberacer-best")) || 0,
  distance: 0,
  speed: 5.5,
  traffic: [],
  laneDashOffset: 0,
  spawnTimer: 0,
  lastTime: 0,
};

bestEl.textContent = String(state.best);

function laneCenter(lane) {
  return road.x + laneWidth * lane + laneWidth / 2 - player.width / 2;
}

function resetGame() {
  state.running = true;
  state.crashed = false;
  state.score = 0;
  state.distance = 0;
  state.speed = 5.5;
  state.traffic = [];
  state.spawnTimer = 0;
  state.laneDashOffset = 0;
  player.lane = 1;
  player.targetX = laneCenter(player.lane);
  player.x = player.targetX;
  syncHud();
  hideOverlay();
}

function syncHud() {
  scoreEl.textContent = String(Math.floor(state.score));
  bestEl.textContent = String(state.best);
  speedEl.textContent = `${(state.speed / 5.5).toFixed(1)}x`;
}

function showOverlay(title, text) {
  overlayTitleEl.textContent = title;
  overlayTextEl.textContent = text;
  overlayEl.classList.remove("hidden");
}

function hideOverlay() {
  overlayEl.classList.add("hidden");
}

function spawnTraffic() {
  const lane = Math.floor(Math.random() * road.laneCount);
  const height = 72 + Math.random() * 20;
  state.traffic.push({
    lane,
    x: road.x + lane * laneWidth + laneWidth / 2 - 21,
    y: -height - 20,
    width: 42,
    height,
    color: ["#ff835c", "#4fd2ff", "#ffc94a", "#8eff88"][Math.floor(Math.random() * 4)],
  });
}

function update(delta) {
  if (!state.running) {
    return;
  }

  state.distance += delta * state.speed;
  state.score += delta * state.speed * 1.8;
  state.speed = Math.min(12, 5.5 + state.score / 220);
  state.laneDashOffset = (state.laneDashOffset + delta * state.speed * 220) % 80;
  state.spawnTimer -= delta;

  if (state.spawnTimer <= 0) {
    spawnTraffic();
    state.spawnTimer = Math.max(0.28, 0.9 - state.score / 800);
  }

  player.x += (player.targetX - player.x) * Math.min(1, delta * 14);

  state.traffic.forEach((car) => {
    car.y += delta * (state.speed * 90 + 180);
  });

  state.traffic = state.traffic.filter((car) => car.y < canvas.height + 120);

  for (const car of state.traffic) {
    if (isColliding(player, car)) {
      crash();
      break;
    }
  }

  if (state.score > state.best) {
    state.best = Math.floor(state.score);
    localStorage.setItem("viberacer-best", String(state.best));
  }

  syncHud();
}

function crash() {
  state.running = false;
  state.crashed = true;
  showOverlay("Crash!", `Final score: ${Math.floor(state.score)}. Press Space to race again.`);
}

function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function drawBackground() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
  sky.addColorStop(0, "#627384");
  sky.addColorStop(1, "#243343");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#2b6844";
  ctx.fillRect(0, 0, road.x, canvas.height);
  ctx.fillRect(road.x + road.width, 0, canvas.width - road.x - road.width, canvas.height);

  ctx.fillStyle = "#40484f";
  ctx.fillRect(road.x, 0, road.width, canvas.height);

  ctx.fillStyle = "#dce8f5";
  ctx.fillRect(road.x, 0, 6, canvas.height);
  ctx.fillRect(road.x + road.width - 6, 0, 6, canvas.height);

  ctx.fillStyle = "rgba(255,255,255,0.9)";
  for (let i = 1; i < road.laneCount; i += 1) {
    const x = road.x + laneWidth * i - 4;
    for (let y = -80 + state.laneDashOffset; y < canvas.height; y += 80) {
      ctx.fillRect(x, y, 8, 44);
    }
  }
}

function drawTrafficCar(car) {
  ctx.fillStyle = car.color;
  roundRect(ctx, car.x, car.y, car.width, car.height, 12, true);

  ctx.fillStyle = "rgba(14, 22, 34, 0.9)";
  roundRect(ctx, car.x + 6, car.y + 10, car.width - 12, 16, 7, true);
  roundRect(ctx, car.x + 6, car.y + car.height - 22, car.width - 12, 12, 6, true);
}

function drawPlayerCar() {
  const x = player.x;
  const y = player.y;

  ctx.fillStyle = "#6df7c1";
  roundRect(ctx, x, y, player.width, player.height, 13, true);

  ctx.fillStyle = "#08111b";
  roundRect(ctx, x + 6, y + 10, player.width - 12, 18, 8, true);
  roundRect(ctx, x + 7, y + 38, player.width - 14, 22, 7, true);

  ctx.fillStyle = "#f5fbff";
  ctx.fillRect(x + 5, y + 6, 9, 4);
  ctx.fillRect(x + player.width - 14, y + 6, 9, 4);
}

function roundRect(context, x, y, width, height, radius, fill) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
  if (fill) {
    context.fill();
  }
}

function draw() {
  drawBackground();
  state.traffic.forEach(drawTrafficCar);
  drawPlayerCar();
}

function frame(timestamp) {
  if (!state.lastTime) {
    state.lastTime = timestamp;
  }

  const delta = Math.min(0.033, (timestamp - state.lastTime) / 1000);
  state.lastTime = timestamp;

  update(delta);
  draw();
  requestAnimationFrame(frame);
}

function steer(direction) {
  if (!state.running && !state.crashed) {
    resetGame();
  }

  if (!state.running) {
    return;
  }

  player.lane = Math.max(0, Math.min(road.laneCount - 1, player.lane + direction));
  player.targetX = laneCenter(player.lane);
}

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
    steer(-1);
  }

  if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
    steer(1);
  }

  if (event.code === "Space" && state.crashed) {
    resetGame();
  }
});

showOverlay("Press Any Arrow Key", "Stay in the lane, avoid traffic, and chase a new high score.");
draw();
requestAnimationFrame(frame);
