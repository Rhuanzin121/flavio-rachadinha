import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';

const root = new URL('../dist/', import.meta.url);
const html = await readFile(new URL('index.html', root), 'utf8');
const assets = [...html.matchAll(/(?:src|href)=["']([^"']+\.(?:js|css)(?:\?[^"']*)?)["']/g)].map(m => m[1]);
assert.ok(assets.some(p => p.endsWith('.js')), 'O build precisa incluir JavaScript.');
assert.ok(assets.some(p => p.endsWith('.css')), 'O build precisa incluir CSS.');
for (const path of assets) {
  assert.ok(path.startsWith('./'), `O caminho precisa funcionar na subpasta do Pages: ${path}`);
  await access(new URL(path, root));
}
console.log(`GitHub Pages: ${assets.length} arquivos compilados encontrados com caminhos relativos.`);
