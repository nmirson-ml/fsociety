/**
 * Replace three lesson entries in lessonContent.ts using line-based extraction.
 * Content is loaded from separate plain-text files to avoid template literal issues.
 */
import { readFileSync, writeFileSync } from 'fs';

const filePath = 'C:/Users/carls/Repos/fsociety/src/data/lessonContent.ts';
let content = readFileSync(filePath, 'utf8');

function findLastIdx(text, key) {
  const ls = text.split('\n');
  let last = -1;
  ls.forEach((l, i) => {
    if (l.match(new RegExp("^\\s+'" + key + "'\\s*:"))) last = i;
  });
  return last;
}

function findEndIdx(text, startIdx) {
  const ls = text.split('\n');
  let depth = 0;
  for (let i = startIdx; i < ls.length; i++) {
    for (const ch of ls[i]) {
      if (ch === '{') depth++;
      else if (ch === '}') { depth--; if (depth === 0) return i; }
    }
  }
  return -1;
}

function replaceEntry(currentContent, startLine0, endLine0, newEntry) {
  const currentLines = currentContent.split('\n');
  const before = currentLines.slice(0, startLine0);
  const after = currentLines.slice(endLine0 + 1);
  return [...before, ...newEntry.split('\n'), ...after].join('\n');
}

const wsContent   = readFileSync('C:/Users/carls/Repos/fsociety/scripts/content-web-shells.txt', 'utf8');
const waaContent  = readFileSync('C:/Users/carls/Repos/fsociety/scripts/content-web-app-attacks.txt', 'utf8');
const stContent   = readFileSync('C:/Users/carls/Repos/fsociety/scripts/content-scheduled-tasks.txt', 'utf8');

// web-shells
let s = findLastIdx(content, 'web-shells');
let e = findEndIdx(content, s);
console.log('Replacing web-shells: lines', s+1, '-', e+1);
content = replaceEntry(content, s, e, wsContent);

// web-app-attacks
s = findLastIdx(content, 'web-app-attacks');
e = findEndIdx(content, s);
console.log('Replacing web-app-attacks: lines', s+1, '-', e+1);
content = replaceEntry(content, s, e, waaContent);

// scheduled-tasks
s = findLastIdx(content, 'scheduled-tasks');
e = findEndIdx(content, s);
console.log('Replacing scheduled-tasks: lines', s+1, '-', e+1);
content = replaceEntry(content, s, e, stContent);

writeFileSync(filePath, content, 'utf8');
console.log('Done. Lines:', content.split('\n').length, 'Chars:', content.length);
