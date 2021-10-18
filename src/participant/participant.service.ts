import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CodeErrors } from 'src/shared/code-errors.enum';
import { CreateParticipantDTO } from './dto/create-participant.dto';
import { UpdateParticipantDTO } from './dto/update-participant.dto';
import Participant from './entities/participant.entity';
import { ParticipantRepository } from './repositories/participant.repository';

export interface GetParticipantData {
  participantUuid: string;
}

export interface ParticipantsDetailsData {
  participantUuid: string;
  name: string;
  paid: boolean;
  contributionAmount: number;
}

@Injectable()
export class ParticipantService {
  private readonly logger = new Logger(ParticipantService.name);

  constructor(private readonly participantRepository: ParticipantRepository) {}

  async createParticipant(
    createParticipantDTO: CreateParticipantDTO,
  ): Promise<Participant> {
    try {
      const participant =
        this.participantRepository.create(createParticipantDTO);
      return await this.participantRepository.save(participant);
    } catch (err) {
      this.logger.error(`Error on create a new participant: ${err}`);

      throw new InternalServerErrorException({
        message: 'fail to create a new participant',
        code: CodeErrors.FAIL_TO_CREATE_PARTICIPANT,
      });
    }
  }

  async updateParticipant(
    updateParticipantDTO: UpdateParticipantDTO,
    participantUuid: string,
  ): Promise<void> {
    try {
      await this.participantRepository.update(
        { uuid: participantUuid },
        updateParticipantDTO,
      );
      return;
    } catch (err) {
      this.logger.error(
        `Error on update participant - uuid ${participantUuid}: ${err}`,
      );

      throw new InternalServerErrorException({
        message: 'fail to create a new participant',
        code: CodeErrors.FAIL_TO_CREATE_PARTICIPANT,
      });
    }
  }

  async createBarbecueParticipants(
    createParticipantsDTO: CreateParticipantDTO[],
    barbecueUuid: string,
  ): Promise<Participant[]> {
    try {
      createParticipantsDTO.forEach((participant) => {
        participant.barbecueUuid = barbecueUuid;
      });

      const participants = this.participantRepository.create(
        createParticipantsDTO,
      );

      return await this.participantRepository.save(participants);
    } catch (err) {
      this.logger.error(`Error on create a new participant: ${err}`);

      throw new InternalServerErrorException({
        message: 'fail to create a new participant',
        code: CodeErrors.FAIL_TO_CREATE_PARTICIPANT,
      });
    }
  }

  // async getParticipantsDetailsData(
  //   barbecueParticipants: BarbecueParticipants[],
  // ): Promise<ParticipantsDetailsData[]> {
  //   try {
  //     const participantDetails: ParticipantsDetailsData[] = await Promise.all(
  //       barbecueParticipants.map(async (participant) => {
  //         const details = await this.participantRepository.findOne({
  //           uuid: participant.participantUuid,
  //         });

  //         return {
  //           participantUuid: participant.participantUuid,
  //           name: details.name,
  //           paid: participant.paid,
  //           contributionAmount: participant.contributionAmount,
  //         };
  //       }),
  //     );

  //     return participantDetails;
  //   } catch (err) {
  //     this.logger.error(`Error on get participants: ${err}`);

  //     throw new InternalServerErrorException({
  //       message: 'fail to get participants',
  //       code: CodeErrors.FAIL_TO_GET_PARTICIPANTS,
  //     });
  //   }
  // }
}
