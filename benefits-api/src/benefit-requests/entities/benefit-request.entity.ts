import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Benefit } from '../../benefits/entities/benefit.entity';

export enum BenefitRequestStatus {
  PENDIENTE = 'PENDIENTE',
  APROBADO = 'APROBADO',
  RECHAZADO = 'RECHAZADO',
  CANCELADO = 'CANCELADO',
}

@Entity('benefit_requests')
export class BenefitRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  benefit_id: number;

  @ManyToOne(() => Benefit)
  @JoinColumn({ name: 'benefit_id' })
  benefit: Benefit;

  @Column('float')
  requested_days: number;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date', nullable: true })
  end_date: Date | null;

  @Column({
    type: 'enum',
    enum: BenefitRequestStatus,
    default: BenefitRequestStatus.PENDIENTE,
  })
  status: BenefitRequestStatus;

  @Column({ nullable: true })
  comment: string | null;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  reviewed_at: Date | null;
}
