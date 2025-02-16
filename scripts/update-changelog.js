import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const updateChangelog = () => {
  const changelogPath = path.join(process.cwd(), 'CHANGELOG.md');
  let changelog = fs.readFileSync(changelogPath, 'utf8');

  // Replace YYYY-MM-DD with current date
  const today = new Date().toISOString().split('T')[0];
  changelog = changelog.replace('YYYY-MM-DD', today);

  fs.writeFileSync(changelogPath, changelog);
};

updateChangelog();
