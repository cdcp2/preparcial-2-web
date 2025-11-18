import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Country } from '../../countries/entities/country.entity';

@Entity({ name: 'travel_plans' })
export class TravelPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'country_code', length: 3 })
  countryCode: string;

  @Column()
  title: string;

  @Column({ name: 'start_date', type: 'date' })
  startDate: string;

  @Column({ name: 'end_date', type: 'date' })
  endDate: string;

  @Column({ type: 'text', nullable: true })
  notes?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Country, { eager: true })
  @JoinColumn({ name: 'country_code', referencedColumnName: 'code' })
  country: Country;
}
