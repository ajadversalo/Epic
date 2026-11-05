import { createServer } from 'node:http';
import { createYoga, createSchema } from 'graphql-yoga';

const yoga = createYoga({ schema: createSchema({
  typeDefs: 'type Lab { id: ID!, title: String!, status: String! } type Query { labs: [Lab!]! }',
  resolvers: { Query: { labs: () => [{ id: 'graphql', title: 'GraphQL gateway', status: 'in_progress' }, { id: 'grpc', title: 'gRPC services', status: 'ready' }] } }
}) });
createServer(yoga).listen(4001, () => console.log('GraphQL API at http://localhost:4001/graphql'));
