import Link from 'next/link';

const sections = [
  { number: '1', icon: 'o', tone: 'orange', title: 'AI', items: [
    ['ai-idea-brief', 'AI Idea to Build Brief', '']
  ]},
  { number: '2', icon: 'o', tone: 'purple', title: 'Architecture', items: [
    ['graphql', 'GraphQL gateway', '35 min'], ['grpc', 'gRPC services', '40 min'], ['queues', 'Queues & workers', '35 min'], ['events', 'Event-driven systems', '']
  ]},
  { number: '3', icon: 'o', tone: 'green', title: 'Backend', items: [
    ['nestjs', 'NestJS API', ''], ['express', 'Express API', ''], ['fastify', 'Fastify API', ''], ['fastapi', 'FastAPI', ''], ['django', 'Django REST Framework', ''], ['aspnet', 'ASP.NET Core', ''], ['fiber', 'Go Fiber', ''], ['spring-boot', 'Spring Boot API', ''], ['node', 'Node.js internals', '25 min'], ['authentication', 'Authentication', ''], ['payments', 'Payments', '45 min'], ['databases', 'Databases', '']
  ]},
  { number: '4', icon: 'o', tone: 'blue', title: 'Frontend', items: [
    ['nextjs', 'Next.js Server Components', ''], ['server-actions', 'Server Actions', ''], ['caching', 'Caching & revalidation', '']
  ]},
  { number: '5', icon: 'o', tone: 'pink', title: 'Quality & delivery', items: [
    ['testing', 'Testing', ''], ['observability', 'Observability', ''], ['deployment', 'Deployment', '']
  ]}
];

export default function HomePage() {
  const topicCount = sections.reduce((count, section) => count + section.items.length, 0);
  return <main className="shell">
    <header className="dashboard-header"><div><p className="kicker">STACKLAB / FULL-STACK SYSTEMS LAB</p><h1>Learning <em>outline.</em></h1><p className="intro">A navigable map of the systems behind modern products. Open a topic to enter its working lab.</p></div><Link className="api-link" href="/apis">Browse all APIs -&gt;</Link></header>
    <section className="outline" aria-label="StackLab learning outline">{sections.map(section => <details className="outline-section" open={section.number === '1'} key={section.number}><summary><span className="triangle">&gt;</span><span className="section-number">{section.number}.</span><span className={`section-icon ${section.tone}`}>{section.icon}</span><strong>{section.title}</strong></summary><div className="outline-items">{section.items.map(([slug, title, meta], index) => <Link className="outline-item" href={`/labs/${slug}`} key={slug}><span className="item-number">{section.number}.{index + 1}</span><span className="item-bullet">{index === 0 && section.number !== '3' ? '>' : '-'}</span><DocumentIcon /><span className="item-title">{title}</span>{meta && <span className="item-meta">({meta})</span>}</Link>)}</div></details>)}</section>
    <footer className="outline-footer"><span>{topicCount} topics across {sections.length} tracks</span><span>Select a topic to begin</span></footer>
  </main>;
}

function DocumentIcon() {
  return <svg className="doc-icon" viewBox="0 0 16 18" aria-hidden="true"><path d="M3 1.5h6.5L13 5v11.5H3z" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M9.5 1.5V5H13M5.5 8h5M5.5 11h5" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg>;
}
