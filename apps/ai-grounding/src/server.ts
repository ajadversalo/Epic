import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';

type Json = Record<string, unknown>;
const port = Number(process.env.PORT ?? 4002);
const model = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash';
const apiKey = process.env.GEMINI_API_KEY;
const documents = [
  { id: 'grounding.md', text: 'Grounding retrieves relevant context before generation and returns citations with the answer.' },
  { id: 'architecture.md', text: 'StackLab uses separate labs so each system boundary can be observed independently.' },
];

async function gemini(path: string, body: Json) {
  if (!apiKey) return { mock: true, model, text: mockText(body), candidates: [], usageMetadata: { promptTokenCount: 0, candidatesTokenCount: 0, totalTokenCount: 0 } };
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:${path}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey }, body: JSON.stringify(body),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(`Gemini ${response.status}: ${JSON.stringify(payload)}`);
  return payload;
}

function mockText(body: Json) { const contents = body.contents as Array<{ parts?: Array<{ text?: string }> }> | undefined; return `Mock Gemini response for: ${contents?.at(-1)?.parts?.[0]?.text ?? 'request'}`; }
function contents(text: string) { return [{ role: 'user', parts: [{ text }] }]; }
function textOf(payload: Json) { return ((payload.candidates as Array<Json> | undefined)?.[0]?.content as Json | undefined)?.parts && (((payload.candidates as Array<Json>)[0].content as Json).parts as Array<Json>)[0]?.text || payload.text || ''; }
function jsonResponse(response: ServerResponse, status: number, payload: unknown) { response.statusCode = status; response.setHeader('content-type', 'application/json'); response.end(JSON.stringify(payload)); }
async function readBody(request: IncomingMessage): Promise<Json> { let raw = ''; for await (const chunk of request) raw += chunk; return raw ? JSON.parse(raw) as Json : {}; }
function inputText(body: Json) { return typeof body.prompt === 'string' ? body.prompt : typeof body.text === 'string' ? body.text : ''; }
function generateBody(body: Json, extra: Json = {}): Json { return { contents: contents(inputText(body)), ...extra }; }

async function handle(path: string, body: Json, response: ServerResponse) {
  if (path === '/health') return jsonResponse(response, 200, { ok: true, provider: 'gemini', configured: Boolean(apiKey), model });
  if (path === '/generate') return jsonResponse(response, 200, await gemini('generateContent', generateBody(body, { generationConfig: body.generationConfig ?? {} })));
  if (path === '/temperature') return jsonResponse(response, 200, await gemini('generateContent', generateBody(body, { generationConfig: { temperature: body.temperature ?? 0.7, topP: body.topP, topK: body.topK } })));
  if (path === '/system-instructions') return jsonResponse(response, 200, await gemini('generateContent', generateBody(body, { systemInstruction: { parts: [{ text: String(body.systemInstruction ?? 'You are a helpful assistant.') }] } })));
  if (path === '/chat') {
    const messages = Array.isArray(body.messages) ? body.messages : [];
    return jsonResponse(response, 200, await gemini('generateContent', { contents: messages.map((message: any) => ({ role: message.role === 'assistant' ? 'model' : 'user', parts: [{ text: String(message.text) }] })) }));
  }
  if (path === '/grounding' || path === '/answer') {
    const context = String(body.context ?? '');
    const prompt = `Answer using only this context. Cite the context in your answer.\n\nContext:\n${context}\n\nQuestion: ${String(body.question ?? body.prompt ?? '')}`;
    const result = await gemini('generateContent', { contents: contents(prompt) });
    return jsonResponse(response, 200, { ...result, sources: body.sources ?? ['request.context'] });
  }
  if (path === '/rag') {
    const question = String(body.question ?? body.prompt ?? '');
    const words = question.toLowerCase().split(/\s+/).filter(Boolean);
    const matches = documents.filter(document => words.some(word => document.text.toLowerCase().includes(word)));
    const context = matches.map(document => `[${document.id}] ${document.text}`).join('\n');
    const result = await gemini('generateContent', { contents: contents(`Use these retrieved documents to answer the question and cite document IDs.\n${context}\nQuestion: ${question}`) });
    return jsonResponse(response, 200, { ...result, sources: matches.map(document => document.id), retrievedChunks: matches.length });
  }
  if (path === '/structured-output') {
    return jsonResponse(response, 200, await gemini('generateContent', generateBody(body, { generationConfig: { responseMimeType: 'application/json', responseSchema: body.schema ?? { type: 'object' } } })));
  }
  if (path === '/function-calling') {
    const tools = [{ functionDeclarations: [{ name: 'get_weather', description: 'Get the current weather for a city.', parameters: { type: 'OBJECT', properties: { city: { type: 'STRING' } }, required: ['city'] } }] }];
    return jsonResponse(response, 200, await gemini('generateContent', generateBody(body, { tools })));
  }
  if (path === '/safety') {
    const safetySettings = body.safetySettings ?? [{ category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }];
    return jsonResponse(response, 200, await gemini('generateContent', generateBody(body, { safetySettings })));
  }
  if (path === '/embeddings') {
    return jsonResponse(response, 200, await gemini('embedContent', { content: { parts: [{ text: inputText(body) }] }, taskType: body.taskType ?? 'RETRIEVAL_DOCUMENT' }));
  }
  if (path === '/stream') {
    response.statusCode = 200; response.setHeader('content-type', 'text/plain; charset=utf-8');
    if (!apiKey) return response.end(mockText(generateBody(body)));
    const upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey }, body: JSON.stringify(generateBody(body)) });
    if (!upstream.ok || !upstream.body) return response.end(await upstream.text());
    const reader = upstream.body.getReader(); const decoder = new TextDecoder();
    while (true) { const chunk = await reader.read(); if (chunk.done) break; const raw = decoder.decode(chunk.value); for (const line of raw.split('\n')) if (line.startsWith('data: ')) { try { const data = JSON.parse(line.slice(6)); response.write(textOf(data)); } catch { /* wait for the next event */ } } }
    return response.end();
  }
  return jsonResponse(response, 404, { error: 'Route not found' });
}

const server = createServer(async (request, response) => {
  response.setHeader('access-control-allow-origin', '*'); response.setHeader('access-control-allow-headers', 'content-type');
  if (request.method === 'OPTIONS') return response.end();
  if (request.method !== 'POST' && request.url !== '/health') return jsonResponse(response, 405, { error: 'Use POST' });
  try { await handle(request.url ?? '/', request.method === 'POST' ? await readBody(request) : {}, response); } catch (error) { jsonResponse(response, 500, { error: error instanceof Error ? error.message : 'Request failed' }); }
});
server.listen(port, () => console.log(`AI Gemini API at http://localhost:${port} (${apiKey ? 'live' : 'mock'} mode)`));
