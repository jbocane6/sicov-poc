import { Injectable, OnModuleInit } from '@nestjs/common';
import { SyncService } from './sync.service';

@Injectable()
export class WorkerService implements OnModuleInit {
  constructor(private readonly syncService: SyncService) {}

  onModuleInit() {
    setInterval(() => {
      console.log('verificando procesos pendientes');
      this.syncService.processPending();
    }, 10000);
  }
}
