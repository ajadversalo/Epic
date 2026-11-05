import path from 'node:path';
import { fileURLToPath } from 'node:url';
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

const here = path.dirname(fileURLToPath(import.meta.url));
const definition = protoLoader.loadSync(path.join(here, '../proto/user.proto'));
const users = grpc.loadPackageDefinition(definition) as any;
const server = new grpc.Server();
server.addService(users.stacklab.users.UserService.service, { GetProfile(call: any, callback: any) { callback(null, { user_id: call.request.user_id, display_name: 'Alex Morgan', plan: 'builder' }); } });
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (_error, port) => { console.log(`gRPC UserService listening on ${port}`); server.start(); });
