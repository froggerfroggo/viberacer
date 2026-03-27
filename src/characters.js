import { drawFn as catDraw } from "../assets/characters/cat.js";
import { drawFn as clippyDraw } from "../assets/characters/clippy.js";
import { drawFn as cockatielDraw } from "../assets/characters/cockatiel.js";
import { drawFn as crabDraw } from "../assets/characters/crab.js";
import { drawFn as dogDraw } from "../assets/characters/dog.js";
import { drawFn as rockyDraw } from "../assets/characters/rocky.js";
import { drawFn as rubberDuckDraw } from "../assets/characters/rubber_duck.js";
import { drawFn as snakeDraw } from "../assets/characters/snake.js";
import { drawFn as zappyDraw } from "../assets/characters/zappy.js";

// 9 fighters from /fighters/*.html

export const CHARACTERS = [
  {
    id: "cat",
    name: "Cat",
    color: "#FF9955",
    accentColor: "#CC5500",
    drawFn: catDraw,
    sprite: null,
    stats: { speed: 3.0, jumpForce: 11, lightDamage: 8, heavyDamage: 18 },
  },
  {
    id: "clippy",
    name: "Clippy",
    color: "#C8C060",
    accentColor: "#8A8030",
    drawFn: clippyDraw,
    sprite: null,
    stats: { speed: 3.5, jumpForce: 13, lightDamage: 7, heavyDamage: 14 },
  },
  {
    id: "cockatiel",
    name: "Cockatiel",
    color: "#E8D870",
    accentColor: "#B0B030",
    drawFn: cockatielDraw,
    sprite: null,
    stats: { speed: 2.5, jumpForce: 10, lightDamage: 12, heavyDamage: 22 },
  },
  {
    id: "crab",
    name: "Crab",
    color: "#E43A3A",
    accentColor: "#9C1E1E",
    drawFn: crabDraw,
    sprite: null,
    stats: { speed: 2.8, jumpForce: 10, lightDamage: 10, heavyDamage: 20 },
  },
  {
    id: "dog",
    name: "Dog",
    color: "#99BB66",
    accentColor: "#446622",
    drawFn: dogDraw,
    sprite: null,
    stats: { speed: 2.2, jumpForce: 9, lightDamage: 13, heavyDamage: 25 },
  },
  {
    id: "rocky",
    name: "Rocky",
    color: "#CC8855",
    accentColor: "#664422",
    drawFn: rockyDraw,
    sprite: null,
    stats: { speed: 4.0, jumpForce: 14, lightDamage: 6, heavyDamage: 12 },
  },
  {
    id: "rubber_duck",
    name: "Rubber Duck",
    color: "#F5E642",
    accentColor: "#C8B800",
    drawFn: rubberDuckDraw,
    sprite: null,
    stats: { speed: 3.2, jumpForce: 15, lightDamage: 8, heavyDamage: 16 },
  },
  {
    id: "snake",
    name: "Snake",
    color: "#55CC88",
    accentColor: "#227744",
    drawFn: snakeDraw,
    sprite: null,
    stats: { speed: 3.8, jumpForce: 11, lightDamage: 7, heavyDamage: 13 },
  },
  {
    id: "zappy",
    name: "Zappy",
    color: "#FFE642",
    accentColor: "#00AAFF",
    drawFn: zappyDraw,
    sprite: null,
    stats: { speed: 2.6, jumpForce: 12, lightDamage: 11, heavyDamage: 24 },
  },
];
