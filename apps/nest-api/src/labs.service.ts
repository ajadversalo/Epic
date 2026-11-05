import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

export type LabStatus = 'planned' | 'in_progress' | 'ready' | 'complete';

export type Lab = {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: LabStatus;
  endpoint: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateLabDto = {
  slug: string;
  title: string;
  description?: string;
  status?: LabStatus;
  endpoint?: string;
};

export type UpdateLabDto = Partial<CreateLabDto>;

@Injectable()
export class LabsService {
  private readonly labs = new Map<string, Lab>();

  constructor() {
    [
      ['graphql', 'GraphQL gateway', 'Design a typed API layer with schemas and resolvers.', 'in_progress'],
      ['grpc', 'gRPC services', 'Use protobuf contracts for service-to-service calls.', 'ready'],
      ['ai-grounding', 'AI grounding', 'Retrieve context before generating an answer.', 'ready'],
      ['payments', 'Payments', 'Explore a safe checkout boundary.', 'planned'],
      ['authentication', 'Authentication', 'Learn the login and token boundary.', 'planned'],
    ].forEach(([slug, title, description, status]) => this.seed(slug, title, description, status as LabStatus));
  }

  list() { return [...this.labs.values()]; }

  get(id: string) { return [...this.labs.values()].find(lab => lab.id === id || lab.slug === id) ?? this.notFound(id); }

  create(input: CreateLabDto) {
    if ([...this.labs.values()].some(lab => lab.slug === input.slug)) throw new ConflictException(`Lab '${input.slug}' already exists`);
    const timestamp = new Date().toISOString();
    const lab: Lab = {
      id: randomUUID(), slug: input.slug, title: input.title,
      description: input.description ?? '', status: input.status ?? 'planned',
      endpoint: input.endpoint ?? `/labs/${input.slug}`, createdAt: timestamp, updatedAt: timestamp,
    };
    this.labs.set(lab.id, lab);
    return lab;
  }

  update(id: string, input: UpdateLabDto) {
    const current = this.get(id);
    if (input.slug && input.slug !== current.slug && [...this.labs.values()].some(lab => lab.slug === input.slug)) throw new ConflictException(`Lab '${input.slug}' already exists`);
    const updated: Lab = { ...current, ...input, updatedAt: new Date().toISOString() };
    this.labs.delete(current.id);
    this.labs.set(updated.id, updated);
    return updated;
  }

  remove(id: string) {
    const lab = this.get(id);
    this.labs.delete(lab.id);
    return { deleted: true, id: lab.id };
  }

  private seed(slug: string, title: string, description: string, status: LabStatus) {
    const timestamp = new Date().toISOString();
    const lab: Lab = { id: slug, slug, title, description, status, endpoint: `/labs/${slug}`, createdAt: timestamp, updatedAt: timestamp };
    this.labs.set(lab.id, lab);
  }

  private notFound(id: string): never { throw new NotFoundException(`Lab '${id}' was not found`); }
}
