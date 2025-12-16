// Obfuscation.js
const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

// Directories we do NOT want to obfuscate but want to copy as-is:
const EXCLUDE_DIRS = [
  'node_modules',
  'scrcpy',
  'config'
];

// Files or folders we do NOT want to copy at all (only check at the root level):
const NOT_COPY_DIRS = [
  'dist',
  '.git',
  '.cursor',
  'logs',
  'src',
  'package-lock.json',
  'LICENSE.md',
  'boilerplate-hydra.code-workspace'
];

// Files we want to copy as-is (no obfuscation)
const EXCLUDE_FILES = [
  'wdio.conf.js'
];

// Also exclude the output directory so we don't copy it into itself
const OUTPUT_DIR = 'dist-obfuscated';

// The root of your project
const ROOT_DIR = __dirname;

/**
 * Obfuscate a single JS file and write to the output path.
 */
function obfuscateFile(srcPath, destPath) {
  try {
    const code = fs.readFileSync(srcPath, 'utf8');
    const obfuscatedResult = JavaScriptObfuscator.obfuscate(code, {
      compact: true,
      controlFlowFlattening: true,
      sourceMap: true,
      sourceMapMode: 'separate'
      // Additional options if desired:
      // deadCodeInjection: true,
      // stringArray: true,
      // stringArrayEncoding: ['base64']
    });
    fs.writeFileSync(destPath, obfuscatedResult.getObfuscatedCode() + `\n//# sourceMappingURL=${path.basename(destPath)}.map`, 'utf8');
    fs.writeFileSync(destPath + '.map', obfuscatedResult.getSourceMap(), 'utf8');
  } catch (err) {
    console.error(`Error obfuscating ${srcPath}:`, err);
    // Fallback: copy original if obfuscation fails
    copyFile(srcPath, destPath);
  }
}

/**
 * Copy a non-JS file (e.g., .html, images) as-is.
 */
function copyFile(srcPath, destPath) {
  fs.copyFileSync(srcPath, destPath);
}

/**
 * Process a JSON file. If it's the root package.json, remove the "build" field.
 */
function processJSONFile(srcPath, destPath) {
  const data = fs.readFileSync(srcPath, 'utf8');
  let json;
  try {
    json = JSON.parse(data);
  } catch (error) {
    console.error(`Error parsing ${srcPath}:`, error);
    // If parsing fails, copy the file as-is.
    copyFile(srcPath, destPath);
    return;
  }
  // Only process package.json if it's in the ROOT_DIR.
  if (
    path.basename(srcPath) === 'package.json' &&
    path.resolve(path.dirname(srcPath)) === path.resolve(ROOT_DIR) &&
    json.build
  ) {
    delete json.build;
  }
  fs.writeFileSync(destPath, JSON.stringify(json, null, 2), 'utf8');
}

/**
 * Recursively copy an entire directory as-is (no obfuscation).
 * In these directories, we simply copy all files without filtering for NOT_COPY_DIRS.
 */
function copyDirectory(srcDir, destDir) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  const items = fs.readdirSync(srcDir);
  items.forEach(item => {
    // Only skip the output directory here.
    if (item === OUTPUT_DIR) return;
    
    const srcPath = path.join(srcDir, item);
    const destPath = path.join(destDir, item);
    const stats = fs.statSync(srcPath);
    if (stats.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else if (stats.isFile()) {
      copyFile(srcPath, destPath);
    }
  });
}

/**
 * Recursively process directories:
 * - In the root folder, skip any file or directory that is in NOT_COPY_DIRS.
 * - Skip the output directory to avoid looping.
 * - If it's an EXCLUDED directory, copy it as-is.
 * - If it's a .js file, obfuscate it.
 * - If it's a .json file and it's the root package.json, process it; otherwise, copy it.
 * - Otherwise, copy as-is.
 */
function processDirectory(inputDir, outputDir) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const items = fs.readdirSync(inputDir);
  items.forEach(item => {
    // Skip the output directory to avoid looping
    if (item === OUTPUT_DIR) return;
    
    // Only check NOT_COPY_DIRS if we're in the ROOT_DIR.
    if (path.resolve(inputDir) === path.resolve(ROOT_DIR) && NOT_COPY_DIRS.includes(item)) {
      return;
    }
    
    const srcPath = path.join(inputDir, item);
    const destPath = path.join(outputDir, item);
    const stats = fs.statSync(srcPath);
    
    if (stats.isDirectory()) {
      if (EXCLUDE_DIRS.includes(item)) {
        // Copy the directory as-is (no obfuscation)
        copyDirectory(srcPath, destPath);
      } else {
        // Process directory recursively (obfuscate .js files inside)
        processDirectory(srcPath, destPath);
      }
    } else if (stats.isFile()) {
      if (EXCLUDE_FILES.includes(item)) {
        copyFile(srcPath, destPath);
      } else if (path.extname(item) === '.js') {
        obfuscateFile(srcPath, destPath);
      } else if (path.extname(item) === '.json') {
        // Process package.json only if it's in the root folder.
        if (item === 'package.json' && path.resolve(inputDir) === path.resolve(ROOT_DIR)) {
          processJSONFile(srcPath, destPath);
        } else {
          copyFile(srcPath, destPath);
        }
      } else {
        copyFile(srcPath, destPath);
      }
    }
  });
}

// Remove any existing 'dist-obfuscated' folder to start fresh
const fullOutputPath = path.join(ROOT_DIR, OUTPUT_DIR);
if (fs.existsSync(fullOutputPath)) {
  fs.rmSync(fullOutputPath, { recursive: true, force: true });
}

// Process the entire project root, skipping the output folder and NOT_COPY_DIRS items (only at root)
processDirectory(ROOT_DIR, fullOutputPath);

console.log(`Obfuscation complete! Check the "${OUTPUT_DIR}" folder.`);

