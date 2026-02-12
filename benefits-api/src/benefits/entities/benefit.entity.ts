import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('benefits')
export class Benefit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'float' })
  max_days_per_year: number;

  @Column({ type: 'boolean' })
  allows_range: boolean;
}
