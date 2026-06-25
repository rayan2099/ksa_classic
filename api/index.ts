import app from '../server.js';

export default function handler(req: any, res: any) {
  const requestUrl = new URL(req.url || '/', 'http://localhost');
  const rawPath = req.query?.path ?? requestUrl.searchParams.get('path');
  const routePath = Array.isArray(rawPath) ? rawPath.join('/') : String(rawPath || '');

  req.url = routePath ? `/api/${routePath}` : '/api';
  delete req._parsedUrl;

  return app(req, res);
}
