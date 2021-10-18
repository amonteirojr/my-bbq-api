import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Res,
  ValidationPipe,
  Param,
} from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateParticipantDTO } from './dto/create-participant.dto';
import { UpdateParticipantRequestParams } from './dto/update-participant-request-params.dto';
import { UpdateParticipantDTO } from './dto/update-participant.dto';
import Participant from './entities/participant.entity';
import { ParticipantService } from './participant.service';

@Controller('participants')
export class ParticipantController {
  constructor(private readonly participantService: ParticipantService) {}

  @Post()
  @ApiCreatedResponse({ type: Participant })
  @HttpCode(HttpStatus.OK)
  async createBarbecue(
    @Res() res: Response,
    @Body() createPàrticipantDTO: CreateParticipantDTO,
  ) {
    const response = await this.participantService.createParticipant(
      createPàrticipantDTO,
    );
    return res.send(response);
  }

  @Put('/:participantUuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateParticipantPaid(
    @Res() res: Response,
    @Body(new ValidationPipe({ whitelist: true }))
    updateParticipantDTO: UpdateParticipantDTO,
    @Param() updateParticipantParams: UpdateParticipantRequestParams,
  ) {
    await this.participantService.updateParticipant(
      updateParticipantDTO,
      updateParticipantParams.participantUuid,
    );
    return res.send();
  }
}
