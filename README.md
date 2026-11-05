# StackLab

For the full architecture, endpoint reference, payload examples, setup instructions, and verification notes, see [`docs/STACKLAB.md`](docs/STACKLAB.md).

StackLab is a full-stack systems lab: one dashboard, many self-contained experiments. Each lab is designed to show a real UI, a real endpoint or service boundary, and the code that makes the request work.

## Prototype

The first visual prototype is dependency-free and lives in `dist/`. Open `dist/index.html` directly in a browser, or serve the folder with any static server. The real application shell is now in `apps/web` and uses Next.js App Router Server Components.

## Planned architecture

The repository now contains real starter projects: a Next.js Server Component shell, NestJS REST API, standalone GraphQL API, native Node stream lab, AI grounding API, and gRPC service with a protobuf contract. Payment and authentication endpoints are included in the NestJS API as sandbox learning endpoints.

## Running the real projects

Install dependencies from the repository root with `npm install`, then run `npm run dev` to start the Next.js web shell and NestJS API together. Use `npm run dev:all` to start every service, or run individual projects with the scripts in each app.

## Labs

GraphQL gateway, AI grounding, payments, gRPC services, authentication, Next.js server features, queues and workers, and Node.js internals are represented in the initial catalog.

## GraphQL CRUD lab

The GraphQL service exposes CRUD for `Lab` records at `http://localhost:4001/graphql`.
It has two TypeScript persistence implementations behind the same schema:

- SQL: SQLite using Node's built-in `node:sqlite` API (default), stored in `data/labs.sqlite`.
- NoSQL: a file-backed JSON document store, selected with `GRAPHQL_DB=nosql`, stored in `data/labs.json`.

Run the SQL version with `npm run dev:graphql`. Run the NoSQL version with `GRAPHQL_DB=nosql npm run dev:graphql` (PowerShell: `$env:GRAPHQL_DB='nosql'; npm run dev:graphql`).

The schema supports `labs`, `lab`, `createLab`, `updateLab`, and `deleteLab`.

## Spring Boot CRUD lab

Spring Boot is available at `http://localhost:4003` and exposes the same lab CRUD resource as the NestJS API. The project uses Java 21 and Maven, with source under `apps/spring-api`.

The dashboard entry is `Spring Boot API`, and `npm run dev:all` starts it when Maven is installed. Run it by itself with `npm run dev:spring`.

## CRUD framework comparison

The CRUD lab now includes the same `Lab` resource implemented in:

- NestJS on port 4000
- Spring Boot on port 4003
- Express on port 4004
- Fastify on port 4005
- FastAPI on port 4006
- Django REST Framework on port 4007
- ASP.NET Core on port 4008
- Go Fiber on port 4009

Each exposes `GET /labs`, `GET /labs/:id`, `POST /labs`, `PUT/PATCH /labs/:id`, and `DELETE /labs/:id`.
Node and Java projects are wired into `npm run dev:all`. The Python, .NET, and Go labs require their respective local runtimes and package installation first.

## Gemini AI lab

The AI service runs on port `4002` and provides concept-focused endpoints for generation, chat, temperature, system instructions, grounding, RAG, structured output, function calling, streaming, safety settings, and embeddings. Set `GEMINI_API_KEY` for live Gemini calls and optionally `GEMINI_MODEL` to choose the model. Without a key, the service runs in mock mode so the dashboard remains testable.

## NestJS CRUD lab

The NestJS API exposes REST CRUD for labs at `http://localhost:4000/labs`:
`GET /labs`, `GET /labs/:id`, `POST /labs`, `PUT/PATCH /labs/:id`, and `DELETE /labs/:id`.
The implementation is TypeScript and currently uses an in-memory service with seeded labs, so data resets when the API restarts.
