import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SyncModule } from './sync/sync.module';
import { SyncQueueEntity } from './sync/sync-queue.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'sync.db',
      entities: [SyncQueueEntity],
      synchronize: true,
    }),
    SyncModule,
  ],
})
export class AppModule {}
