import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SyncQueueEntity, SyncStatus } from './sync-queue.entity';
import { EvidenceStoredEvent } from '../../../libs/event-contracts/index';
import { basename, join } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class SyncService {
  constructor(
    @InjectRepository(SyncQueueEntity)
    private readonly queueRepo: Repository<SyncQueueEntity>,
  ) {}

  async enqueue(event: EvidenceStoredEvent) {
    const entity = this.queueRepo.create({
      inspectionId: event.inspectionId,
      type: event.evidenceType,
      filePath: event.filePath,
      status: SyncStatus.PENDING,
      attempts: 0,
    });

    const saved = await this.queueRepo.save(entity);
    await this.moveToOutbox(saved);
    
    return saved;
  }

  async moveToOutbox(entity: SyncQueueEntity) {
    const outboxDir = join('data', 'outbox', entity.type.toLowerCase());
    await fs.mkdir(outboxDir, { recursive: true });

    const fileName = basename(entity.filePath);
    const newPath = join(outboxDir, fileName);

    await fs.rename(entity.filePath, newPath);
    entity.filePath = newPath;
    entity.status = SyncStatus.READY;
    await this.queueRepo.save(entity);

    console.log(`Moved file ${fileName} to outbox`);
  }
  
  async processPending() {
    const pending = await this.queueRepo.find({ where: { status: SyncStatus.READY } });
    for (const entity of pending) {
      // await this.sendToGateway(entity);
      console.log(`Processing pending entity ID: ${entity.id}`);
    }
  }
}
