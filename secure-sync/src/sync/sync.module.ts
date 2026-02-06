import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SyncService } from './sync.service';
import { SyncQueueEntity } from './sync-queue.entity';
import { NatsListener } from 'src/nats.listener';
import { WorkerService } from './worker.service';

/* @Module({
  imports: [
    TypeOrmModule.forFeature([SyncQueueEntity]),
  ],
  providers: [SyncService, NatsListener],
  exports: [SyncService],
})
export class SyncModule {} */

@Module({
  imports: [TypeOrmModule.forFeature([SyncQueueEntity])],
  providers: [SyncService, NatsListener, WorkerService],
  exports: [SyncService],
})
export class SyncModule {}
