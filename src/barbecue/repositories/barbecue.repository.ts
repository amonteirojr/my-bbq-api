import { EntityRepository, Repository } from 'typeorm';
import Barbecue from '../entities/barbecue.entity';

@EntityRepository(Barbecue)
export class BarbecueRepository extends Repository<Barbecue> {}
