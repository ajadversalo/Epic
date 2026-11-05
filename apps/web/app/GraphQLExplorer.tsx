'use client';

import { useState } from 'react';

type Operation = { name: string; description: string; query: string; variables: string };

const operations: Operation[] = [
  { name: 'List labs', description: 'Fetch every lab.', query: 'query ListLabs {\n  labs {\n    id\n    title\n    description\n    status\n    createdAt\n    updatedAt\n  }\n}', variables: '{}' },
  { name: 'Get lab', description: 'Fetch one lab by ID.', query: 'query GetLab($id: ID!) {\n  lab(id: $id) {\n    id\n    title\n    description\n    status\n  }\n}', variables: '{\n  "id": "graphql"\n}' },
  { name: 'Create lab', description: 'Create a new lab.', query: 'mutation CreateLab($input: CreateLabInput!) {\n  createLab(input: $input) {\n    id\n    title\n    status\n  }\n}', variables: '{\n  "input": {\n    "title": "New GraphQL lab",\n    "description": "A sample lab created through GraphQL",\n    "status": "planned"\n  }\n}' },
  { name: 'Update lab', description: 'Update an existing lab.', query: 'mutation UpdateLab($id: ID!, $input: UpdateLabInput!) {\n  updateLab(id: $id, input: $input) {\n    id\n    title\n    description\n    status\n    updatedAt\n  }\n}', variables: '{\n  "id": "graphql",\n  "input": {\n    "status": "complete"\n  }\n}' },
  { name: 'Delete lab', description: 'Delete an existing lab.', query: 'mutation DeleteLab($id: ID!) {\n  deleteLab(id: $id)\n}', variables: '{\n  "id": "graphql"\n}' },
];

export default function GraphQLExplorer() {
  const [selectedName, setSelectedName] = useState(operations[0].name);
  const selected = operations.find(operation => operation.name === selectedName) ?? operations[0];
  const [query, setQuery] = useState(selected.query);
  const [variables, setVariables] = useState(selected.variables);
  const [response, setResponse] = useState('Run an operation to see the response.');
  const [status, setStatus] = useState('');
  const [running, setRunning] = useState(false);

  function selectOperation(name: string) {
    const operation = operations.find(item => item.name === name);
    if (!operation) return;
    setSelectedName(name);
    setQuery(operation.query);
    setVariables(operation.variables);
    setResponse('Run an operation to see the response.');
    setStatus('');
  }

  async function runOperation() {
    setRunning(true);
    try {
      const parsedVariables = JSON.parse(variables || '{}');
      const result = await fetch('http://localhost:4001/graphql', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables: parsedVariables }),
      });
      const payload = await result.json();
      setStatus(`${result.status} ${result.statusText}`);
      setResponse(JSON.stringify(payload, null, 2));
    } catch (error) {
      setStatus('Request failed');
      setResponse(error instanceof SyntaxError ? 'Variables must be valid JSON.' : String(error));
    } finally {
      setRunning(false);
    }
  }

  return <section className="graphql-explorer" aria-label="Try GraphQL operation">
    <div className="explorer-heading"><div><p className="kicker">INTERACTIVE GRAPHQL CLIENT</p><h2>Try it</h2></div><span className="explorer-base">POST http://localhost:4001/graphql</span></div>
    <label className="graphql-select">Operation<select value={selectedName} onChange={event => selectOperation(event.target.value)}>{operations.map(operation => <option key={operation.name} value={operation.name}>{operation.name} — {operation.description}</option>)}</select></label>
    <div className="graphql-editors"><label>Query<textarea value={query} onChange={event => setQuery(event.target.value)} spellCheck={false} /></label><label>Variables<textarea value={variables} onChange={event => setVariables(event.target.value)} spellCheck={false} /></label></div>
    <button className="run-request" onClick={runOperation} disabled={running}>{running ? 'Running…' : '▶ Run operation'}</button>
    <div className="explorer-response"><div><span>RESPONSE</span><strong>{status}</strong></div><pre>{response}</pre></div>
  </section>;
}
