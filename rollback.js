import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SNAPSHOT_DIR = path.join(__dirname, 'snapshot_v2.4_production');
const WORKSPACE_DIR = __dirname;

console.log("==================================================");
console.log("🔄  PharmaShield AI - Fail-Safe Instant Rollback Engine");
console.log("==================================================");

if (!fs.existsSync(SNAPSHOT_DIR)) {
  console.error("❌  Error: Snapshot directory 'snapshot_v2.4_production' not found!");
  process.exit(1);
}

function copyFolderRecursiveSync(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const files = fs.readdirSync(source);
  files.forEach((file) => {
    const curSource = path.join(source, file);
    const curTarget = path.join(target, file);
    if (fs.lstatSync(curSource).isDirectory()) {
      copyFolderRecursiveSync(curSource, curTarget);
    } else {
      fs.copyFileSync(curSource, curTarget);
    }
  });
}

try {
  console.log("📦 Restoring 'src/' directory from snapshot...");
  copyFolderRecursiveSync(path.join(SNAPSHOT_DIR, 'src'), path.join(WORKSPACE_DIR, 'src'));

  console.log("⚙️  Restoring 'server/' directory from snapshot...");
  copyFolderRecursiveSync(path.join(SNAPSHOT_DIR, 'server'), path.join(WORKSPACE_DIR, 'server'));

  console.log("📄 Restoring 'package.json' and 'index.html'...");
  fs.copyFileSync(path.join(SNAPSHOT_DIR, 'package.json'), path.join(WORKSPACE_DIR, 'package.json'));
  fs.copyFileSync(path.join(SNAPSHOT_DIR, 'index.html'), path.join(WORKSPACE_DIR, 'index.html'));

  console.log("==================================================");
  console.log("✅  SUCCESS: System 100% rolled back to PharmaShield AI v2.4 Production state!");
  console.log("==================================================");
} catch (err) {
  console.error("❌ Rollback failed:", err);
  process.exit(1);
}
