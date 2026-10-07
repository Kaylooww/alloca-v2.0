import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Guard the actual theme tokens against future low-contrast palette changes.
const css = readFileSync(new URL('../styles/theme.css', import.meta.url), 'utf8');
const dark = css.match(/html\.dark\{([^}]+)\}/)[1];
const tokens = Object.fromEntries([...dark.matchAll(/(--[\w-]+):\s*(#[a-f\d]{6})/gi)].map(m => [m[1], m[2]]));
const luminance = hex => {
  const [r,g,b] = hex.slice(1).match(/../g).map(h => {
    const c = parseInt(h,16)/255;
    return c <= .04045 ? c/12.92 : ((c+.055)/1.055)**2.4;
  });
  return .2126*r+.7152*g+.0722*b;
};
const ratio = (a,b) => (Math.max(luminance(a),luminance(b))+.05)/(Math.min(luminance(a),luminance(b))+.05);
test('dark theme text and controls meet contrast targets', () => {
  for (const [fg,bg] of [
    ['--foreground','--background'],['--card-foreground','--card'],
    ['--muted-foreground','--card'],['--muted-foreground','--popover'],
    ['--primary-foreground','--primary'],['--accent-foreground','--accent'],
    ['--sidebar-foreground','--sidebar'],['--popover-foreground','--popover'],
    ['--destructive','--popover'],
  ]) assert.ok(ratio(tokens[fg],tokens[bg]) >= 4.5, `${fg} on ${bg}`);
  assert.ok(ratio(tokens['--ring'], tokens['--card']) >= 3);
  assert.ok(ratio(tokens['--chart-1'], tokens['--card']) >= 3);
});
