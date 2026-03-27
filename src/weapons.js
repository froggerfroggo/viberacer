import { drawFn as boomerangDraw } from "../assets/weapons/boomerang.js";
import { drawFn as flashDraw } from "../assets/weapons/flash.js";
import { drawFn as hammerDraw } from "../assets/weapons/hammer.js";
import { drawFn as nunchakusDraw } from "../assets/weapons/nunchakus.js";
import { drawFn as scytheDraw } from "../assets/weapons/scythe.js";
import { drawFn as shurikenDraw } from "../assets/weapons/shuriken.js";
import { drawFn as stapleGunDraw } from "../assets/weapons/staple_gun.js";
import { drawFn as swordDraw } from "../assets/weapons/sword.js";

// Weapon roster sourced from /weapons/*.html

export const WEAPONS = [
  {
    id: "boomerang",
    name: "Boomerang",
    color: "#C89A5A",
    accentColor: "#7D4E1D",
    drawFn: boomerangDraw,
    stats: {
      lightDamageBonus: 4,
      heavyDamageBonus: 6,
      reachBonus: 10,
    },
  },
  {
    id: "flash",
    name: "Flash",
    color: "#79D5FF",
    accentColor: "#2A7AA8",
    drawFn: flashDraw,
    stats: {
      lightDamageBonus: 3,
      heavyDamageBonus: 5,
      reachBonus: 14,
    },
  },
  {
    id: "hammer",
    name: "Hammer",
    color: "#CCAA77",
    accentColor: "#664422",
    drawFn: hammerDraw,
    stats: {
      lightDamageBonus: 2,
      heavyDamageBonus: 14,
      reachBonus: 4,
    },
  },
  {
    id: "nunchakus",
    name: "Nunchakus",
    color: "#B07A46",
    accentColor: "#5C3717",
    drawFn: nunchakusDraw,
    stats: {
      lightDamageBonus: 6,
      heavyDamageBonus: 7,
      reachBonus: 5,
    },
  },
  {
    id: "scythe",
    name: "Scythe",
    color: "#8A7CAA",
    accentColor: "#3F3458",
    drawFn: scytheDraw,
    stats: {
      lightDamageBonus: 4,
      heavyDamageBonus: 12,
      reachBonus: 11,
    },
  },
  {
    id: "shuriken",
    name: "Shuriken",
    color: "#AAB8C8",
    accentColor: "#4A5868",
    drawFn: shurikenDraw,
    stats: {
      lightDamageBonus: 5,
      heavyDamageBonus: 8,
      reachBonus: 8,
    },
  },
  {
    id: "staple_gun",
    name: "Staple Gun",
    color: "#6699CC",
    accentColor: "#2F4F77",
    drawFn: stapleGunDraw,
    stats: {
      lightDamageBonus: 4,
      heavyDamageBonus: 6,
      reachBonus: 15,
    },
  },
  {
    id: "sword",
    name: "Sword",
    color: "#AABBDD",
    accentColor: "#445577",
    drawFn: swordDraw,
    stats: {
      lightDamageBonus: 3,
      heavyDamageBonus: 6,
      reachBonus: 8,
    },
  },
];
