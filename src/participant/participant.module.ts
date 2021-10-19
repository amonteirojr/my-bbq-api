import { Module } from '@nestjs/common';
import { ParticipantService } from './participant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipantRepository } from './repositories/participant.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ParticipantRepository])],
  providers: [ParticipantService],
  exports: [ParticipantService],
})
export class ParticipantModule {}
