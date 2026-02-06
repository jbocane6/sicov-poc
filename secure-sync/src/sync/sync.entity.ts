import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('sync_queue')
export class SyncQueueEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  inspectionId: string;

  @Column()
  evidenceType: string;

  @Column()
  filePath: string;

  @Column({ default: 'PENDING' })
  status: string;

  @Column({ default: 0 })
  attempts: number;

  @CreateDateColumn()
  createdAt: Date;
}
