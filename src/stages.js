// =====================================================================
// STAGE ROSTER  (5 slots)
// =====================================================================
// To add your stage art:
//   1. Copy assets/stages/stage_template.js and add your draw functions
//   2. Import them below and set them on the matching entry
//
// Example (uncomment when your file is ready):
// import {
//   drawBackground as forestBg,
//   drawFloor      as forestFloor,
//   drawForeground as forestFg,
// } from '../assets/stages/forest.js';
// =====================================================================

export const STAGES = [

  {
    id:             'stage_1',
    name:           'Stage 1',
    previewColor:   '#1a0a2e',  // thumbnail bg colour in stage select
    drawBackground: null,       // function(ctx, width, height)
    drawFloor:      null,       // function(ctx, width, height, floorY, stageLeft, stageRight)
    drawForeground: null,       // function(ctx, width, height)  — drawn above players; can be null
  },
  {
    id:             'stage_2',
    name:           'Stage 2',
    previewColor:   '#0a1a2e',
    drawBackground: null,
    drawFloor:      null,
    drawForeground: null,
  },
  {
    id:             'stage_3',
    name:           'Stage 3',
    previewColor:   '#0a2e0a',
    drawBackground: null,
    drawFloor:      null,
    drawForeground: null,
  },
  {
    id:             'stage_4',
    name:           'Stage 4',
    previewColor:   '#2e1a0a',
    drawBackground: null,
    drawFloor:      null,
    drawForeground: null,
  },
  {
    id:             'stage_5',
    name:           'Stage 5',
    previewColor:   '#2e0a1a',
    drawBackground: null,
    drawFloor:      null,
    drawForeground: null,
  },

];
