import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Benefit } from '../../benefits/entities/benefit.entity';

@Entity('benefit_requests')
export class BenefitRequest {
  @PrimaryGeneratedColumn()
  id: number;

  // ======================
  // USER (solo ID por ahora)
  // ======================
  @Column()
  user_id: number;

  // ======================
  // BENEFIT
  // ======================
  @Column()
  benefit_id: number;

  @ManyToOne(() => Benefit)
  @JoinColumn({ name: 'benefit_id' })
  benefit: Benefit;

  // ======================
  // DATOS
  // ======================

  @Column('float')
  requested_days: number;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date', nullable: true })
  end_date: Date | null;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING',
  })
  status: 'PENDING' | 'APPROVED' | 'REJECTED';

  @Column({ nullable: true })
  comment: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  reviewed_at: Date | null;
}
