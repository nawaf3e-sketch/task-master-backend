import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { User } from './user.entity';

export enum NotificationType {
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  TASK_UPDATED = 'TASK_UPDATED',
  TASK_COMPLETED = 'TASK_COMPLETED',
  TASK_OVERDUE = 'TASK_OVERDUE',
  COMMENT_ADDED = 'COMMENT_ADDED',
  MENTION = 'MENTION',
  REMINDER = 'REMINDER',
  TEAM_INVITE = 'TEAM_INVITE',
  PROJECT_UPDATE = 'PROJECT_UPDATE',
  SYSTEM = 'SYSTEM',
}

export enum NotificationChannel {
  IN_APP = 'IN_APP',
  EMAIL = 'EMAIL',
  BOTH = 'BOTH',
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
  FAILED = 'FAILED',
  BOUNCED = 'BOUNCED',
}

export enum EmailTrackingStatus {
  QUEUED = 'QUEUED',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  OPENED = 'OPENED',
  CLICKED = 'CLICKED',
  BOUNCED = 'BOUNCED',
  COMPLAINED = 'COMPLAINED',
  UNSUBSCRIBED = 'UNSUBSCRIBED',
  FAILED = 'FAILED',
}

@Entity('notifications')
@Index(['userId', 'createdAt'])
@Index(['userId', 'status'])
@Index(['type', 'createdAt'])
@Index(['emailTrackingStatus'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('uuid')
  userId: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.SYSTEM,
  })
  type: NotificationType;

  @Column({
    type: 'enum',
    enum: NotificationChannel,
    default: NotificationChannel.IN_APP,
  })
  channel: NotificationChannel;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.PENDING,
  })
  status: NotificationStatus;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: true })
  htmlContent: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'uuid', nullable: true })
  relatedEntityId: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  relatedEntityType: string;

  @Column({ type: 'uuid', nullable: true })
  triggeredById: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  triggeredByName: string;

  // Email tracking fields
  @Column({
    type: 'enum',
    enum: EmailTrackingStatus,
    default: EmailTrackingStatus.QUEUED,
    nullable: true,
  })
  emailTrackingStatus: EmailTrackingStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  messageId: string;

  @Column({ type: 'timestamp', nullable: true })
  emailSentAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  emailDeliveredAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  emailOpenedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  emailClickedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  emailBouncedAt: Date;

  @Column({ type: 'text', nullable: true })
  emailBounceReason: string;

  @Column({ type: 'integer', default: 0 })
  emailOpenCount: number;

  @Column({ type: 'integer', default: 0 })
  emailClickCount: number;

  @Column({ type: 'jsonb', nullable: true })
  emailTrackingData: {
    userAgent?: string;
    ipAddress?: string;
    linkClicks?: Array<{
      url: string;
      clickedAt: Date;
      ipAddress?: string;
      userAgent?: string;
    }>;
    bounceDetails?: {
      bounceType?: string;
      bounceSubType?: string;
      diagnosticCode?: string;
    };
  };

  // In-app notification fields
  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @Column({ type: 'timestamp', nullable: true })
  readAt: Date;

  @Column({ type: 'boolean', default: false })
  isArchived: boolean;

  @Column({ type: 'timestamp', nullable: true })
  archivedAt: Date;

  // Retry and error handling
  @Column({ type: 'integer', default: 0 })
  retryCount: number;

  @Column({ type: 'integer', default: 3 })
  maxRetries: number;

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @Column({ type: 'timestamp', nullable: true })
  nextRetryAt: Date;

  // Timestamps
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  setDefaults(): void {
    if (!this.emailTrackingStatus && this.channel !== NotificationChannel.IN_APP) {
      this.emailTrackingStatus = EmailTrackingStatus.QUEUED;
    }
  }

  // Helper methods
  markAsRead(): void {
    this.isRead = true;
    this.readAt = new Date();
    this.status = NotificationStatus.READ;
  }

  markAsArchived(): void {
    this.isArchived = true;
    this.archivedAt = new Date();
  }

  trackEmailOpen(ipAddress?: string, userAgent?: string): void {
    this.emailOpenedAt = new Date();
    this.emailOpenCount += 1;
    this.emailTrackingStatus = EmailTrackingStatus.OPENED;

    if (!this.emailTrackingData) {
      this.emailTrackingData = {};
    }

    this.emailTrackingData.ipAddress = ipAddress;
    this.emailTrackingData.userAgent = userAgent;
  }

  trackEmailClick(
    url: string,
    ipAddress?: string,
    userAgent?: string,
  ): void {
    this.emailClickedAt = new Date();
    this.emailClickCount += 1;
    this.emailTrackingStatus = EmailTrackingStatus.CLICKED;

    if (!this.emailTrackingData) {
      this.emailTrackingData = {};
    }

    if (!this.emailTrackingData.linkClicks) {
      this.emailTrackingData.linkClicks = [];
    }

    this.emailTrackingData.linkClicks.push({
      url,
      clickedAt: new Date(),
      ipAddress,
      userAgent,
    });
  }

  trackEmailBounce(
    bounceReason?: string,
    bounceType?: string,
    bounceSubType?: string,
    diagnosticCode?: string,
  ): void {
    this.emailBouncedAt = new Date();
    this.emailBounceReason = bounceReason;
    this.emailTrackingStatus = EmailTrackingStatus.BOUNCED;
    this.status = NotificationStatus.BOUNCED;

    if (!this.emailTrackingData) {
      this.emailTrackingData = {};
    }

    this.emailTrackingData.bounceDetails = {
      bounceType,
      bounceSubType,
      diagnosticCode,
    };
  }

  scheduleRetry(delayMs: number = 300000): void {
    if (this.retryCount < this.maxRetries) {
      this.retryCount += 1;
      this.nextRetryAt = new Date(Date.now() + delayMs);
      this.status = NotificationStatus.PENDING;
    } else {
      this.status = NotificationStatus.FAILED;
    }
  }

  markAsFailed(errorMessage?: string): void {
    this.status = NotificationStatus.FAILED;
    if (errorMessage) {
      this.errorMessage = errorMessage;
    }
  }

  getEmailTrackingMetrics(): {
    opened: boolean;
    clicked: boolean;
    openCount: number;
    clickCount: number;
    openedAt: Date | null;
    clickedAt: Date | null;
  } {
    return {
      opened: this.emailOpenCount > 0,
      clicked: this.emailClickCount > 0,
      openCount: this.emailOpenCount,
      clickCount: this.emailClickCount,
      openedAt: this.emailOpenedAt,
      clickedAt: this.emailClickedAt,
    };
  }
}
