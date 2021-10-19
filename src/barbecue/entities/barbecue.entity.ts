import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import Participant from 'src/participant/entities/participant.entity';
import User from 'src/user/entities/user.entity';

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

  @OneToMany(() => Participant, (participant) => participant.barbecue, {
    cascade: true,
  })
  participants: Participant[];

  @ManyToOne(() => User, (user) => user.barbecues)
  user: User;

  @Column()
  userUuid: string;

  @CreateDateColumn()
  createdAt?: Date;

  @CreateDateColumn()
  updatedAt?: Date;
}

export default Barbecue;
