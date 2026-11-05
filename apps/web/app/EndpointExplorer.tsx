'use client';

import { useMemo, useState } from 'react';

export type ExplorerEndpoint = {
  method: string;
  path: string;
  name: string;
  description: string;
  body?: string;
  sample?: string;
};

type Props = { endpoints: ExplorerEndpoint[]; baseUrl?: string };

export default function EndpointExplorer({ endpoints, baseUrl = 'http://localhost:4000' }: Props) {
  const [selectedPath, setSelectedPath] = useState(endpoints[0]?.path ?? '');
  const [selectedMethod, setSelectedMethod] = useState(endpoints[0]?.method ?? 'GET');
  const [pathValue, setPathValue] = useState('');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState('Run a request to see the response.');
  const [status, setStatus] = useState('');
  const [running, setRunning] = useState(false);

  const selected = useMemo(() => endpoints.find(item => item.path === selectedPath && item.method === selectedMethod) ?? endpoints[0], [endpoints, selectedMethod, selectedPath]);
  const hasBody = selected?.method === 'POST' || selected?.method === 'PUT' || selected?.method === 'PATCH';

  function selectEndpoint(value: string) {
    const [method, ...pathParts] = value.split(' ');
    const endpoint = endpoints.find(item => item.method === method && item.path === pathParts.join(' '));
    if (!endpoint) return;
    setSelectedMethod(endpoint.method);
    setSelectedPath(endpoint.path);
    setBody(endpoint.body ?? '');
    setPathValue('');
    setResponse('Run a request to see the response.');
    setStatus('');
  }

  async function runRequest() {
    if (!selected) return;
    setRunning(true);
    setStatus('');
    try {
      const path = selected.path.replace(':id', encodeURIComponent(pathValue || 'graphql'));
      const init: RequestInit = { method: selected.method, headers: { 'Content-Type': 'application/json' } };
      if (hasBody && body.trim()) {
        JSON.parse(body);
        init.body = body;
      }
      const result = await fetch(`${baseUrl}${path}`, init);
      const text = await result.text();
      let formatted = text;
      try { formatted = JSON.stringify(JSON.parse(text), null, 2); } catch { /* preserve non-JSON responses */ }
      setStatus(`${result.status} ${result.statusText}`);
      setResponse(formatted || '(empty response)');
    } catch (error) {
      setStatus('Request failed');
      setResponse(error instanceof SyntaxError ? 'Request body is not valid JSON.' : String(error));
    } finally {
      setRunning(false);
    }
  }

  return <section className="endpoint-explorer" aria-label="Try NestJS API endpoint">
    <div className="explorer-heading"><div><p className="kicker">INTERACTIVE REQUEST BUILDER</p><h2>Try it</h2></div><span className="explorer-base">{baseUrl}</span></div>
    <div className="explorer-controls">
      <label>Endpoint<select value={`${selectedMethod} ${selectedPath}`} onChange={event => selectEndpoint(event.target.value)}>{endpoints.map(item => <option key={`${item.method}-${item.path}`} value={`${item.method} ${item.path}`}>{item.method} {item.path} — {item.name}</option>)}</select></label>
      {selected?.path.includes(':id') && <label>Path parameter <input value={pathValue} onChange={event => setPathValue(event.target.value)} placeholder="lab id or slug" /></label>}
    </div>
    {hasBody && <label className="explorer-body">JSON body<textarea value={body} onChange={event => setBody(event.target.value)} spellCheck={false} /></label>}
    <div className="sample-payload"><span>SAMPLE REQUEST</span><pre>{selected?.sample ?? (hasBody ? body : 'No request body')}</pre></div>
    <button className="run-request" onClick={runRequest} disabled={running}>{running ? 'Running…' : '▶ Run request'}</button>
    <div className="explorer-response"><div><span>RESPONSE</span><strong>{status}</strong></div><pre>{response}</pre></div>
  </section>;
}
