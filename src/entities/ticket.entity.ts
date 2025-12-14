import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  Index,
} from 'typeorm';

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  IN_REVIEW = 'in_review',
  CLOSED = 'closed',
  REJECTED = 'rejected',
}

export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

@Entity('tickets')
@Index(['status'])
@Index(['priority'])
@Index(['createdAt'])
@Index(['assigneeId'])
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  title: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.OPEN,
  })
  status: TicketStatus;

  @Column({
    type: 'enum',
    enum: TicketPriority,
    default: TicketPriority.MEDIUM,
  })
  priority: TicketPriority;

  @Column({
    type: 'uuid',
    nullable: true,
  })
  assigneeId: string;

  @Column({
    type: 'uuid',
  })
  creatorId: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  notes: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  dueDate: Date;

  @Column({
    type: 'int',
    default: 0,
  })
  estimatedHours: number;

  @Column({
    type: 'int',
    default: 0,
  })
  spentHours: number;

  @Column({
    type: 'int',
    default: 0,
  })
  progressPercentage: number;

  @ManyToMany('User', { nullable: true })
  @JoinTable({
    name: 'ticket_followers',
    joinColumn: { name: 'ticketId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  followers: any[];

  @Column({
    type: 'simple-array',
    nullable: true,
  })
  tags: string[];

  @Column({
    type: 'simple-array',
    nullable: true,
  })
  attachments: string[];

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  closedAt: Date;

  @Column({
    type: 'boolean',
    default: false,
  })
  isArchived: boolean;
}
