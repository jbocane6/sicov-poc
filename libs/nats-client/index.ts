import { connect, NatsConnection } from 'nats';

export async function createNatsClient(): Promise<NatsConnection> {
  return connect({
    servers: 'nats://localhost:4222',
  });
}
