import { Module } from '@nestjs/common';
import { BarbecueService } from './barbecue.service';
import { BarbecueController } from './barbecue.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarbecueRepository } from './repositories/barbecue.repository';
import { ParticipantService } from 'src/participant/participant.service';
import { ParticipantRepository } from 'src/participant/repositories/participant.repository';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { UserRepository } from 'src/user/repositories/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BarbecueRepository,
      ParticipantRepository,
      UserRepository,
    ]),
    AuthModule,
    UserModule,
  ],
  providers: [BarbecueService, ParticipantService],
  exports: [BarbecueService],
  controllers: [BarbecueController],
})
export class BarbecueModule {}
