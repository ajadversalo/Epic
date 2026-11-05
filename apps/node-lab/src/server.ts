import { createServer } from 'node:http';
import { Readable, Transform } from 'node:stream';

const server = createServer((request, response) => {
  response.setHeader('content-type', 'application/json');
  if (request.url === '/health') return response.end(JSON.stringify({ ok: true, runtime: process.version }));
  if (request.url === '/stream') {
    response.writeHead(200, { 'content-type': 'text/plain' });
    Readable.from(['Stack', 'Lab', 'Node']).pipe(new Transform({ transform(chunk, _encoding, callback) { callback(null, `${chunk} → `); } })).pipe(response);
    return;
  }
  response.statusCode = 404;
  response.end(JSON.stringify({ error: 'Route not found' }));
});
server.listen(4010, () => console.log('Node lab listening on http://localhost:4010'));
