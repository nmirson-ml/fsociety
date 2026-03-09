import { readFileSync, writeFileSync } from 'fs';

const filePath = 'C:/Users/carls/Repos/fsociety/scripts/content-scheduled-tasks.txt';
let content = readFileSync(filePath, 'utf8');

// In a TypeScript template literal, backslash-letter sequences are escape sequences.
// We need to double all backslashes that appear in Windows file paths.
// Strategy: any backslash followed by a letter or digit that is NOT already preceded
// by another backslash needs to become a double backslash.
// Use a simple character-by-character scan.

let result = '';
for (let i = 0; i < content.length; i++) {
  const ch = content[i];
  if (ch === '\\') {
    // Check next character
    const next = content[i + 1];
    if (next && /[A-Za-z0-9]/.test(next)) {
      // This is a single backslash before a letter/digit — double it
      result += '\\\\';
    } else {
      result += ch;
    }
  } else {
    result += ch;
  }
}

const origBackslashes = (content.match(/\\[A-Za-z0-9]/g) || []).length;
const fixedBackslashes = (result.match(/\\\\[A-Za-z0-9]/g) || []).length;
console.log('Single backslash-alphanum sequences converted:', origBackslashes);
console.log('Resulting double backslash-alphanum sequences:', fixedBackslashes);

writeFileSync(filePath, result, 'utf8');
console.log('Done.');
