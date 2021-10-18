import { Module } from '@nestjs/common';
import { ParticipantService } from './participant.service';
import { ParticipantController } from './participant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipantRepository } from './repositories/participant.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ParticipantRepository])],
  providers: [ParticipantService],
  exports: [ParticipantService],
  controllers: [ParticipantController],
})
export class ParticipantModule {}
