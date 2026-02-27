import fs from 'node:fs';
import path from 'node:path';

const workspaceRoot = process.cwd();
const extBuildRoot = path.join(workspaceRoot, 'node_modules', 'extjs-gpl', 'build');
const publicVendorRoot = path.join(workspaceRoot, 'public', 'vendor', 'extjs-gpl', 'build');

function copyIfExists(source, destination) {
  if (!fs.existsSync(source)) {
    throw new Error(`Missing expected ExtJS path: ${source}`);
  }
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.cpSync(source, destination, { recursive: true, force: true });
}

function main() {
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

  console.log('ExtJS assets synced to public/vendor/extjs-gpl/build');
}

main();
