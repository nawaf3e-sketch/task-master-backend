import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

export enum EventType {
  USER_LOGIN = 'USER_LOGIN',
  USER_LOGOUT = 'USER_LOGOUT',
  TASK_CREATED = 'TASK_CREATED',
  TASK_UPDATED = 'TASK_UPDATED',
  TASK_DELETED = 'TASK_DELETED',
  TASK_COMPLETED = 'TASK_COMPLETED',
  PROJECT_CREATED = 'PROJECT_CREATED',
  PROJECT_UPDATED = 'PROJECT_UPDATED',
  PROJECT_DELETED = 'PROJECT_DELETED',
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
  ERROR = 'ERROR',
  INFO = 'INFO',
  WARNING = 'WARNING',
}

@Entity('logs')
@Index(['eventType'])
@Index(['userId'])
@Index(['timestamp'])
@Index(['eventType', 'timestamp'])
export class Log {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: EventType,
    nullable: false,
  })
  eventType: EventType;

  @Column({
    type: 'uuid',
    nullable: true,
  })
  userId: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  entityType: string | null;

  @Column({
    type: 'uuid',
    nullable: true,
  })
  entityId: string | null;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string | null;

  @Column({
    type: 'json',
    nullable: true,
  })
  metadata: Record<string, any> | null;

  @Column({
    type: 'varchar',
    length: 45,
    nullable: true,
  })
  ipAddress: string | null;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  userAgent: string | null;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  timestamp: Date;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'ACTIVE',
  })
  status: string;
}
