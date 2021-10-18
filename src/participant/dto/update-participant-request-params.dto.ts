import { IsUUID } from 'class-validator';

export class UpdateParticipantRequestParams {
  @IsUUID()
  participantUuid: string;
}
