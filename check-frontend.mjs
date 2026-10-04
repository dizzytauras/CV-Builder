import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
  .map(m => m[1])
  .filter(s => s.trim());

if (!scripts.length) throw new Error('No inline application script found in index.html');
for (const [i, script] of scripts.entries()) {
  new vm.Script(script, { filename: `index-inline-${i + 1}.js` });
}
console.log(`Frontend syntax OK (${scripts.length} inline script${scripts.length === 1 ? '' : 's'}).`);
