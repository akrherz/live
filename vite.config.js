import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const workspaceRoot = fileURLToPath(new URL('.', import.meta.url));
const extBuildRoot = path.join(
  workspaceRoot,
  'node_modules',
  '@avalos',
  'extjs-gpl',
  'build',
);
const publicVendorRoot = path.join(
  workspaceRoot,
  'public',
  'vendor',
  'avalos-extjs-gpl',
  'build',
);

function copyIfExists(source, destination) {
  if (!fs.existsSync(source)) {
    throw new Error(`Missing expected ExtJS path: ${source}`);
  }
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.cpSync(source, destination, { recursive: true, force: true });
}

function syncExtJsAssets() {
  if (!fs.existsSync(extBuildRoot)) {
    throw new Error('ExtJS build folder not found. Run `npm install` first.');
  }

  copyIfExists(
    path.join(extBuildRoot, 'ext-all.js'),
    path.join(publicVendorRoot, 'ext-all.js'),
  );

  copyIfExists(
    path.join(extBuildRoot, 'classic', 'theme-neptune'),
    path.join(publicVendorRoot, 'classic', 'theme-neptune'),
  );
}

function extJsAssetPlugin() {
  return {
    name: 'sync-extjs-assets',
    configureServer() {
      syncExtJsAssets();
    },
    buildStart() {
      syncExtJsAssets();
    },
  };
}

export default defineConfig({
  root: '.',
  base: './',
  plugins: [extJsAssetPlugin()],
  server: {
    open: '/index.html',
  },
  build: {
    outDir: 'dist',
  },
});
