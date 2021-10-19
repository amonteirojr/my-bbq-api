import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import Participant from 'src/participant/entities/participant.entity';
import { ParticipantService } from 'src/participant/participant.service';
import { CodeErrors } from 'src/shared/code-errors.enum';
import { UserRepository } from 'src/user/repositories/user.repository';
import { CreateBarbecueDTO } from './dto/create-barbecue.dto';
import { UpdateBarbecueDTO } from './dto/update-barbecue.dto';
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

export interface UpdateBarbecueParticipantsDTO {
  name: string;
  contributionAmount: number;
  paid?: boolean;
  uuid: string;
  barbecueUuid: string;
}

interface UpdateBarbecue {
  date: string;
  description: string;
  notes?: string;
  suggestedValue?: number;
  suggestedBeerValue?: number;
  participants?: UpdateBarbecueParticipantsDTO[];
  userUuid: string;
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
    userUuid: string,
  ): Promise<Barbecue> {
    try {
      const barbecue = this.barbecueRepository.create(createBarbecueDTO);
      barbecue.userUuid = userUuid;

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

  async getAllBarbecuesByUserUUid(
    userUuid: string,
  ): Promise<BarbecueResponse[]> {
    try {
      const barbecues = await this.barbecueRepository.find({
        where: { userUuid },
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
          notes: barbecue.notes || '',
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

  async getBarbecue(
    uuid: string,
    userUuid: string,
  ): Promise<BarbecueDetailsResponse> {
    try {
      const barbecue = await this.barbecueRepository.findOne({
        where: { uuid, userUuid },
        relations: ['participants'],
      });

      if (!barbecue) {
        throw new NotFoundException({
          code: CodeErrors.BARBECUE_NOT_FOUND,
          message: `Barbecue ${uuid} not found`,
        });
      }

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

      if (err instanceof NotFoundException) {
        throw err;
      }

      throw new InternalServerErrorException({
        message: 'fail to get barbecue',
        code: CodeErrors.FAIL_TO_GET_BARBECUE,
      });
    }
  }

  async updateBarbecue(
    updateBarbecueDTO: UpdateBarbecueDTO,
    barbecueUuid: string,
    userUuid: string,
  ): Promise<void> {
    try {
      const updateBarbecue: UpdateBarbecue = {
        date: updateBarbecueDTO.date,
        description: updateBarbecueDTO.description,
        notes: updateBarbecueDTO.notes,
        suggestedBeerValue: updateBarbecueDTO.suggestedBeerValue,
        suggestedValue: updateBarbecueDTO.suggestedValue,
        userUuid,
      };

      const existingBarbecue = await this.barbecueRepository.findOne({
        uuid: barbecueUuid,
      });

      if (!existingBarbecue) {
        throw new NotFoundException({
          code: CodeErrors.BARBECUE_NOT_FOUND,
          message: `Barbecue ${barbecueUuid} not found`,
        });
      }

      await this.barbecueRepository.update(
        { uuid: barbecueUuid },
        updateBarbecue,
      );

      const { participants } = updateBarbecueDTO;

      await this.participantService.updateBarbecueParticipant(
        participants,
        barbecueUuid,
      );
    } catch (err) {
      this.logger.error(`Error on update a barbecue: ${err}`);

      if (err instanceof NotFoundException) {
        throw err;
      }

      throw new InternalServerErrorException({
        message: 'fail to update a barbecue',
        code: CodeErrors.FAIL_TO_UPDATE_BARBECUE,
      });
    }
  }
}
