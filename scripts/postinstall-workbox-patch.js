/**
 * Applies a fix to workbox-build's bundle (used by workbox-webpack-plugin) to avoid
 * "Unfinished hook action (terser) renderChunk" with Next 15 + PWA.
 * The service worker is still bundled; it is just not minified.
 */
const path = require('path');
const fs = require('fs');

const targetPath = path.join(
  __dirname,
  '..',
  'node_modules',
  'workbox-webpack-plugin',
  'node_modules',
  'workbox-build',
  'build',
  'lib',
  'bundle.js'
);

const OLD = "    if (mode === 'production') {";
const NEW = "    // Skip Terser to avoid renderChunk race with Next 15 + PWA (see postinstall-workbox-patch.js)\n    if (false && mode === 'production') {";

try {
  if (fs.existsSync(targetPath)) {
    let content = fs.readFileSync(targetPath, 'utf8');
    if (content.includes(OLD) && !content.includes('false && mode ===')) {
      content = content.replace(OLD, NEW);
      fs.writeFileSync(targetPath, content);
      console.log('postinstall-workbox-patch: applied workbox-build Terser fix');
    }
  }
} catch (e) {
  console.warn('postinstall-workbox-patch:', e.message);
}
