'use client';

import { useState } from 'react';

type Operation = { path: string; name: string; description: string; body: string };
const operations: Operation[] = [
  { path: '/idea-brief', name: 'Idea to build brief', description: 'Turn a plain idea into a typed product brief.', body: '{\n  "input": "A tiny app that turns a messy weekend plan into a fair schedule for friends."\n}' },
  { path: '/generate', name: 'Basic generation', description: 'Generate text from a prompt.', body: '{\n  "prompt": "Explain REST APIs in three sentences."\n}' },
  { path: '/chat', name: 'Chat history', description: 'Send multi-turn messages.', body: '{\n  "messages": [\n    { "role": "user", "text": "What is GraphQL?" },\n    { "role": "assistant", "text": "GraphQL is a typed API query language." },\n    { "role": "user", "text": "How does it compare to REST?" }\n  ]\n}' },
  { path: '/temperature', name: 'Temperature', description: 'Explore sampling controls.', body: '{\n  "prompt": "Name a creative task app.",\n  "temperature": 0.9,\n  "topP": 0.95,\n  "topK": 40\n}' },
  { path: '/system-instructions', name: 'System instructions', description: 'Control the model role.', body: '{\n  "systemInstruction": "You are a concise API tutor.",\n  "prompt": "Explain middleware."\n}' },
  { path: '/grounding', name: 'Grounding', description: 'Answer from supplied context.', body: '{\n  "question": "What is the refund policy?",\n  "context": "Customers can request a refund within 30 days."\n}' },
  { path: '/rag', name: 'RAG', description: 'Retrieve matching documents first.', body: '{\n  "question": "How does StackLab isolate services?"\n}' },
  { path: '/structured-output', name: 'Structured output', description: 'Return JSON matching a schema.', body: '{\n  "prompt": "Extract Alex Morgan and alex@example.com",\n  "schema": {\n    "type": "object",\n    "properties": { "name": { "type": "string" }, "email": { "type": "string" } },\n    "required": ["name", "email"]\n  }\n}' },
  { path: '/function-calling', name: 'Function calling', description: 'Let the model request a tool.', body: '{\n  "prompt": "What is the weather in Seattle?"\n}' },
  { path: '/stream', name: 'Streaming', description: 'Receive generated text incrementally.', body: '{\n  "prompt": "Write a short story about a helpful API."\n}' },
  { path: '/safety', name: 'Safety settings', description: 'Configure content blocking.', body: '{\n  "prompt": "Explain how to keep an API secure.",\n  "safetySettings": [{\n    "category": "HARM_CATEGORY_HARASSMENT",\n    "threshold": "BLOCK_MEDIUM_AND_ABOVE"\n  }]\n}' },
  { path: '/embeddings', name: 'Embeddings', description: 'Create a vector representation.', body: '{\n  "text": "GraphQL is a typed API query language.",\n  "taskType": "RETRIEVAL_DOCUMENT"\n}' },
];

export default function AIExplorer() {
  const [path, setPath] = useState(operations[0].path); const selected = operations.find(item => item.path === path) ?? operations[0];
  const [body, setBody] = useState(selected.body); const [status, setStatus] = useState(''); const [response, setResponse] = useState('Run a request to see the response.'); const [running, setRunning] = useState(false);
  function select(value: string) { const next=operations.find(item=>item.path===value); if (!next) return; setPath(value); setBody(next.body); setStatus(''); setResponse('Run a request to see the response.'); }
  async function run() { setRunning(true); try { const result=await fetch(`http://localhost:4002${path}`,{method:'POST',headers:{'Content-Type':'application/json'},body}); const text=await result.text(); let formatted=text; try { formatted=JSON.stringify(JSON.parse(text),null,2); } catch {} setStatus(`${result.status} ${result.statusText}`); setResponse(formatted || '(empty response)'); } catch(error) { setStatus('Request failed'); setResponse(String(error)); } finally { setRunning(false); } }
  return <section className="ai-explorer" aria-label="Try Gemini AI endpoint"><div className="explorer-heading"><div><p className="kicker">GEMINI API / INTERACTIVE CLIENT</p><h2>Try it</h2></div><span className="explorer-base">POST http://localhost:4002{path}</span></div><label className="graphql-select">Concept<select value={path} onChange={event=>select(event.target.value)}>{operations.map(item=><option key={item.path} value={item.path}>{item.name} — {item.description}</option>)}</select></label><label className="explorer-body">JSON payload<textarea value={body} onChange={event=>setBody(event.target.value)} spellCheck={false}/></label><button className="run-request" onClick={run} disabled={running}>{running?'Running…':'▶ Run request'}</button><div className="explorer-response"><div><span>RESPONSE</span><strong>{status}</strong></div><pre>{response}</pre></div></section>;
}
