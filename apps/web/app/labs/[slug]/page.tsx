type Props = { params: Promise<{ slug: string }> };

const endpointMap: Record<string, string> = {
  graphql: 'http://localhost:4001/graphql',
  'ai-grounding': 'http://localhost:4002/answer',
  payments: 'http://localhost:4000/payments/checkout',
  grpc: 'rpc UserService.GetProfile',
  authentication: 'http://localhost:4000/auth/login'
};

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
