import Link from 'next/link';

type Api = {
  name: string;
  service: string;
  transport: string;
  method: string;
  endpoint: string;
  port: string;
  lab: string;
  source: string;
  status: 'Ready' | 'Configured';
};

const apis: Api[] = [
  { name: 'List labs', service: 'NestJS API', transport: 'REST', method: 'GET', endpoint: '/labs', port: '4000', lab: 'authentication', source: 'apps/nest-api/src/labs.controller.ts', status: 'Ready' },
  { name: 'Lab detail', service: 'NestJS API', transport: 'REST', method: 'GET', endpoint: '/labs/:slug', port: '4000', lab: 'authentication', source: 'apps/nest-api/src/labs.controller.ts', status: 'Ready' },
  { name: 'Login', service: 'NestJS API', transport: 'REST', method: 'POST', endpoint: '/auth/login', port: '4000', lab: 'authentication', source: 'apps/nest-api/src/auth.controller.ts', status: 'Ready' },
  { name: 'Create checkout', service: 'NestJS API', transport: 'REST', method: 'POST', endpoint: '/payments/checkout', port: '4000', lab: 'payments', source: 'apps/nest-api/src/payments.controller.ts', status: 'Ready' },
  { name: 'Lab queries', service: 'GraphQL API', transport: 'GraphQL', method: 'POST', endpoint: '/graphql', port: '4001', lab: 'graphql', source: 'apps/graphql-api/src/server.ts', status: 'Ready' },
  { name: 'Grounded answer', service: 'AI grounding', transport: 'REST', method: 'POST', endpoint: '/answer', port: '4002', lab: 'ai-grounding', source: 'apps/ai-grounding/src/server.ts', status: 'Ready' },
  { name: 'Health check', service: 'Node lab', transport: 'HTTP', method: 'GET', endpoint: '/health', port: '4010', lab: 'node', source: 'apps/node-lab/src/server.ts', status: 'Ready' },
  { name: 'Stream demo', service: 'Node lab', transport: 'HTTP stream', method: 'GET', endpoint: '/stream', port: '4010', lab: 'node', source: 'apps/node-lab/src/server.ts', status: 'Ready' },
  { name: 'Get profile', service: 'User service', transport: 'gRPC', method: 'RPC', endpoint: 'UserService.GetProfile', port: '50051', lab: 'grpc', source: 'apps/grpc-service/proto/user.proto', status: 'Configured' }
];

export default function ApisPage() {
  return <main className="shell api-page">
    <Link href="/">← Back to dashboard</Link>
    <div className="page-heading"><div><p className="kicker">STACK REGISTRY / API CATALOG</p><h1>All APIs</h1><p className="intro">Every service boundary in StackLab, mapped to the lab that teaches it.</p></div><div className="api-count"><strong>{apis.length}</strong><span>registered endpoints</span></div></div>
    <section className="api-table" aria-label="API catalog">
      <div className="api-row api-header"><span>API / SERVICE</span><span>TRANSPORT</span><span>METHOD</span><span>ENDPOINT</span><span>PORT</span><span>STATUS</span></div>
      {apis.map(api => <Link className="api-row" href={`/labs/${api.lab}`} key={`${api.service}-${api.endpoint}`}><span><strong>{api.name}</strong><small>{api.service}</small></span><span className="muted">{api.transport}</span><span className={`method ${api.method.toLowerCase().replace(' ', '-')}`}>{api.method}</span><code>{api.endpoint}</code><span className="muted">:{api.port}</span><span className="status">● {api.status}</span></Link>)}
    </section>
    <p className="api-note">Select an API to open its learning lab. Source paths point to the implementation you will build and extend.</p>
  </main>;
}
