import { Injectable } from '@nestjs/common';
import { basename } from 'path';
import { SyncQueueEntity, SyncStatus } from './sync-queue.entity';
import { Repository } from 'typeorm';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SyncService {
  constructor(
    @InjectRepository(SyncQueueEntity)
    private readonly queueRepo: Repository<SyncQueueEntity>
) {}

  async sendToGateway(entity: SyncQueueEntity) {
    const maxRetries = 5;
    let attempt = 0;
    let delay = 1000;

    while (attempt < maxRetries) {
      try {
        const res = await axios.post('http://localhost:3003/gateway/receive', {
          filePath: entity.filePath,
          inspectionId: entity.inspectionId,
          evidenceType: entity.type,
        }, { timeout: 3000 });

        if (res.data.status === 'DELIVERED') {
          entity.status = SyncStatus.SENT;
          entity.filePath = res.data.newPath;
          await this.queueRepo.save(entity);
          console.log(`[Secure Sync] File ${basename(entity.filePath)} delivered successfully.`);
          return true;
        } else {
          throw new Error(res.data.message || 'Gateway error');
        }
      } catch (err) {
        attempt++;
        console.warn(`[Secure Sync] Attempt ${attempt} failed. Retrying in ${delay}ms. Error: ${err.message}`);
        await new Promise(r => setTimeout(r, delay));
        delay *= 2;
      }
    }

    console.error(`[Secure Sync] Failed to deliver file ${basename(entity.filePath)} after ${maxRetries} attempts.`);
    return false;
  }

  async processPending() {
    const pending = await this.queueRepo.find({ where: { status: SyncStatus.PENDING } });
    for (const entity of pending) {
      await this.sendToGateway(entity);
    }
  }
}
