
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

// Version info for XEP-0092 and UI
import child_process from 'node:child_process';

function getGitHash() {
  try {
    return child_process.execSync('git rev-parse --short HEAD').toString().trim();
  } catch {
    return '';
  }
}

function getBuildTime() {
  return new Date().toISOString();
}
const workspaceRoot = fileURLToPath(new URL('.', import.meta.url));
const pkg = JSON.parse(fs.readFileSync(path.join(workspaceRoot, 'package.json')));
const APP_VERSION = pkg.version;
const APP_GIT_HASH = getGitHash();
const APP_BUILD = getBuildTime();
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
  define: {
    'import.meta.env.APP_VERSION': JSON.stringify(APP_VERSION),
    'import.meta.env.APP_GIT_HASH': JSON.stringify(APP_GIT_HASH),
    'import.meta.env.APP_BUILD': JSON.stringify(APP_BUILD),
  },
  server: {
    open: '/index.html',
  },
  build: {
    outDir: 'dist',
  },
});
