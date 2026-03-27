const MAP_LABELS =
  globalThis.FIELD_MAP_META && Array.isArray(globalThis.FIELD_MAP_META.maps)
    ? globalThis.FIELD_MAP_META.maps.reduce((acc, entry) => {
        acc[entry.id] = entry.label;
        return acc;
      }, {})
    : {};

function getMapLabel(id, fallback) {
  return MAP_LABELS[id] || fallback;
}

function createMapStage({ id, fallbackName, previewColor, season }) {
  return {
    id,
    mapType: id,
    name: getMapLabel(id, fallbackName),
    previewColor,
    drawBackground: (ctx, width, height) => {
      if (typeof globalThis.drawFieldMap === "function") {
        globalThis.drawFieldMap(ctx, width, height, {
          mapType: id,
          season,
          time: Date.now(),
        });
        return;
      }
      ctx.fillStyle = previewColor;
      ctx.fillRect(0, 0, width, height);
    },
    // Prevent fallback floor from fight.js because map.js already paints the ground.
    drawFloor: () => {},
    drawForeground: null,
  };
}

export const STAGES = [
  createMapStage({
    id: "meadow",
    fallbackName: "Painterly Meadow",
    previewColor: "#78c86f",
    season: "spring",
  }),
  createMapStage({
    id: "forest",
    fallbackName: "Autumn Forest",
    previewColor: "#6aa052",
    season: "autumn",
  }),
  createMapStage({
    id: "underwater",
    fallbackName: "Underwater Garden",
    previewColor: "#34a7c6",
    season: "summer",
  }),
  createMapStage({
    id: "castle",
    fallbackName: "Night At The Castle",
    previewColor: "#334567",
    season: "winter",
  }),
  createMapStage({
    id: "space",
    fallbackName: "Starfield Drift",
    previewColor: "#24194f",
    season: "summer",
  }),
];
