import { createServer } from 'node:http';

const documents = [
  { id: 'grounding.md', text: 'Grounding retrieves relevant context before generation and returns citations with the answer.' },
  { id: 'architecture.md', text: 'StackLab uses separate labs so each system boundary can be observed independently.' }
];
const server = createServer(async (request, response) => {
  if (request.method !== 'POST' || request.url !== '/answer') { response.statusCode = 404; return response.end('Not found'); }
  let body = ''; for await (const chunk of request) body += chunk;
  const question = JSON.parse(body).question ?? '';
  const sources = documents.filter(doc => question.toLowerCase().split(' ').some((word: string) => doc.text.toLowerCase().includes(word)));
  response.setHeader('content-type', 'application/json');
  response.end(JSON.stringify({ answer: sources.length ? `Grounded answer for: ${question}` : 'I could not find supporting context.', sources: sources.map(source => source.id), retrievedChunks: sources.length }));
});
server.listen(4002, () => console.log('AI grounding API at http://localhost:4002/answer'));
