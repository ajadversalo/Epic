# StackLab

StackLab is a full-stack systems lab: one dashboard, many self-contained experiments. Each lab is designed to show a real UI, a real endpoint or service boundary, and the code that makes the request work.

## Prototype

The first visual prototype is dependency-free and lives in `dist/`. Open `dist/index.html` directly in a browser, or serve the folder with any static server. The real application shell is now in `apps/web` and uses Next.js App Router Server Components.

## Planned architecture

The repository now contains real starter projects: a Next.js Server Component shell, NestJS REST API, standalone GraphQL API, native Node stream lab, AI grounding API, and gRPC service with a protobuf contract. Payment and authentication endpoints are included in the NestJS API as sandbox learning endpoints.

## Running the real projects

Install dependencies from the repository root with `npm install`, then run `npm run dev` to start the Next.js web shell and NestJS API together. Use `npm run dev:all` to start every service, or run individual projects with the scripts in each app.

## Labs

GraphQL gateway, AI grounding, payments, gRPC services, authentication, Next.js server features, queues and workers, and Node.js internals are represented in the initial catalog.
