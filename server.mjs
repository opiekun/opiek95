import { createServer } from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import { dirname, extname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { networkInterfaces } from 'node:os';

const root = await realpath(resolve(dirname(fileURLToPath(import.meta.url)), 'site'));
const host = process.env.HOST ?? '127.0.0.1';
const port = Number(process.env.PORT ?? 4173);
if (!Number.isInteger(port) || port < 0 || port > 65535) {
  console.error('PORT must be an integer between 0 and 65535.');
  process.exit(1);
}

const publicFiles = new Set(['/index.html', '/styles.css', '/app.js', '/music-player.js', '/desktop.css', '/desktop-media.css', '/desktop.js', '/portfolio-apps.js', '/desktop-utilities.css', '/desktop-utilities.js']);
const contentTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.pdf', 'application/pdf'],
  ['.wav', 'audio/wav'],
  ['.woff2', 'font/woff2'],
  ['.woff', 'font/woff'],
  ['.ttf', 'font/ttf'],
  ['.otf', 'font/otf'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.gif', 'image/gif'],
  ['.webp', 'image/webp'],
  ['.avif', 'image/avif'],
  ['.ico', 'image/x-icon']
]);
const assetTypes = new Set([...contentTypes.keys()].filter(type => type !== '.html' && type !== '.js'));

function respond(request, response, code, message, headers = {}) {
  const body = `${message}\n`;
  response.writeHead(code, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    ...headers
  });
  response.end(request.method === 'HEAD' ? undefined : body);
}

const server = createServer(async (request, response) => {
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('Cache-Control', 'no-cache');
  response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; font-src 'self'; img-src 'self' data:; media-src 'self' https://radio.plaza.one; connect-src 'self' https://api.plaza.one; frame-src 'none'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'");

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    respond(request, response, 405, 'Method not allowed', { Allow: 'GET, HEAD' });
    return;
  }

  let pathname;
  try {
    // Decode the original request target before any URL normalization can hide traversal.
    pathname = decodeURIComponent((request.url ?? '/').split('?')[0]);
  } catch {
    respond(request, response, 400, 'Bad request');
    return;
  }
  if (!pathname.startsWith('/') || /[\u0000-\u001f\u007f]/.test(pathname)) {
    respond(request, response, 400, 'Bad request');
    return;
  }
  if (pathname.includes('\\') || pathname.split('/').some(part => part === '..' || part === '.')) {
    respond(request, response, 403, 'Forbidden');
    return;
  }
  if (pathname === '/preview/article') {
    respond(request, response, 308, 'Redirecting', { Location: '/preview/article/' });
    return;
  }
  if (pathname === '/journal/first-entry') {
    respond(request, response, 308, 'Redirecting', { Location: '/journal/first-entry/' });
    return;
  }
  if (pathname === '/journal/first-entry/') pathname = '/index.html';
  if (pathname === '/preview/article/') {
    response.setHeader('X-Robots-Tag', 'noindex, nofollow');
    pathname = '/index.html';
  }
  if (pathname === '/') pathname = '/index.html';
  const extension = extname(pathname).toLowerCase();
  const isPublicAsset = pathname.startsWith('/assets/')
    && assetTypes.has(extension)
    && !pathname.split('/').some(part => part.startsWith('.'));
  if (!publicFiles.has(pathname) && !isPublicAsset) {
    respond(request, response, 404, 'Not found');
    return;
  }

  try {
    const file = await realpath(resolve(root, `.${pathname}`));
    const localPath = relative(root, file);
    if (localPath === '..' || localPath.startsWith(`..${sep}`) || isAbsolute(localPath)) {
      respond(request, response, 403, 'Forbidden');
      return;
    }
    const info = await stat(file);
    if (!info.isFile()) {
      respond(request, response, 404, 'Not found');
      return;
    }
    const data = request.method === 'HEAD' ? null : await readFile(file);
    response.writeHead(200, {
      'Content-Type': contentTypes.get(extension),
      'Content-Length': data ? data.byteLength : info.size
    });
    response.end(data);
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'ENOTDIR' || error.code === 'EACCES') {
      respond(request, response, 404, 'Not found');
    } else {
      console.error('Unable to serve a public file:', error.code ?? error.message);
      respond(request, response, 500, 'Internal server error');
    }
  }
});

server.on('error', error => {
  console.error(`Unable to start local preview: ${error.message}`);
  process.exitCode = 1;
});
server.listen(port, host, () => {
  const activePort = server.address().port;
  console.log(`opiekun local preview: http://127.0.0.1:${activePort}`);
  if (host === '0.0.0.0') {
    for (const addresses of Object.values(networkInterfaces())) {
      for (const address of addresses ?? []) {
        if (address.family === 'IPv4' && !address.internal && !address.address.startsWith('169.254.')) {
          console.log(`LAN preview: http://${address.address}:${activePort}`);
        }
      }
    }
    console.log('LAN mode: anyone on your local network can view this site and its public resume.');
  }
  console.log('Press Ctrl+C to stop.');
});
