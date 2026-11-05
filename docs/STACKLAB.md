# StackLab Documentation

StackLab is a full-stack systems lab. It presents one dashboard and a collection of small, independently runnable services so the same ideas can be compared across frameworks and protocols.

## Contents

- [Quick start](#quick-start)
- [Architecture](#architecture)
- [Dashboard](#dashboard)
- [CRUD framework lab](#crud-framework-lab)
- [GraphQL CRUD](#graphql-crud)
- [Gemini AI lab](#gemini-ai-lab)
- [Other services](#other-services)
- [Development commands](#development-commands)
- [Persistence and limitations](#persistence-and-limitations)
- [Testing and verification](#testing-and-verification)

## Quick start

Install the Node dependencies from the repository root:

```bash
npm install
```

Start the core dashboard and NestJS API:

```bash
npm run dev
```

Start every configured service:

```bash
npm run dev:all
```

The dashboard is available at `http://localhost:3000`.

`dev:all` starts all entries in `scripts/dev.mjs`. Some entries require a runtime outside Node.js; see [Runtime prerequisites](#runtime-prerequisites).

## Architecture

```text
Next.js dashboard :3000
        |
        +--> NestJS REST CRUD       :4000
        +--> Spring Boot CRUD       :4003
        +--> Express CRUD           :4004
        +--> Fastify CRUD           :4005
        +--> FastAPI CRUD           :4006
        +--> Django REST CRUD       :4007
        +--> ASP.NET Core CRUD      :4008
        +--> Go Fiber CRUD          :4009
        +--> GraphQL CRUD           :4001
        +--> Gemini AI lab          :4002
        +--> Node internals lab     :4010
        +--> gRPC user service      :50051
```

The dashboard uses Next.js App Router Server Components for the page shell and small Client Components for interactive request builders.

The REST framework implementations intentionally expose the same resource shape and operations. This makes framework differences visible without changing the business problem.

## Dashboard

The home page is a learning outline. Important entries include:

- `NestJS API`
- `Spring Boot API`
- `Express API`
- `Fastify API`
- `FastAPI`
- `Django REST Framework`
- `ASP.NET Core`
- `Go Fiber`
- `GraphQL gateway`
- AI concept labs such as `RAG`, `AI Grounding`, `AI Temperature`, and `Prompt Engineering`

The `All APIs` page lists service boundaries, methods, ports, and source paths.

Each CRUD lab contains a Swagger-style request tester. Choose an operation, edit the path parameter or JSON body, run the request, and inspect the status and formatted response.

The GraphQL lab contains a query and variables editor. The AI lab contains a concept selector and editable JSON payload editor.

## CRUD framework lab

Every CRUD implementation uses the `Lab` resource and supports:

```text
GET    /labs
GET    /labs/:id
POST   /labs
PUT    /labs/:id
PATCH  /labs/:id
DELETE /labs/:id
```

The `:id` value may be an ID or, where implemented, a seeded slug such as `graphql`, `spring-boot`, or `express`.

### Create payload

```json
{
  "slug": "new-lab",
  "title": "New lab",
  "description": "A new learning lab",
  "status": "planned",
  "endpoint": "/labs/new-lab"
}
```

### Update payload

`PATCH` accepts the fields being changed:

```json
{
  "status": "complete",
  "description": "Updated description"
}
```

### Delete response

```json
{
  "deleted": true,
  "id": "..."
}
```

### Framework locations

| Framework | Port | Project |
|---|---:|---|
| NestJS | 4000 | `apps/nest-api` |
| Spring Boot | 4003 | `apps/spring-api` |
| Express | 4004 | `apps/express-api` |
| Fastify | 4005 | `apps/fastify-api` |
| FastAPI | 4006 | `apps/fastapi` |
| Django REST Framework | 4007 | `apps/django-rest` |
| ASP.NET Core | 4008 | `apps/aspnet-api` |
| Go Fiber | 4009 | `apps/go-fiber` |

### Run individual CRUD services

```bash
npm run dev:api
npm run dev:spring
npm run dev:express
npm run dev:fastify
```

The non-Node services can be started directly:

```bash
uvicorn main:app --app-dir apps/fastapi --reload --port 4006
python apps/django-rest/manage.py runserver 0.0.0.0:4007
dotnet run --project apps/aspnet-api
go run ./apps/go-fiber
```

## GraphQL CRUD

The GraphQL service runs at `http://localhost:4001/graphql`.

### Schema

```graphql
enum LabStatus {
  planned
  in_progress
  ready
  complete
}

type Lab {
  id: ID!
  title: String!
  description: String!
  status: LabStatus!
  createdAt: String!
  updatedAt: String!
}

type Query {
  labs: [Lab!]!
  lab(id: ID!): Lab
}

type Mutation {
  createLab(input: CreateLabInput!): Lab!
  updateLab(id: ID!, input: UpdateLabInput!): Lab
  deleteLab(id: ID!): Boolean!
}
```

### Example query

```graphql
query ListLabs {
  labs {
    id
    title
    description
    status
    createdAt
    updatedAt
  }
}
```

### Example create mutation

```graphql
mutation CreateLab($input: CreateLabInput!) {
  createLab(input: $input) {
    id
    title
    status
  }
}
```

Variables:

```json
{
  "input": {
    "title": "New GraphQL lab",
    "description": "Created through GraphQL",
    "status": "planned"
  }
}
```

### SQL backend

The default backend uses Node's built-in `node:sqlite` API. It creates `data/labs.sqlite` and initializes the table on startup.

### NoSQL backend

Use the same GraphQL schema with the file-backed document repository:

PowerShell:

```powershell
$env:GRAPHQL_DB="nosql"
npm run dev:graphql
```

The document backend writes to `data/labs.json`. Runtime data is ignored by Git.

## Gemini AI lab

The AI service runs on port `4002`. It calls Gemini through REST when `GEMINI_API_KEY` is configured and uses deterministic mock responses without a key.

Configure it with:

PowerShell:

```powershell
$env:GEMINI_API_KEY="your-api-key"
$env:GEMINI_MODEL="gemini-2.5-flash"
npm run dev:all
```

The key is read only on the server and must not be placed in the browser or committed to the repository.

### AI endpoints

| Endpoint | Concept | Example payload |
|---|---|---|
| `POST /generate` | Basic generation | `{ "prompt": "Explain REST APIs." }` |
| `POST /chat` | Multi-turn history | `{ "messages": [{ "role": "user", "text": "What is GraphQL?" }] }` |
| `POST /temperature` | Temperature, top-P, top-K | `{ "prompt": "Name an app.", "temperature": 0.9 }` |
| `POST /system-instructions` | Model behavior | `{ "systemInstruction": "Be concise.", "prompt": "Explain middleware." }` |
| `POST /grounding` | Supplied context | `{ "question": "What is the policy?", "context": "..." }` |
| `POST /rag` | Retrieve context before generation | `{ "question": "How does StackLab isolate services?" }` |
| `POST /structured-output` | JSON schema output | `{ "prompt": "Extract fields.", "schema": { "type": "object" } }` |
| `POST /function-calling` | Tool declaration | `{ "prompt": "What is the weather?" }` |
| `POST /stream` | Incremental text | `{ "prompt": "Write a short story." }` |
| `POST /safety` | Safety thresholds | `{ "prompt": "Explain API security." }` |
| `POST /embeddings` | Vector representation | `{ "text": "GraphQL is typed." }` |
| `GET /health` | Provider/config status | No body |

`POST /answer` remains as a compatibility alias for the grounding endpoint.

### Gemini response behavior

For live calls, the service forwards the provider response so the dashboard can expose candidates, safety metadata, function calls, and usage metadata. For grounding and RAG, it adds a `sources` array and, for RAG, `retrievedChunks`.

In mock mode, responses contain `mock: true`, the selected model, and a deterministic text response. This makes UI development possible without spending quota.

## Other services

### Node internals lab

Runs on port `4010`:

- `GET /health` returns runtime information.
- `GET /stream` demonstrates a Node stream pipeline.

### gRPC service

Runs on port `50051`. The contract is in `apps/grpc-service/proto/user.proto`:

```protobuf
service UserService {
  rpc GetProfile (ProfileRequest) returns (UserProfile);
}
```

### NestJS authentication and payments demos

The NestJS API also contains:

- `POST /auth/login`
- `POST /payments/checkout`

These are sandbox learning endpoints, not production authentication or payment integrations.

## Development commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start web and NestJS API |
| `npm run dev:all` | Start all configured services |
| `npm run dev:web` | Start Next.js only |
| `npm run dev:api` | Start NestJS only |
| `npm run dev:graphql` | Start GraphQL only |
| `npm run dev:spring` | Start Spring Boot only |
| `npm run dev:express` | Start Express only |
| `npm run dev:fastify` | Start Fastify only |
| `npm run build --workspace apps/web` | Build the dashboard |
| `npm run build --workspace apps/graphql-api` | Compile GraphQL service |
| `npm run build --workspace apps/nest-api` | Compile NestJS service |
| `npm run build --workspace apps/ai-grounding` | Compile AI service |

Stop local services with `Ctrl+C`.

## Runtime prerequisites

Available in the original development environment:

- Node.js 24+
- npm
- Java 21

Additional runtimes required for all framework labs:

- Maven for Spring Boot
- Python and pip for FastAPI and Django REST Framework
- .NET 8 SDK for ASP.NET Core
- Go 1.22+ for Fiber

The framework projects include dependency manifests, but their external package installation is intentionally separate from the Node workspace.

## Persistence and limitations

The project is an educational lab, not a production deployment:

- NestJS and most framework comparison services use in-memory stores and reset on restart.
- GraphQL supports SQLite and a JSON document backend.
- The AI service uses mock mode when no Gemini key is present.
- Authentication returns a demo token and does not hash passwords or persist users.
- Payments returns a sandbox checkout object and does not contact a payment provider.
- CORS is open for local dashboard development.
- No service has production authentication, rate limiting, secrets management, or durable observability yet.

## Verification status

The following were compiled and exercised locally:

- Next.js dashboard build
- GraphQL TypeScript build
- NestJS TypeScript build
- AI TypeScript build
- Express TypeScript build and local list endpoint
- Fastify TypeScript build and local list endpoint
- GraphQL SQL and JSON CRUD paths
- NestJS CRUD create, update, and delete paths
- AI mock-mode generation, temperature, and RAG paths

Spring Boot, FastAPI, Django, ASP.NET Core, and Go Fiber have project scaffolds and dashboard integration, but require their respective runtimes to be installed before local compilation and smoke testing.
