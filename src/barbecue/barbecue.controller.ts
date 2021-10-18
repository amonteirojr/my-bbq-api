import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { BarbecueService } from './barbecue.service';

import { CreateBarbecueDTO } from './dto/create-barbecue.dto';
import { GetBarbecueRequestParamsDTO } from './dto/get-barbecue-request-params.dto';
import Barbecue from './entities/barbecue.entity';

@Controller('barbecues')
export class BarbecueController {
  constructor(private readonly barbecueService: BarbecueService) {}

  @Post()
  @ApiCreatedResponse({ type: Barbecue })
  @HttpCode(HttpStatus.OK)
  async createBarbecue(
    @Res() res: Response,
    @Body() createBarbecueDTO: CreateBarbecueDTO,
  ) {
    const response = await this.barbecueService.createBarbecue(
      createBarbecueDTO,
    );
    return res.send(response);
  }

  @Get()
  @ApiOkResponse({ type: Barbecue })
  @HttpCode(HttpStatus.OK)
  async getBarbecues(@Res() res: Response) {
    const response = await this.barbecueService.getAllBarbecues();

    if (response && response.length > 0) {
      return res.send(response);
    } else {
      return res.status(HttpStatus.NO_CONTENT).send();
    }
  }

  @Get('/:barbecueUuid')
  @ApiOkResponse({ type: Barbecue })
  @HttpCode(HttpStatus.OK)
  async getBarbecue(
    @Res() res: Response,
    @Param() params: GetBarbecueRequestParamsDTO,
  ) {
    const response = await this.barbecueService.getBarbecue(
      params.barbecueUuid,
    );

    return res.send(response);
  }
}
