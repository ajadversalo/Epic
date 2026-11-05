import { createServer } from 'node:http';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { createYoga, createSchema } from 'graphql-yoga';
import { DatabaseSync } from 'node:sqlite';

type LabStatus = 'planned' | 'in_progress' | 'ready' | 'complete';
export type Lab = { id: string; title: string; description: string; status: LabStatus; createdAt: string; updatedAt: string };
export type CreateLabInput = Pick<Lab, 'title' | 'description' | 'status'>;
export type UpdateLabInput = Partial<CreateLabInput>;
export interface LabRepository { list(): Lab[]; get(id: string): Lab | null; create(input: CreateLabInput): Lab; update(id: string, input: UpdateLabInput): Lab | null; delete(id: string): boolean; }

const seedLabs: CreateLabInput[] = [
  { title: 'GraphQL gateway', description: 'Design a typed API layer with schemas and resolvers.', status: 'in_progress' },
  { title: 'gRPC services', description: 'Use protobuf contracts for service-to-service calls.', status: 'ready' },
];
const now = () => new Date().toISOString();
const createLab = (input: CreateLabInput): Lab => { const timestamp = now(); return { id: randomUUID(), ...input, createdAt: timestamp, updatedAt: timestamp }; };

export class JsonLabRepository implements LabRepository {
  private labs: Lab[];
  constructor(private readonly filePath = join(process.cwd(), 'data', 'labs.json')) {
    mkdirSync(dirname(filePath), { recursive: true });
    this.labs = existsSync(filePath) ? JSON.parse(readFileSync(filePath, 'utf8')) : seedLabs.map(createLab);
    this.persist();
  }
  list() { return [...this.labs]; }
  get(id: string) { return this.labs.find(lab => lab.id === id) ?? null; }
  create(input: CreateLabInput) { const lab = createLab(input); this.labs.push(lab); this.persist(); return lab; }
  update(id: string, input: UpdateLabInput) { const index = this.labs.findIndex(lab => lab.id === id); if (index === -1) return null; this.labs[index] = { ...this.labs[index], ...input, updatedAt: now() }; this.persist(); return this.labs[index]; }
  delete(id: string) { const before = this.labs.length; this.labs = this.labs.filter(lab => lab.id !== id); if (this.labs.length !== before) this.persist(); return this.labs.length !== before; }
  private persist() { writeFileSync(this.filePath, JSON.stringify(this.labs, null, 2)); }
}

export class SqliteLabRepository implements LabRepository {
  private readonly db: DatabaseSync;
  constructor(filePath = join(process.cwd(), 'data', 'labs.sqlite')) {
    mkdirSync(dirname(filePath), { recursive: true });
    this.db = new DatabaseSync(filePath);
    this.db.exec('CREATE TABLE IF NOT EXISTS labs (id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL, status TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)');
    const count = this.db.prepare('SELECT COUNT(*) AS count FROM labs').get() as { count: number };
    if (count.count === 0) for (const input of seedLabs) this.insert(createLab(input));
  }
  list() { return this.db.prepare('SELECT * FROM labs ORDER BY created_at').all().map(rowToLab); }
  get(id: string) { const row = this.db.prepare('SELECT * FROM labs WHERE id = ?').get(id); return row ? rowToLab(row) : null; }
  create(input: CreateLabInput) { const lab = createLab(input); this.insert(lab); return lab; }
  update(id: string, input: UpdateLabInput) { const current = this.get(id); if (!current) return null; const updated = { ...current, ...input, updatedAt: now() }; this.db.prepare('UPDATE labs SET title = ?, description = ?, status = ?, updated_at = ? WHERE id = ?').run(updated.title, updated.description, updated.status, updated.updatedAt, id); return updated; }
  delete(id: string) { return Number(this.db.prepare('DELETE FROM labs WHERE id = ?').run(id).changes) > 0; }
  private insert(lab: Lab) { this.db.prepare('INSERT INTO labs (id, title, description, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)').run(lab.id, lab.title, lab.description, lab.status, lab.createdAt, lab.updatedAt); }
}

function rowToLab(row: Record<string, unknown>): Lab { return { id: String(row.id), title: String(row.title), description: String(row.description), status: String(row.status) as LabStatus, createdAt: String(row.created_at), updatedAt: String(row.updated_at) }; }

const backend = process.env.GRAPHQL_DB ?? 'sql';
const repository: LabRepository = backend === 'nosql' ? new JsonLabRepository() : new SqliteLabRepository();
const typeDefs = /* GraphQL */ `
  enum LabStatus { planned in_progress ready complete }
  type Lab { id: ID!, title: String!, description: String!, status: LabStatus!, createdAt: String!, updatedAt: String! }
  input CreateLabInput { title: String!, description: String!, status: LabStatus = planned }
  input UpdateLabInput { title: String, description: String, status: LabStatus }
  type Query { labs: [Lab!]!, lab(id: ID!): Lab }
  type Mutation { createLab(input: CreateLabInput!): Lab!, updateLab(id: ID!, input: UpdateLabInput!): Lab, deleteLab(id: ID!): Boolean! }
`;
const yoga = createYoga({ cors: { origin: '*' }, schema: createSchema({ typeDefs, resolvers: {
  Query: { labs: () => repository.list(), lab: (_: unknown, { id }: { id: string }) => repository.get(id) },
  Mutation: {
    createLab: (_: unknown, { input }: { input: CreateLabInput }) => repository.create(input),
    updateLab: (_: unknown, { id, input }: { id: string; input: UpdateLabInput }) => repository.update(id, input),
    deleteLab: (_: unknown, { id }: { id: string }) => repository.delete(id),
  },
} }) });
createServer(yoga).listen(4001, () => console.log(`GraphQL API at http://localhost:4001/graphql (${backend} backend)`));
