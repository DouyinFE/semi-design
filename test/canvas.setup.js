import { createRequire } from 'node:module';
import { afterAll, rs } from '@rstest/core';

// jest-canvas-mock reads jest both during module loading and when Canvas APIs run.
global.jest = rs;
afterAll(() => {
    delete global.jest;
    delete global.window.jest;
});

// Load only after the compatibility global exists (static imports run first).
const require = createRequire(import.meta.url);
const { default: getCanvasWindow } = require('jest-canvas-mock/lib/window.js');
const canvasWindow = getCanvasWindow({ document: window.document });

[
    'Path2D',
    'CanvasGradient',
    'CanvasPattern',
    'CanvasRenderingContext2D',
    'DOMMatrix',
    'ImageData',
    'TextMetrics',
    'ImageBitmap',
    'createImageBitmap',
].forEach(api => {
    global[api] = canvasWindow[api];
    window[api] = canvasWindow[api];
});
