import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BarbecueService } from './barbecue.service';

import { CreateBarbecueDTO } from './dto/create-barbecue.dto';
import { GetBarbecueRequestParamsDTO } from './dto/get-barbecue-request-params.dto';
import { UpdateBarbecueRequestParamDTO } from './dto/update-barbecue-request-param.dto';
import { UpdateBarbecueDTO } from './dto/update-barbecue.dto';
import Barbecue from './entities/barbecue.entity';

@Controller('barbecues')
export class BarbecueController {
  constructor(
    private readonly barbecueService: BarbecueService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiCreatedResponse({ type: Barbecue })
  @HttpCode(HttpStatus.CREATED)
  async createBarbecue(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createBarbecueDTO: CreateBarbecueDTO,
  ) {
    const { sub } = this.authService.decode(req.headers.authorization);

    const response = await this.barbecueService.createBarbecue(
      createBarbecueDTO,
      sub,
    );
    return res.send(response);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOkResponse({ type: Barbecue })
  @HttpCode(HttpStatus.OK)
  async getBarbecues(@Req() req: Request, @Res() res: Response) {
    const { sub } = this.authService.decode(req.headers.authorization);

    const response = await this.barbecueService.getAllBarbecuesByUserUUid(sub);

    if (response && response.length > 0) {
      return res.send(response);
    } else {
      return res.status(HttpStatus.NO_CONTENT).send();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:barbecueUuid')
  @ApiOkResponse({ type: Barbecue })
  @HttpCode(HttpStatus.OK)
  async getBarbecue(
    @Req() req: Request,
    @Res() res: Response,
    @Param() params: GetBarbecueRequestParamsDTO,
  ) {
    const { sub } = this.authService.decode(req.headers.authorization);

    const response = await this.barbecueService.getBarbecue(
      params.barbecueUuid,
      sub,
    );

    return res.send(response);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:barbecueUuid')
  @ApiCreatedResponse({ type: Barbecue })
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBarbecue(
    @Req() req: Request,
    @Res() res: Response,
    @Body()
    updateBarbecueDTO: UpdateBarbecueDTO,
    @Param() updateBarbecueRequestParamDTO: UpdateBarbecueRequestParamDTO,
  ) {
    const { sub } = this.authService.decode(req.headers.authorization);

    const response = await this.barbecueService.updateBarbecue(
      updateBarbecueDTO,
      updateBarbecueRequestParamDTO.barbecueUuid,
      sub,
    );
    return res.send(response);
  }
}
