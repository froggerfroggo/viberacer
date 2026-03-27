// map.js - multi-theme artistic pixel maps
// Virtual grid: 200 x 120 pixels, scaled to fit canvas.
// Call drawFieldMap(ctx, width, height, { time, mapType, season }) to paint the background.

const FIELD_MAP = ((global) => {
  "use strict";

  const VIRTUAL_WIDTH = 200;
  const VIRTUAL_HEIGHT = 120;
  let SCALE = 4;

  const SEASON_ORDER = ["spring", "summer", "autumn", "winter"];

  const SEASON_PALETTES = {
    meadow: {
      spring: { skyTop: "#314f88", skyMid: "#f3a07d", skyLow: "#f6ddb3", skyBottom: "#b8e7d3", grass: "#78c86f", grassDark: "#4b8d43", path: "#c8af7d", tree1: "#66aa63", tree2: "#4f844a", bloom: "#f6c6d8", accent: "#fff1a8" },
      summer: { skyTop: "#1a2248", skyMid: "#f29672", skyLow: "#f6c68f", skyBottom: "#9fd6d4", grass: "#7fbb62", grassDark: "#599347", path: "#c8ad79", tree1: "#69aa68", tree2: "#3f7443", bloom: "#efd0d0", accent: "#e2f5a8" },
      autumn: { skyTop: "#403054", skyMid: "#db7c4d", skyLow: "#f4bc77", skyBottom: "#d8bf8f", grass: "#909052", grassDark: "#6e6a39", path: "#b78c5c", tree1: "#bf7d3b", tree2: "#8a4f2e", bloom: "#f2cf7a", accent: "#ffe2a2" },
      winter: { skyTop: "#4c618e", skyMid: "#f0b5a2", skyLow: "#f6dec8", skyBottom: "#ddeef6", grass: "#d8e6df", grassDark: "#a9bcc4", path: "#d8d5cf", tree1: "#d7e2e8", tree2: "#b9c7d2", bloom: "#ffffff", accent: "#f7fbff" },
    },
    forest: {
      spring: { skyTop: "#364f7f", skyMid: "#f1a58c", skyLow: "#f5e1ba", skyBottom: "#bfd9bd", canopy1: "#76b75f", canopy2: "#4f8445", canopy3: "#a7d47e", ground: "#6aa052", groundDark: "#4b7238", leaf: "#f2d7e7", bark: "#6c4229" },
      summer: { skyTop: "#24385f", skyMid: "#ee936d", skyLow: "#f0c695", skyBottom: "#a7cfa0", canopy1: "#5f8e40", canopy2: "#3d652e", canopy3: "#85b35c", ground: "#5f8a43", groundDark: "#466734", leaf: "#ffe59a", bark: "#694025" },
      autumn: { skyTop: "#352b4e", skyMid: "#de7443", skyLow: "#f4b067", skyBottom: "#d9ae7c", canopy1: "#b6552f", canopy2: "#7d341f", canopy3: "#e39b3a", ground: "#836b3d", groundDark: "#604c2c", leaf: "#f0cc71", bark: "#5b331e" },
      winter: { skyTop: "#4a567d", skyMid: "#dcaea4", skyLow: "#f0ddd7", skyBottom: "#d9e7ee", canopy1: "#d8e1e6", canopy2: "#b8c5cd", canopy3: "#eef3f6", ground: "#cfd9de", groundDark: "#a6b2ba", leaf: "#ffffff", bark: "#5e4b42" },
    },
    castle: {
      spring: { skyTop: "#121a43", skyMid: "#27336f", moon: "#ece6db", stone: "#74798f", stoneDark: "#51566f", lawn: "#6aa35c", lawnDark: "#4a773f", banner: "#f08da0", water: "#3d5a7d" },
      summer: { skyTop: "#0f1536", skyMid: "#1d2854", moon: "#f6efc8", stone: "#76788a", stoneDark: "#57596b", lawn: "#5f954f", lawnDark: "#416938", banner: "#d8bf62", water: "#355070" },
      autumn: { skyTop: "#171330", skyMid: "#33244d", moon: "#f5d8a0", stone: "#7d736d", stoneDark: "#5f534f", lawn: "#867243", lawnDark: "#615230", banner: "#cf6f3e", water: "#4d445f" },
      winter: { skyTop: "#1a2240", skyMid: "#334567", moon: "#f6fbff", stone: "#a5b1bf", stoneDark: "#738193", lawn: "#dfe7ee", lawnDark: "#b3c0ca", banner: "#93b6d8", water: "#58708c" },
    },
  };

  const MAPS = {
    meadow: {
      label: "Painterly Meadow",
      earth: true,
      platforms: [
        { x: 48, y: 63, w: 28, h: 5 },
        { x: 122, y: 55, w: 24, h: 5 },
      ],
    },
    forest: {
      label: "Autumn Forest",
      earth: true,
      platforms: [
        { x: 36, y: 64, w: 30, h: 5 },
        { x: 116, y: 58, w: 28, h: 5 },
      ],
    },
    underwater: {
      label: "Underwater Garden",
      earth: false,
      platforms: [
        { x: 44, y: 68, w: 26, h: 5 },
        { x: 126, y: 58, w: 24, h: 5 },
      ],
    },
    castle: {
      label: "Night At The Castle",
      earth: true,
      platforms: [
        { x: 32, y: 70, w: 28, h: 5 },
        { x: 128, y: 60, w: 26, h: 5 },
      ],
    },
    space: {
      label: "Starfield Drift",
      earth: false,
      platforms: [
        { x: 38, y: 66, w: 24, h: 5 },
        { x: 124, y: 54, w: 22, h: 5 },
      ],
    },
  };

  function r(ctx, x, y, w, h, color) {
    if (w <= 0 || h <= 0) {
      return;
    }
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x * SCALE), Math.round(y * SCALE), Math.round(w * SCALE), Math.round(h * SCALE));
  }

  function drawRects(ctx, ox, oy, rects) {
    rects.forEach(([dx, dy, w, h, color]) => r(ctx, ox + dx, oy + dy, w, h, color));
  }

  function fillBands(ctx, bands) {
    bands.forEach(([y, h, color]) => r(ctx, 0, y, VIRTUAL_WIDTH, h, color));
  }

  function seasonFor(mapType, season) {
    if (!MAPS[mapType] || !MAPS[mapType].earth) {
      return "summer";
    }
    return SEASON_ORDER.includes(season) ? season : "summer";
  }

  function drawSparkleStar(ctx, x, y, color) {
    r(ctx, x, y, 1, 1, color);
    r(ctx, x - 1, y, 1, 1, "#cbd6ff");
    r(ctx, x + 1, y, 1, 1, "#cbd6ff");
    r(ctx, x, y - 1, 1, 1, "#cbd6ff");
    r(ctx, x, y + 1, 1, 1, "#cbd6ff");
  }

  function drawStars(ctx, stars, time, shimmerA, shimmerB) {
    stars.forEach(([x, y], index) => {
      const glow = (Math.sin(time * 0.002 + index * 1.3) + 1) / 2;
      r(ctx, x, y, 1, 1, glow > 0.6 ? shimmerA : shimmerB);
      if (glow > 0.78) {
        drawSparkleStar(ctx, x, y, shimmerA);
      }
    });
  }

  function drawCloud(ctx, x, y, top, mid, base) {
    r(ctx, x + 6, y, 8, 3, top);
    r(ctx, x + 2, y + 2, 16, 4, top);
    r(ctx, x, y + 5, 20, 5, mid);
    r(ctx, x + 2, y + 10, 16, 2, base);
  }

  function drawSun(ctx, x, y, time, halo, outer, inner, core) {
    const pulse = Math.floor((Math.sin(time * 0.0015) + 1) * 1.5);
    r(ctx, x - 12 - pulse, y - 12 - pulse, 24 + pulse * 2, 24 + pulse * 2, halo);
    r(ctx, x - 9, y - 9, 18, 18, outer);
    r(ctx, x - 6, y - 6, 12, 12, inner);
    r(ctx, x - 2, y - 2, 4, 4, core);
  }

  function drawMoon(ctx, x, y, outer, inner) {
    r(ctx, x - 8, y - 8, 16, 16, outer);
    r(ctx, x - 4, y - 5, 10, 10, inner);
    r(ctx, x + 1, y - 2, 6, 8, "#000000");
  }

  function drawPetCat(ctx, ox, oy) {
    const O = "#ff8b46";
    const S = "#bf541f";
    const B = "#ffe3c6";
    const E = "#e36d38";
    const I = "#ffc39d";
    const G = "#4ab26a";
    const P = "#000000";
    const N = "#ff7295";
    const M = "#90331f";

    drawRects(ctx, ox, oy, [
      [2, 0, 2, 2, E], [3, 1, 1, 1, I],
      [8, 0, 2, 2, E], [8, 1, 1, 1, I],
      [1, 2, 10, 6, O],
      [2, 2, 1, 2, S], [5, 2, 1, 2, S], [9, 2, 1, 2, S],
      [2, 4, 2, 2, "#ffffff"], [2, 5, 2, 1, G], [3, 5, 1, 1, P],
      [7, 4, 2, 2, "#ffffff"], [7, 5, 2, 1, G], [8, 5, 1, 1, P],
      [5, 6, 2, 1, N],
      [4, 7, 1, 1, M], [7, 7, 1, 1, M],
      [2, 8, 8, 2, O],
      [1, 9, 10, 6, O],
      [2, 10, 8, 4, B],
      [1, 11, 1, 3, S], [10, 11, 1, 3, S],
      [11, 12, 3, 1, O], [13, 11, 1, 2, O], [12, 10, 1, 1, O],
      [2, 15, 3, 2, O], [7, 15, 3, 2, O],
      [2, 16, 3, 1, B], [7, 16, 3, 1, B],
    ]);
  }

  function drawPetDog(ctx, ox, oy) {
    const D = "#da9442";
    const L = "#f2d18c";
    const W = "#fff1de";
    const K = "#1e0d04";
    const T = "#b96b2b";

    drawRects(ctx, ox, oy, [
      [1, 0, 3, 4, T], [2, 1, 1, 2, W],
      [8, 0, 3, 4, T], [9, 1, 1, 2, W],
      [1, 3, 10, 7, D],
      [1, 3, 10, 2, T],
      [2, 7, 8, 3, L],
      [2, 5, 2, 2, K], [3, 5, 1, 1, "#ffffff"],
      [8, 5, 2, 2, K], [9, 5, 1, 1, "#ffffff"],
      [4, 7, 4, 2, K],
      [1, 7, 1, 2, W], [10, 7, 1, 2, W],
      [2, 10, 8, 2, D],
      [1, 11, 10, 5, D],
      [2, 12, 8, 4, L],
      [1, 12, 1, 3, T], [10, 12, 1, 3, T],
      [11, 11, 2, 1, D], [12, 10, 2, 2, D], [11, 9, 1, 2, T],
      [2, 16, 3, 2, D], [7, 16, 3, 2, D],
      [2, 17, 3, 1, L], [7, 17, 3, 1, L],
    ]);
  }

  function drawPetDuck(ctx, ox, oy) {
    const Y = "#ffd761";
    const O = "#ff9e2c";
    const K = "#000000";
    const W = "#fff4d0";

    drawRects(ctx, ox, oy, [
      [0, 3, 6, 4, Y],
      [1, 2, 4, 5, Y],
      [1, 0, 4, 3, Y],
      [2, 0, 2, 4, Y],
      [4, 1, 3, 1, O],
      [4, 2, 3, 2, O],
      [2, 1, 1, 1, W], [3, 0, 1, 1, K],
      [0, 4, 1, 2, O], [5, 4, 1, 2, O],
    ]);
  }

  function drawPlatformChunk(ctx, platform, topColor, bodyColor, detailColor, tuftColor) {
    const { x, y, w, h } = platform;
    r(ctx, x, y, w, h, bodyColor);
    r(ctx, x, y, w, 1, topColor);
    r(ctx, x, y + h - 1, w, 1, detailColor);
    r(ctx, x, y + 2, w, 1, detailColor);
    for (let bx = 4; bx < w; bx += 4) {
      r(ctx, x + bx, y + 1, 1, h - 1, detailColor);
    }
    r(ctx, x, y - 2, w, 2, tuftColor);
    r(ctx, x, y - 3, w, 1, "#edf8c0");
    for (let bx = 1; bx < w; bx += 5) {
      r(ctx, x + bx, y - 4, 1, 2, tuftColor);
    }
  }

  function drawEarthPlatforms(ctx, platforms, tuftColor) {
    platforms.forEach((platform) => {
      drawPlatformChunk(ctx, platform, "#d5b089", "#8d6043", "#5d3a25", tuftColor);
    });
  }

  function drawUnderwaterPlatforms(ctx, platforms) {
    platforms.forEach((platform) => {
      const { x, y, w, h } = platform;
      r(ctx, x, y, w, h, "#7f6f62");
      r(ctx, x, y, w, 1, "#c8b29c");
      r(ctx, x, y + h - 1, w, 1, "#5b4f48");
      for (let bx = 3; bx < w; bx += 4) {
        r(ctx, x + bx, y + 1, 1, h - 1, "#68584e");
      }
      for (let coral = 2; coral < w; coral += 6) {
        r(ctx, x + coral, y - 4, 1, 4, coral % 12 === 2 ? "#ff8c8c" : "#85f0e5");
      }
    });
  }

  function drawSpacePlatforms(ctx, platforms, time) {
    platforms.forEach((platform, index) => {
      const drift = Math.floor(Math.sin(time * 0.0012 + index) * 1.5);
      const { x, y, w, h } = platform;
      r(ctx, x, y + drift, w, h, "#726985");
      r(ctx, x + 1, y + drift - 1, w - 2, 1, "#b7a9d0");
      r(ctx, x + 2, y + drift + h, w - 4, 1, "#433e56");
      r(ctx, x + 3, y + drift + 1, 4, 2, "#9283ab");
      r(ctx, x + w - 7, y + drift + 2, 3, 2, "#8c8a9a");
    });
  }

  function drawMeadow(ctx, time, season) {
    const palette = SEASON_PALETTES.meadow[season];
    fillBands(ctx, [
      [0, 18, palette.skyTop],
      [18, 18, "#4f65a0"],
      [36, 16, palette.skyMid],
      [52, 12, palette.skyLow],
      [64, 14, "#f5dec4"],
      [78, 42, palette.skyBottom],
    ]);

    drawSun(ctx, 150, 24, time, "#f8d6a0", "#f8bc73", "#ffe28a", "#fff5c7");
    drawStars(ctx, [[12, 8], [28, 16], [54, 10], [84, 18], [116, 12], [176, 14]], time, "#fff8eb", "#c1d1ff");
    drawCloud(ctx, 10 + Math.floor(Math.sin(time * 0.0004) * 2), 18, "#eef6ff", "#d9ebfb", "#bcd7ed");
    drawCloud(ctx, 106 - Math.floor(Math.sin(time * 0.00035) * 2), 24, "#fff1dd", "#ffd6bb", "#f9b996");

    for (let x = 0; x < VIRTUAL_WIDTH; x++) {
      const hillA = 82 - Math.floor(Math.max(0, 1 - Math.abs(x - 70) / 45) * 16);
      const hillB = 84 - Math.floor(Math.max(0, 1 - Math.abs(x - 148) / 36) * 13);
      const top = Math.min(88, hillA, hillB);
      r(ctx, x, top, 1, VIRTUAL_HEIGHT - top, "#60765d");
      r(ctx, x, top, 1, 1, "#87a183");
    }

    r(ctx, 58, 78, 84, 12, "#5b8db2");
    r(ctx, 60, 80, 80, 9, "#73a8bf");
    r(ctx, 68, 82, 62, 5, "#9ed1d4");
    for (let i = 0; i < 7; i++) {
      const shift = Math.floor((Math.sin(time * 0.0022 + i) + 1) * 1.5);
      r(ctx, 66 + i * 10 + shift, 81 + (i % 3), 7, 1, "#dff3ee");
    }

    r(ctx, 0, 86, VIRTUAL_WIDTH, 2, season === "winter" ? "#edf6fb" : "#d3c77d");
    r(ctx, 0, 88, VIRTUAL_WIDTH, 6, palette.grass);
    r(ctx, 0, 94, VIRTUAL_WIDTH, 8, palette.grassDark);
    r(ctx, 0, 102, VIRTUAL_WIDTH, 18, "#5f432e");
    r(ctx, 0, 109, VIRTUAL_WIDTH, 11, "#493121");

    for (let x = 0; x < VIRTUAL_WIDTH; x += 5) {
      r(ctx, x, 84 + (x % 3), 1, 5, season === "winter" ? "#eef5f9" : palette.tree1);
      r(ctx, x + 1, 85 + ((x + 1) % 2), 1, 3, palette.accent);
      r(ctx, x + 2, 85, 1, 4, season === "winter" ? "#dce5ec" : "#70b555");
    }

    for (let y = 86; y < 120; y++) {
      const widen = Math.floor((y - 86) * 0.42);
      const left = 102 - 7 - widen;
      const width = 14 + widen * 2;
      r(ctx, left, y, width, 1, palette.path);
      if (y % 3 === 0) {
        r(ctx, left + 1, y, width - 2, 1, season === "winter" ? "#f4f6f8" : "#dcc69a");
      }
    }

    [6, 20, 162, 178].forEach((x, index) => {
      const paletteIndex = index % 2 === 0 ? palette.tree1 : palette.tree2;
      const bloom = season === "spring" ? "#f5bfd2" : season === "autumn" ? "#f6cc6a" : season === "winter" ? "#ffffff" : palette.bloom;
      const groundY = index < 2 ? 94 + index * 2 : 94 + (index - 2) * 2;
      r(ctx, x + 4, groundY - 14, 4, 14, "#5f3320");
      r(ctx, x + 5, groundY - 14, 2, 14, "#8a5131");
      r(ctx, x, groundY - 24, 16, 6, palette.tree2);
      r(ctx, x + 2, groundY - 20, 12, 6, paletteIndex);
      r(ctx, x + 3, groundY - 16, 10, 6, palette.tree1);
      r(ctx, x + 5, groundY - 12, 6, 5, season === "winter" ? "#dfe9ef" : palette.tree1);
      r(ctx, x + 3, groundY - 22, 2, 2, bloom);
      r(ctx, x + 9, groundY - 18, 2, 2, bloom);
    });

    r(ctx, 0, 90, 42, 2, "#d8c6a1");
    r(ctx, 0, 95, 42, 2, "#b89c73");
    r(ctx, 160, 90, 40, 2, "#d8c6a1");
    r(ctx, 160, 95, 40, 2, "#b89c73");
    for (let x = 0; x < 42; x += 8) {
      r(ctx, x, 85, 2, 17, "#ae8458");
      r(ctx, x + 1, 86, 1, 15, "#d7b487");
    }
    for (let x = 160; x < 200; x += 8) {
      r(ctx, x, 85, 2, 17, "#ae8458");
      r(ctx, x + 1, 86, 1, 15, "#d7b487");
    }

    const flowers = [
      [36, 89], [42, 90], [48, 89], [55, 90], [62, 89],
      [133, 90], [140, 89], [147, 90], [154, 89], [92, 99], [110, 99],
    ];
    flowers.forEach(([x, y], index) => {
      const bloom = season === "autumn" ? "#f6b84f" : season === "winter" ? "#ffffff" : index % 2 === 0 ? "#ff7aa2" : "#ffcf54";
      r(ctx, x + 1, y - 4, 1, 4, "#467a32");
      r(ctx, x + 1, y - 6, 1, 1, bloom);
      r(ctx, x, y - 5, 1, 1, bloom);
      r(ctx, x + 2, y - 5, 1, 1, bloom);
      r(ctx, x + 1, y - 4, 1, 1, season === "winter" ? "#d8e6ef" : "#fff1a3");
    });

    drawEarthPlatforms(ctx, MAPS.meadow.platforms, season === "winter" ? "#d7e6ef" : "#8fd870");
    drawPetDog(ctx, 6, 69);
    drawPetCat(ctx, 176, 69);
    drawPetDuck(ctx, 134, 49);

    [[24, 74], [34, 67], [58, 73], [78, 65], [121, 70], [138, 75], [167, 69]].forEach(([x, y], index) => {
      const glow = (Math.sin(time * 0.003 + index * 0.9) + 1) / 2;
      if (glow > 0.35) {
        r(ctx, x, y, 1, 1, glow > 0.7 ? "#fff8bf" : "#f0e28a");
      }
    });
  }

  function drawForest(ctx, time, season) {
    const palette = SEASON_PALETTES.forest[season];
    fillBands(ctx, [
      [0, 18, palette.skyTop],
      [18, 18, "#465d8b"],
      [36, 16, palette.skyMid],
      [52, 12, palette.skyLow],
      [64, 14, "#e7d0aa"],
      [78, 42, "#9eb687"],
    ]);

    drawSun(ctx, 34, 26, time, "#f5d9a3", "#efbb63", "#ffd982", "#fff0b8");
    drawCloud(ctx, 122 + Math.floor(Math.sin(time * 0.0004) * 2), 18, "#fff0e2", "#ffd8c5", "#f2b395");

    for (let x = 0; x < VIRTUAL_WIDTH; x++) {
      const hillA = 76 - Math.floor(Math.max(0, 1 - Math.abs(x - 40) / 34) * 10);
      const hillB = 80 - Math.floor(Math.max(0, 1 - Math.abs(x - 102) / 44) * 14);
      const hillC = 78 - Math.floor(Math.max(0, 1 - Math.abs(x - 170) / 30) * 12);
      const top = Math.min(90, hillA, hillB, hillC);
      r(ctx, x, top, 1, VIRTUAL_HEIGHT - top, "#536344");
      r(ctx, x, top, 1, 1, "#8aa16f");
    }

    r(ctx, 0, 90, VIRTUAL_WIDTH, 5, palette.ground);
    r(ctx, 0, 95, VIRTUAL_WIDTH, 8, palette.groundDark);
    r(ctx, 0, 103, VIRTUAL_WIDTH, 17, "#4f3524");

    for (let x = 0; x < VIRTUAL_WIDTH; x += 4) {
      const y = 86 + (x % 3);
      r(ctx, x, y, 1, 4, season === "winter" ? "#ebf3f7" : palette.canopy3);
      r(ctx, x + 1, y + 1, 1, 3, season === "winter" ? "#d6e0e6" : palette.canopy1);
    }

    const trunks = [4, 17, 31, 46, 60, 144, 160, 175, 188];
    trunks.forEach((x, index) => {
      const base = 92 + (index % 3) * 2;
      const h = 18 + (index % 4) * 2;
      r(ctx, x + 2, base - h, 4, h, palette.bark);
      r(ctx, x + 3, base - h, 2, h, "#8d5938");
      r(ctx, x - 4, base - h - 10, 12, 6, palette.canopy2);
      r(ctx, x - 6, base - h - 16, 16, 6, palette.canopy1);
      r(ctx, x - 3, base - h - 21, 10, 5, palette.canopy3);
      const leaf = season === "winter" ? "#ffffff" : palette.leaf;
      r(ctx, x - 1, base - h - 18, 2, 2, leaf);
      r(ctx, x + 5, base - h - 14, 2, 2, leaf);
    });

    for (let y = 92; y < 120; y++) {
      const left = 90 - Math.floor((y - 92) * 0.2);
      const width = 20 + Math.floor((y - 92) * 0.8);
      r(ctx, left, y, width, 1, season === "winter" ? "#e7edf1" : "#9d7a49");
      if (y % 3 === 0) {
        r(ctx, left + 2, y, width - 4, 1, season === "winter" ? "#f9fdff" : "#c79b5d");
      }
    }

    const leafDrifts = [
      [20, 98], [30, 101], [54, 95], [72, 100], [118, 97], [138, 103], [165, 96],
    ];
    leafDrifts.forEach(([x, y], index) => {
      const color = season === "spring" ? "#f1d3e4" : season === "summer" ? "#f6d874" : season === "winter" ? "#ffffff" : index % 2 === 0 ? "#d7733c" : "#f0b248";
      r(ctx, x, y, 2, 1, color);
      r(ctx, x + 1, y + 1, 1, 1, color);
    });

    drawEarthPlatforms(ctx, MAPS.forest.platforms, season === "winter" ? "#dce8ef" : "#7cb764");
    drawPetDog(ctx, 42, 45);
    drawPetCat(ctx, 126, 39);
    drawPetDuck(ctx, 84, 97);
  }

  function drawUnderwater(ctx, time) {
    fillBands(ctx, [
      [0, 18, "#0d3564"],
      [18, 20, "#14568d"],
      [38, 18, "#1f7fb0"],
      [56, 16, "#34a7c6"],
      [72, 48, "#67d0cd"],
    ]);

    for (let x = 0; x < VIRTUAL_WIDTH; x += 18) {
      r(ctx, x + Math.floor(Math.sin(time * 0.0008 + x) * 2), 0, 6, 56, "rgba(255,255,255,0.08)");
    }

    for (let x = 0; x < VIRTUAL_WIDTH; x++) {
      const duneA = 95 - Math.floor(Math.max(0, 1 - Math.abs(x - 48) / 50) * 9);
      const duneB = 98 - Math.floor(Math.max(0, 1 - Math.abs(x - 148) / 46) * 11);
      const top = Math.min(104, duneA, duneB);
      r(ctx, x, top, 1, VIRTUAL_HEIGHT - top, "#ccae70");
      r(ctx, x, top, 1, 1, "#efdc9b");
    }

    [[18, 102, "#ff8b8b"], [24, 104, "#85f0e5"], [36, 99, "#9d74ff"], [158, 103, "#ff9e63"], [170, 99, "#85f0e5"]]
      .forEach(([x, y, color]) => {
        r(ctx, x, y - 8, 2, 8, color);
        r(ctx, x - 1, y - 6, 4, 2, color);
        r(ctx, x + 1, y - 11, 1, 3, color);
      });

    [[56, 96], [76, 90], [96, 94], [124, 92], [144, 88]].forEach(([x, y], index) => {
      r(ctx, x, y, 6, 2, index % 2 === 0 ? "#c2f4ef" : "#ffd8b5");
      r(ctx, x + 6, y + 1, 2, 1, index % 2 === 0 ? "#7dd7ce" : "#ff9e63");
      r(ctx, x + 1, y - 1, 1, 1, "#132f4a");
    });

    for (let i = 0; i < 20; i++) {
      const x = 10 + (i * 9) % 180;
      const y = 94 - ((i * 7 + Math.floor(time * 0.02)) % 70);
      r(ctx, x, y, 2, 2, "rgba(232,250,255,0.55)");
      r(ctx, x + 1, y - 3, 1, 1, "rgba(232,250,255,0.45)");
    }

    drawUnderwaterPlatforms(ctx, MAPS.underwater.platforms);
    drawPetDuck(ctx, 48, 56);
    drawPetCat(ctx, 128, 46);
    drawPetDog(ctx, 92, 96);
  }

  function drawCastle(ctx, time, season) {
    const palette = SEASON_PALETTES.castle[season];
    fillBands(ctx, [
      [0, 22, palette.skyTop],
      [22, 24, palette.skyMid],
      [46, 18, "#394974"],
      [64, 56, "#25304e"],
    ]);

    drawMoon(ctx, 156, 24, palette.moon, "#11172f");
    drawStars(ctx, [[16, 12], [28, 26], [42, 16], [70, 24], [88, 10], [118, 18], [178, 14], [190, 26]], time, "#f5efe2", "#95a4e7");

    for (let x = 0; x < VIRTUAL_WIDTH; x++) {
      const hillA = 86 - Math.floor(Math.max(0, 1 - Math.abs(x - 44) / 32) * 10);
      const hillB = 90 - Math.floor(Math.max(0, 1 - Math.abs(x - 160) / 44) * 13);
      const top = Math.min(94, hillA, hillB);
      r(ctx, x, top, 1, VIRTUAL_HEIGHT - top, "#202938");
    }

    r(ctx, 0, 94, VIRTUAL_WIDTH, 8, palette.lawn);
    r(ctx, 0, 102, VIRTUAL_WIDTH, 18, palette.lawnDark);
    r(ctx, 0, 108, VIRTUAL_WIDTH, 12, "#3b302f");
    r(ctx, 72, 98, 56, 9, palette.water);
    r(ctx, 76, 100, 48, 4, "#6f94b4");

    const castleX = 76;
    r(ctx, castleX + 10, 38, 28, 40, palette.stone);
    r(ctx, castleX, 46, 14, 32, palette.stoneDark);
    r(ctx, castleX + 34, 42, 16, 36, palette.stoneDark);
    r(ctx, castleX + 4, 40, 6, 10, palette.stoneDark);
    r(ctx, castleX + 38, 36, 8, 10, palette.stoneDark);
    r(ctx, castleX + 18, 56, 8, 22, "#2c2333");
    r(ctx, castleX + 20, 60, 4, 18, "#1a1322");
    r(ctx, castleX + 4, 54, 4, 8, "#f5d679");
    r(ctx, castleX + 40, 50, 4, 8, "#f5d679");
    r(ctx, castleX + 6, 48, 3, 8, palette.banner);
    r(ctx, castleX + 40, 44, 3, 10, palette.banner);

    for (let x = 0; x < VIRTUAL_WIDTH; x += 6) {
      r(ctx, x, 91 + (x % 4 === 0 ? 1 : 0), 1, 3, season === "winter" ? "#eef5fb" : palette.lawn);
    }

    drawEarthPlatforms(ctx, MAPS.castle.platforms, season === "winter" ? "#e2eef5" : "#7db36f");
    drawPetCat(ctx, 34, 51);
    drawPetDog(ctx, 132, 41);
    drawPetDuck(ctx, 94, 87);
  }

  function drawSpace(ctx, time) {
    fillBands(ctx, [
      [0, 18, "#090615"],
      [18, 18, "#151133"],
      [36, 20, "#24194f"],
      [56, 16, "#1a2e57"],
      [72, 48, "#0a1024"],
    ]);

    const nebula = [
      [28, 18, 28, 10, "rgba(193,123,255,0.25)"],
      [110, 26, 38, 12, "rgba(93,187,255,0.23)"],
      [166, 16, 24, 8, "rgba(255,126,188,0.22)"],
    ];
    nebula.forEach(([x, y, w, h, color]) => r(ctx, x, y, w, h, color));

    drawStars(ctx, [[8, 10], [18, 28], [30, 18], [44, 8], [61, 24], [80, 14], [102, 30], [124, 10], [150, 20], [176, 12], [192, 26]], time, "#fffaf0", "#8fb3ff");

    r(ctx, 22, 22, 16, 16, "#f2c472");
    r(ctx, 24, 24, 12, 12, "#f9e09d");
    r(ctx, 154, 30, 12, 12, "#73d2e3");
    r(ctx, 158, 32, 4, 4, "#dff8ff");

    for (let x = 0; x < VIRTUAL_WIDTH; x++) {
      const ridgeA = 104 - Math.floor(Math.max(0, 1 - Math.abs(x - 58) / 44) * 10);
      const ridgeB = 107 - Math.floor(Math.max(0, 1 - Math.abs(x - 152) / 42) * 12);
      const top = Math.min(112, ridgeA, ridgeB);
      r(ctx, x, top, 1, VIRTUAL_HEIGHT - top, "#2b2740");
      if (top < 112 && x % 11 < 2) {
        r(ctx, x, top - 1, 1, 1, "#8cf4ff");
      }
    }

    for (let i = 0; i < 8; i++) {
      const x = 18 + i * 22;
      const y = 76 + ((i * 9) % 18);
      const pulse = Math.floor((Math.sin(time * 0.002 + i) + 1) * 1.5);
      r(ctx, x, y, 2 + pulse, 2 + pulse, "#79e4ff");
    }

    drawSpacePlatforms(ctx, MAPS.space.platforms, time);
    drawPetCat(ctx, 42, 50);
    drawPetDog(ctx, 130, 38);
    drawPetDuck(ctx, 92, 96);
  }

  function drawFieldMap(ctx, canvasWidth, canvasHeight, options = {}) {
    const mapType = MAPS[options.mapType] ? options.mapType : "meadow";
    const season = seasonFor(mapType, options.season);
    const time = options.time || 0;

    SCALE = Math.min(canvasWidth / VIRTUAL_WIDTH, canvasHeight / VIRTUAL_HEIGHT);
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    if (mapType === "meadow") {
      drawMeadow(ctx, time, season);
    } else if (mapType === "forest") {
      drawForest(ctx, time, season);
    } else if (mapType === "underwater") {
      drawUnderwater(ctx, time);
    } else if (mapType === "castle") {
      drawCastle(ctx, time, season);
    } else {
      drawSpace(ctx, time);
    }
  }

  function getFieldPlatforms(canvasWidth, canvasHeight, options = {}) {
    const mapType = MAPS[options.mapType] ? options.mapType : "meadow";
    const scale = Math.min(canvasWidth / VIRTUAL_WIDTH, canvasHeight / VIRTUAL_HEIGHT);
    return MAPS[mapType].platforms.map(({ x, y, w, h }) => ({
      x: x * scale,
      y: y * scale,
      width: w * scale,
      height: h * scale,
    }));
  }

  global.FIELD_MAP_META = {
    maps: Object.entries(MAPS).map(([id, meta]) => ({ id, label: meta.label, earth: meta.earth })),
    seasons: SEASON_ORDER.slice(),
  };
  global.drawFieldMap = drawFieldMap;
  global.getFieldPlatforms = getFieldPlatforms;
})(window);
