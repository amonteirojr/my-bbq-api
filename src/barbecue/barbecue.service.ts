import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import Participant from 'src/participant/entities/participant.entity';
import { ParticipantService } from 'src/participant/participant.service';
import { CodeErrors } from 'src/shared/code-errors.enum';
import { CreateBarbecueDTO } from './dto/create-barbecue.dto';
import Barbecue from './entities/barbecue.entity';
import { BarbecueRepository } from './repositories/barbecue.repository';

interface BarbecueResponse {
  barbecueUuid: string;
  date: Date;
  description: string;
  totalAmount: number;
  suggestedValue: number;
  suggestedBeerValue: number;
  totalParticipants: number;
  notes: string;
}

interface BarbecueDetailsResponse {
  barbecueUuid: string;
  date: Date;
  description: string;
  notes: string;
  totalAmount: number;
  suggestedValue: number;
  suggestedBeerValue: number;
  totalParticipants: number;
  participants: Participant[];
}

@Injectable()
export class BarbecueService {
  private readonly logger = new Logger(BarbecueService.name);

  constructor(
    private readonly barbecueRepository: BarbecueRepository,
    private readonly participantService: ParticipantService,
  ) {}

  async createBarbecue(
    createBarbecueDTO: CreateBarbecueDTO,
  ): Promise<Barbecue> {
    try {
      const barbecue = this.barbecueRepository.create(createBarbecueDTO);

      const savedBarbecue = await this.barbecueRepository.save(barbecue);

      const createdParticipants =
        await this.participantService.createBarbecueParticipants(
          createBarbecueDTO.participants,
          savedBarbecue.uuid,
        );

      barbecue.participants = createdParticipants;

      return barbecue;
    } catch (err) {
      this.logger.error(`Error on create a new barbecue: ${err}`);

      throw new InternalServerErrorException({
        message: 'fail to create a barbecue',
        code: CodeErrors.FAIL_TO_CREATE_BARBECUE,
      });
    }
  }

  async getAllBarbecues(): Promise<BarbecueResponse[]> {
    try {
      const barbecues = await this.barbecueRepository.find({
        relations: ['participants'],
      });

      const response = barbecues.map((barbecue) => {
        let totalAmount = 0;

        barbecue.participants.forEach((participant) => {
          if (participant.paid) {
            totalAmount += parseInt(
              participant.contributionAmount.toString(),
              10,
            );
          }
        });

        return {
          barbecueUuid: barbecue.uuid,
          date: barbecue.date,
          description: barbecue.description,
          notes: barbecue.notes,
          totalParticipants: barbecue.participants.length,
          totalAmount,
          suggestedBeerValue: barbecue.suggestedBeerValue,
          suggestedValue: barbecue.suggestedValue,
        };
      });

      return response;
    } catch (err) {
      this.logger.error(`Error on get all barbecues: ${err}`);

      throw new InternalServerErrorException({
        message: 'fail to get all barbecues',
        code: CodeErrors.FAIL_TO_GET_ALL_BARBECUES,
      });
    }
  }

  async getBarbecue(uuid: string): Promise<BarbecueDetailsResponse> {
    try {
      const barbecue = await this.barbecueRepository.findOne({
        where: { uuid },
        relations: ['participants'],
      });

      let totalAmount = 0;

      barbecue.participants.forEach((data) => {
        if (data.paid) {
          totalAmount += parseInt(data.contributionAmount.toString(), 10);
        }
      });

      const response: BarbecueDetailsResponse = {
        description: barbecue.description,
        notes: barbecue.notes,
        suggestedBeerValue: barbecue.suggestedBeerValue,
        suggestedValue: barbecue.suggestedValue,
        date: barbecue.date,
        barbecueUuid: barbecue.uuid,
        totalAmount,
        totalParticipants: barbecue.participants.length,
        participants: barbecue.participants,
      };

      return response;
    } catch (err) {
      this.logger.error(`Error on get barbecue: ${err}`);

      throw new InternalServerErrorException({
        message: 'fail to get barbecue',
        code: CodeErrors.FAIL_TO_GET_BARBECUE,
      });
    }
  }
}
