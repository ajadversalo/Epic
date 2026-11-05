import EndpointExplorer from '../../EndpointExplorer';
import GraphQLExplorer from '../../GraphQLExplorer';
import AIExplorer from '../../AIExplorer';

type Props = { params: Promise<{ slug: string }> };
type Endpoint = { method: string; path: string; name: string; description: string; body?: string; sample?: string };

const endpointMap: Record<string, string> = {
  graphql: 'http://localhost:4001/graphql',
  'ai-grounding': 'http://localhost:4002/answer',
  'ai-temperature': 'http://localhost:4002/temperature',
  'prompt-engineering': 'http://localhost:4002/generate',
  rag: 'http://localhost:4002/rag',
  payments: 'http://localhost:4000/payments/checkout',
  grpc: 'rpc UserService.GetProfile',
  authentication: 'http://localhost:4000/auth/login',
  nestjs: 'http://localhost:4000/labs',
  'spring-boot': 'http://localhost:4003/labs',
  express: 'http://localhost:4004/labs',
  fastify: 'http://localhost:4005/labs',
  fastapi: 'http://localhost:4006/labs',
  django: 'http://localhost:4007/labs',
  aspnet: 'http://localhost:4008/labs',
  fiber: 'http://localhost:4009/labs',
};

const nestEndpoints: Endpoint[] = [
  { method: 'GET', path: '/labs', name: 'List labs', description: 'Return every lab record.', sample: 'GET /labs\n\nNo request body.' },
  { method: 'GET', path: '/labs/:id', name: 'Get lab', description: 'Return one lab by ID or slug.', sample: 'GET /labs/graphql\n\nPath parameter:\n{ "id": "graphql" }' },
  { method: 'POST', path: '/labs', name: 'Create lab', description: 'Create a new lab record.', body: '{\n  "slug": "new-lab",\n  "title": "New lab",\n  "description": "A new learning lab",\n  "status": "planned"\n}' },
  { method: 'PUT', path: '/labs/:id', name: 'Replace lab', description: 'Replace an existing lab record.', body: '{\n  "slug": "updated-lab",\n  "title": "Updated lab",\n  "description": "Updated description",\n  "status": "ready"\n}' },
  { method: 'PATCH', path: '/labs/:id', name: 'Update lab', description: 'Partially update an existing lab.', body: '{\n  "status": "complete"\n}' },
  { method: 'DELETE', path: '/labs/:id', name: 'Delete lab', description: 'Delete an existing lab record.', sample: 'DELETE /labs/graphql\n\nPath parameter:\n{ "id": "graphql" }\n\nNo request body.' },
  { method: 'POST', path: '/auth/login', name: 'Login', description: 'Return a demo access token.', body: '{\n  "email": "alex@example.com"\n}' },
  { method: 'POST', path: '/payments/checkout', name: 'Create checkout', description: 'Create a sandbox checkout session.', body: '{\n  "priceId": "price_demo",\n  "quantity": 1\n}' },
];

const springEndpoints = nestEndpoints.slice(0, 6).map(item => ({ ...item, description: `${item.description} Spring Boot implementation.` }));
const crudEndpoints = nestEndpoints.slice(0, 6);

export default async function LabPage({ params }: Props) {
  const { slug } = await params;
  const endpoint = endpointMap[slug] ?? 'Endpoint not registered yet';
  const service = await getServiceStatus(endpoint);
  return <main className="shell">
    <LinkBack />
    <p className="kicker">SERVER COMPONENT / {slug.toUpperCase()}</p>
    <h1>{slug.replaceAll('-', ' ')}</h1>
    <p className="intro">This page is an async Next.js Server Component. It owns the lab UI and connects to a separate local service.</p>
    <p className="service-status">Service status: <strong>{service.status}</strong>{service.detail && ` · ${service.detail}`}</p>
    {slug === 'nestjs' && <section className="endpoint-list" aria-label="NestJS API endpoints">
      <div className="section-heading"><div><p className="kicker">REST API / PORT 4000</p><h2>Available endpoints</h2></div><span className="status">● CRUD enabled</span></div>
      <div className="api-table">
        <div className="api-row api-header"><span>OPERATION</span><span>METHOD</span><span>PATH</span><span>DESCRIPTION</span></div>
        {nestEndpoints.map(item => <div className="api-row" key={`${item.method}-${item.path}`}><span><strong>{item.name}</strong><small>NestJS controller</small></span><span className={`method ${item.method.toLowerCase()}`}>{item.method}</span><code>{item.path}</code><span className="muted">{item.description}</span></div>)}
      </div>
      <EndpointExplorer endpoints={nestEndpoints} />
    </section>}
    {slug === 'spring-boot' && <section className="endpoint-list" aria-label="Spring Boot API endpoints">
      <div className="section-heading"><div><p className="kicker">SPRING BOOT / PORT 4003</p><h2>Available endpoints</h2></div><span className="status">● CRUD enabled</span></div>
      <div className="api-table"><div className="api-row api-header"><span>OPERATION</span><span>METHOD</span><span>PATH</span><span>DESCRIPTION</span></div>
        {springEndpoints.map(item => <div className="api-row" key={`${item.method}-${item.path}`}><span><strong>{item.name}</strong><small>Spring controller</small></span><span className={`method ${item.method.toLowerCase()}`}>{item.method}</span><code>{item.path}</code><span className="muted">{item.description}</span></div>)}
      </div>
      <EndpointExplorer endpoints={springEndpoints} baseUrl="http://localhost:4003" />
    </section>}
    {['express', 'fastify', 'fastapi', 'django', 'aspnet', 'fiber'].includes(slug) && <section className="endpoint-list" aria-label="CRUD API endpoints">
      <div className="section-heading"><div><p className="kicker">CRUD API / {slug.toUpperCase()}</p><h2>Available endpoints</h2></div><span className="status">● CRUD enabled</span></div>
      <div className="api-table"><div className="api-row api-header"><span>OPERATION</span><span>METHOD</span><span>PATH</span><span>DESCRIPTION</span></div>
        {crudEndpoints.map(item => <div className="api-row" key={`${item.method}-${item.path}`}><span><strong>{item.name}</strong><small>{slug} controller</small></span><span className={`method ${item.method.toLowerCase()}`}>{item.method}</span><code>{item.path}</code><span className="muted">{item.description}</span></div>)}
      </div>
      <EndpointExplorer endpoints={crudEndpoints} baseUrl={endpoint.replace('/labs', '')} />
    </section>}
    {slug === 'graphql' && <GraphQLExplorer />}
    {['ai-grounding', 'ai-temperature', 'prompt-engineering', 'rag', 'ai-curriculum', 'ai-engineering-roadmap', 'zod'].includes(slug) && <AIExplorer />}
    <section className="terminal"><div className="terminal-bar"><i /><i /><i /><span>{endpoint}</span></div><pre>{'// Server Component\nconst response = await fetch(\'' + endpoint + '\', {\n  method: \'POST\',\n  cache: \'no-store\'\n});\n\nconst result = await response.json();'}</pre></section>
  </main>;
}

function LinkBack() { return <a href="/">← Back to labs</a>; }

async function getServiceStatus(endpoint: string) {
  if (endpoint.startsWith('rpc ')) return { status: 'configured', detail: 'gRPC is not HTTP fetchable' };
  try {
    const response = await fetch(endpoint, { cache: 'no-store' });
    return { status: response.ok ? 'online' : 'reachable', detail: `HTTP ${response.status}` };
  } catch {
    return { status: 'offline', detail: 'start the matching service locally' };
  }
}
