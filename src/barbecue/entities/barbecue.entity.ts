import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import Participant from 'src/participant/entities/participant.entity';

@Entity({ name: 'barbecue' })
class Barbecue extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  description?: string;

  @Column()
  notes?: string;

  @Column()
  suggestedValue?: number;

  @Column()
  suggestedBeerValue?: number;

  @OneToMany(() => Participant, (participant) => participant.barbecue)
  participants: Participant[];

  @CreateDateColumn()
  createdAt?: Date;

  @CreateDateColumn()
  updatedAt?: Date;
}

export default Barbecue;
