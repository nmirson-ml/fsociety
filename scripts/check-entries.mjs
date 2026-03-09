import { readFileSync } from 'fs';

const content = readFileSync('C:/Users/carls/Repos/fsociety/src/data/lessonContent.ts', 'utf8');
const lines = content.split('\n');
console.log('Total lines:', lines.length);

const keys = ['web-shells', 'web-app-attacks', 'scheduled-tasks'];
for (const key of keys) {
  let last = -1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line && line.match(new RegExp("^\\s+'" + key + "'\\s*:"))) {
      last = i;
    }
  }
  console.log('\n' + key + ': found at line ' + (last + 1));
  if (last >= 0) {
    for (let i = last; i < Math.min(last + 5, lines.length); i++) {
      console.log('  ' + (i + 1) + ': ' + lines[i].substring(0, 90));
    }
  }
}
