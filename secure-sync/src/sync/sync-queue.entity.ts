import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum SyncStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
  READY = 'READY',
}

@Entity('sync_queue')
export class SyncQueueEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  inspectionId: string;

  @Column()
  type: string; // VIDEO | AUDIO | TEXT

  @Column()
  filePath: string;

  @Column({
    type: 'text',
    default: SyncStatus.PENDING,
  })
  status: SyncStatus;

  @Column({ default: 0 })
  attempts: number;

  @CreateDateColumn()
  createdAt: Date;
}
