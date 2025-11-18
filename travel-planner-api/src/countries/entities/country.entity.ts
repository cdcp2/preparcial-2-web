import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'countries' })
export class Country {
  @PrimaryColumn({ length: 3 })
  code: string;

  @Column()
  name: string;

  @Column()
  region: string;

  @Column()
  subregion: string;

  @Column()
  capital: string;

  @Column({ type: 'integer', default: 0 })
  population: number;

  @Column({ name: 'flag_url' })
  flagUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
