import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Benefit } from '../../benefits/entities/benefit.entity';

@Entity('benefit_balances')
export class BenefitBalance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  benefit_id: number;

  @Column()
  year: number;

  @Column({ type: 'float' })
  total_days: number;

  @Column({ type: 'float' })
  used_days: number;

  @Column({ type: 'float' })
  available_days: number;

  @ManyToOne(() => Benefit)
  @JoinColumn({ name: 'benefit_id' })
  benefit: Benefit;
}
