import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import Barbecue from 'src/barbecue/entities/barbecue.entity';

@Entity({ name: 'participant' })
class Participant extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  name: string;

  @Column()
  contributionAmount: number;

  @Column()
  paid: boolean;

  @Column()
  barbecueUuid: string;

  @ManyToOne(() => Barbecue, (barbecue) => barbecue.participants)
  barbecue: Barbecue;

  @CreateDateColumn()
  createdAt?: Date;

  @CreateDateColumn()
  updatedAt?: Date;
}

export default Participant;
