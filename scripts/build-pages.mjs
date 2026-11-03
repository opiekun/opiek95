import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const project = fileURLToPath(new URL('../', import.meta.url));
const source = join(project, 'site');
const output = join(project, '.pages');
const base = process.env.PAGES_BASE_PATH ?? '/opiek95/';

if (base !== '/' && !/^\/[a-zA-Z0-9._-]+\/$/.test(base)) {
  throw new Error('PAGES_BASE_PATH must be / or look like /repository-name/');
}

const rootFiles = (await readdir(source, { withFileTypes: true }))
  .filter(entry => entry.isFile() && ['.css', '.js', '.html'].includes(extname(entry.name)))
  .map(entry => entry.name);
const paths = ['assets/', ...rootFiles, '#', 'journal/', 'preview/'];

async function buildDirectory(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const from = join(directory, entry.name);
    const to = join(output, relative(source, from));
    if (entry.isDirectory()) {
      await mkdir(to, { recursive: true });
      await buildDirectory(from);
    } else if (entry.isFile() && !['_headers', '_redirects'].includes(entry.name)) {
      if (['.html', '.js', '.css'].includes(extname(entry.name))) {
        let content = await readFile(from, 'utf8');
        for (const path of paths) content = content.replaceAll(`/${path}`, `${base}${path}`);
        if (entry.name === 'desktop.js') {
          content = content.replaceAll("location.pathname !== '/'", `location.pathname !== '${base}'`);
          content = content.replaceAll("location.pathname === '/'", `location.pathname === '${base}'`);
        }
        await writeFile(to, content);
      } else {
        await cp(from, to);
      }
    }
  }
}

if (relative(project, output) !== '.pages') throw new Error('Invalid Pages output directory');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await buildDirectory(source);

const index = await readFile(join(output, 'index.html'), 'utf8');
const redirects = await readFile(join(source, '_redirects'), 'utf8');
for (const match of redirects.matchAll(/^\/(\S+\/) \/index\.html 200$/gm)) {
  const destination = join(output, match[1], 'index.html');
  await mkdir(join(output, match[1]), { recursive: true });
  const isPreview = match[1].startsWith('preview/');
  const html = isPreview
    ? index.replace('<head>', '<head>\n  <meta name="robots" content="noindex, nofollow">')
    : index;
  await writeFile(destination, html);
}
await writeFile(join(output, '404.html'), index);
await writeFile(join(output, '.nojekyll'), '');
console.log(`Built GitHub Pages site in .pages for ${base}`);
