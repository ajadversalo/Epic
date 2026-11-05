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
  { name: 'List labs', service: 'NestJS API', transport: 'REST', method: 'GET', endpoint: '/labs', port: '4000', lab: 'nestjs', source: 'apps/nest-api/src/labs.controller.ts', status: 'Ready' },
  { name: 'Lab detail', service: 'NestJS API', transport: 'REST', method: 'GET', endpoint: '/labs/:slug', port: '4000', lab: 'nestjs', source: 'apps/nest-api/src/labs.controller.ts', status: 'Ready' },
  { name: 'Create lab', service: 'NestJS API', transport: 'REST', method: 'POST', endpoint: '/labs', port: '4000', lab: 'nestjs', source: 'apps/nest-api/src/labs.controller.ts', status: 'Ready' },
  { name: 'Replace lab', service: 'NestJS API', transport: 'REST', method: 'PUT', endpoint: '/labs/:id', port: '4000', lab: 'nestjs', source: 'apps/nest-api/src/labs.controller.ts', status: 'Ready' },
  { name: 'Update lab', service: 'NestJS API', transport: 'REST', method: 'PATCH', endpoint: '/labs/:id', port: '4000', lab: 'nestjs', source: 'apps/nest-api/src/labs.controller.ts', status: 'Ready' },
  { name: 'Delete lab', service: 'NestJS API', transport: 'REST', method: 'DELETE', endpoint: '/labs/:id', port: '4000', lab: 'nestjs', source: 'apps/nest-api/src/labs.controller.ts', status: 'Ready' },
  { name: 'Spring Boot CRUD', service: 'Spring Boot API', transport: 'REST', method: 'CRUD', endpoint: '/labs', port: '4003', lab: 'spring-boot', source: 'apps/spring-api/src/main/java/com/stacklab/api/LabController.java', status: 'Configured' },
  { name: 'Express CRUD', service: 'Express API', transport: 'REST', method: 'CRUD', endpoint: '/labs', port: '4004', lab: 'express', source: 'apps/express-api/src/server.ts', status: 'Configured' },
  { name: 'Fastify CRUD', service: 'Fastify API', transport: 'REST', method: 'CRUD', endpoint: '/labs', port: '4005', lab: 'fastify', source: 'apps/fastify-api/src/server.ts', status: 'Configured' },
  { name: 'FastAPI CRUD', service: 'FastAPI', transport: 'REST', method: 'CRUD', endpoint: '/labs', port: '4006', lab: 'fastapi', source: 'apps/fastapi/main.py', status: 'Configured' },
  { name: 'Django REST CRUD', service: 'Django REST Framework', transport: 'REST', method: 'CRUD', endpoint: '/labs', port: '4007', lab: 'django', source: 'apps/django-rest/labs/views.py', status: 'Configured' },
  { name: 'ASP.NET Core CRUD', service: 'ASP.NET Core', transport: 'REST', method: 'CRUD', endpoint: '/labs', port: '4008', lab: 'aspnet', source: 'apps/aspnet-api/Program.cs', status: 'Configured' },
  { name: 'Go Fiber CRUD', service: 'Go Fiber', transport: 'REST', method: 'CRUD', endpoint: '/labs', port: '4009', lab: 'fiber', source: 'apps/go-fiber/main.go', status: 'Configured' },
  { name: 'Login', service: 'NestJS API', transport: 'REST', method: 'POST', endpoint: '/auth/login', port: '4000', lab: 'authentication', source: 'apps/nest-api/src/auth.controller.ts', status: 'Ready' },
  { name: 'Create checkout', service: 'NestJS API', transport: 'REST', method: 'POST', endpoint: '/payments/checkout', port: '4000', lab: 'payments', source: 'apps/nest-api/src/payments.controller.ts', status: 'Ready' },
  { name: 'Lab queries', service: 'GraphQL API', transport: 'GraphQL', method: 'POST', endpoint: '/graphql', port: '4001', lab: 'graphql', source: 'apps/graphql-api/src/server.ts', status: 'Ready' },
  { name: 'Grounded answer', service: 'AI grounding', transport: 'REST', method: 'POST', endpoint: '/answer', port: '4002', lab: 'ai-grounding', source: 'apps/ai-grounding/src/server.ts', status: 'Ready' },
  { name: 'Basic generation', service: 'Gemini AI', transport: 'REST', method: 'POST', endpoint: '/generate', port: '4002', lab: 'prompt-engineering', source: 'apps/ai-grounding/src/server.ts', status: 'Configured' },
  { name: 'Chat history', service: 'Gemini AI', transport: 'REST', method: 'POST', endpoint: '/chat', port: '4002', lab: 'prompt-engineering', source: 'apps/ai-grounding/src/server.ts', status: 'Configured' },
  { name: 'Temperature', service: 'Gemini AI', transport: 'REST', method: 'POST', endpoint: '/temperature', port: '4002', lab: 'ai-temperature', source: 'apps/ai-grounding/src/server.ts', status: 'Configured' },
  { name: 'System instructions', service: 'Gemini AI', transport: 'REST', method: 'POST', endpoint: '/system-instructions', port: '4002', lab: 'prompt-engineering', source: 'apps/ai-grounding/src/server.ts', status: 'Configured' },
  { name: 'RAG retrieval', service: 'Gemini AI', transport: 'REST', method: 'POST', endpoint: '/rag', port: '4002', lab: 'rag', source: 'apps/ai-grounding/src/server.ts', status: 'Configured' },
  { name: 'Structured output', service: 'Gemini AI', transport: 'REST', method: 'POST', endpoint: '/structured-output', port: '4002', lab: 'prompt-engineering', source: 'apps/ai-grounding/src/server.ts', status: 'Configured' },
  { name: 'Function calling', service: 'Gemini AI', transport: 'REST', method: 'POST', endpoint: '/function-calling', port: '4002', lab: 'prompt-engineering', source: 'apps/ai-grounding/src/server.ts', status: 'Configured' },
  { name: 'Streaming', service: 'Gemini AI', transport: 'REST stream', method: 'POST', endpoint: '/stream', port: '4002', lab: 'prompt-engineering', source: 'apps/ai-grounding/src/server.ts', status: 'Configured' },
  { name: 'Safety settings', service: 'Gemini AI', transport: 'REST', method: 'POST', endpoint: '/safety', port: '4002', lab: 'prompt-engineering', source: 'apps/ai-grounding/src/server.ts', status: 'Configured' },
  { name: 'Embeddings', service: 'Gemini AI', transport: 'REST', method: 'POST', endpoint: '/embeddings', port: '4002', lab: 'rag', source: 'apps/ai-grounding/src/server.ts', status: 'Configured' },
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
