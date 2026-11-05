import { spawn } from 'node:child_process';

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const services = {
  web: `${npm} --workspace apps/web run dev`,
  api: `${npm} --workspace apps/nest-api run start:dev`,
  graphql: `${npm} --workspace apps/graphql-api run dev`,
  ai: `${npm} --workspace apps/ai-grounding run dev`,
  node: `${npm} --workspace apps/node-lab run dev`,
  grpc: `${npm} --workspace apps/grpc-service run dev`,
  spring: `${npm} --workspace apps/spring-api run dev`,
  express: `${npm} --workspace apps/express-api run dev`,
  fastify: `${npm} --workspace apps/fastify-api run dev`,
  fastapi: 'uvicorn main:app --app-dir apps/fastapi --reload --port 4006',
  django: 'python apps/django-rest/manage.py runserver 0.0.0.0:4007',
  aspnet: 'dotnet run --project apps/aspnet-api',
  fiber: 'go run ./apps/go-fiber'
};

const mode = process.argv[2] ?? 'core';
const names = mode === 'all' ? Object.keys(services) : ['web', 'api'];
const children = names.map(name => {
  console.log(`[stacklab] starting ${name}`);
  return spawn(services[name], { shell: true, stdio: 'inherit' });
});

const shutdown = () => children.forEach(child => child.kill());
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
children.forEach(child => child.on('exit', code => { if (code && code !== 0) process.exitCode = code; }));
