import { ApiProperty } from '@nestjs/swagger';
import {
  IsCurrency,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import Participant from 'src/participant/entities/participant.entity';

export class CreateBarbecueDTO {
  @ApiProperty({
    description: 'Data do churrasco',
    example: '2021-10-09',
    type: String,
    format: 'ISO_8601',
  })
  @IsISO8601()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    description: 'Descrição do churrasco',
    example: 'Churras para o niver do Adriano',
    type: String,
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Observações adicionais',
    example: 'Levar roupa de banho',
    type: String,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Valor sugerido por pessoa',
    example: 20.0,
    type: Number,
  })
  @IsNumber()
  @IsCurrency()
  @IsOptional()
  suggestedValue?: number;

  @ApiProperty({
    description: 'Valor sugerido de cerveja por pessoa',
    example: 30.0,
    type: Number,
  })
  @IsNumber()
  @IsCurrency()
  @IsOptional()
  suggestedBeerValue?: number;

  @ApiProperty({
    description: 'Participantes do churrasco',
    type: [Participant],
  })
  participants?: Participant[];
}
