import { Injectable, OnModuleInit } from '@nestjs/common';
import { createNatsClient } from '../../libs/nats-client';
import { SyncService } from './sync/sync.service';

@Injectable()
export class NatsListener implements OnModuleInit {
  constructor(private readonly syncService: SyncService) {}

  async onModuleInit() {
    const nc = await createNatsClient();

    console.log('entrando...');
    
    nc.subscribe('evidence.*.stored', {
      callback: async (_, msg) => {
        const event = JSON.parse(msg.data.toString());
        await this.syncService.enqueue(event);
        msg.respond(
          new TextEncoder().encode(
            JSON.stringify({ status: 'RECEIVED' }),
          ),
        );
      },
    });

    console.log('Secure Sync listening to NATS...');
  }
}
