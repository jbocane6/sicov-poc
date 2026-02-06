import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { Repository } from 'typeorm';
import { SyncQueueEntity, SyncStatus } from './sync-queue.entity';

@Injectable()
export class OutboxWorker {
  constructor(private readonly queueRepo: Repository<SyncQueueEntity>) {}

  @Cron('*/5 * * * * *')
  async processOutbox() {
    const pending = await this.queueRepo.find({ where: { status: SyncStatus.READY } });

    for (const entity of pending) {
      try {
        console.log(`Sending ${entity.filePath} to gateway...`);
        await axios.post('http://localhost:3004/secure-sync', {
          inspectionId: entity.inspectionId,
          type: entity.type,
          filePath: entity.filePath,
        }, { timeout: 10000 });

        entity.status = SyncStatus.SENT;
        await this.queueRepo.save(entity);
        console.log(`Sent ${entity.filePath} successfully`);
      } catch (err) {
        entity.attempts += 1;
        console.log(`Failed to send ${entity.filePath}, attempt ${entity.attempts}`);
        await this.queueRepo.save(entity);
      }
    }
  }
}