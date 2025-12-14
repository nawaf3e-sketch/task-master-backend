import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

/**
 * Visitor Entity
 * Manages visitor check-in and check-out tracking
 */
@Entity('visitors')
@Index(['email'])
@Index(['phoneNumber'])
@Index(['checkInTime'])
@Index(['visitorStatus'])
export class Visitor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  phoneNumber: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  company?: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  purpose?: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  hostName?: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  hostEmail?: string;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  checkInTime: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  checkOutTime?: Date;

  @Column({
    type: 'enum',
    enum: ['CHECKED_IN', 'CHECKED_OUT', 'NO_SHOW'],
    default: 'CHECKED_IN',
  })
  visitorStatus: 'CHECKED_IN' | 'CHECKED_OUT' | 'NO_SHOW';

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  idType?: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  idNumber?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  notes?: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  badgeNumber?: string;

  @Column({
    type: 'simple-array',
    nullable: true,
  })
  accessAreas?: string[];

  @Column({
    type: 'boolean',
    default: false,
  })
  nda: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  isApproved: boolean;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  approvedBy?: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({
    type: 'varchar',
    length: 36,
    nullable: true,
  })
  createdBy?: string;

  @Column({
    type: 'varchar',
    length: 36,
    nullable: true,
  })
  updatedBy?: string;

  /**
   * Calculate visit duration in minutes
   */
  getVisitDuration(): number | null {
    if (!this.checkOutTime) {
      return null;
    }
    const durationMs =
      this.checkOutTime.getTime() - this.checkInTime.getTime();
    return Math.floor(durationMs / 60000);
  }

  /**
   * Check if visitor is currently checked in
   */
  isCheckedIn(): boolean {
    return this.visitorStatus === 'CHECKED_IN';
  }

  /**
   * Get full visitor name
   */
  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
