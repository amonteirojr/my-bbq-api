import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateParticipantDTO {
  @ApiProperty({
    description: 'UUID do churras',

    type: String,
  })
  @IsUUID()
  barbecueUuid?: string;

  @ApiProperty({
    description: 'Nome do participante',
    example: 'Adriano',
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Valor de contribuição',
    example: 20,
    type: Number,
  })
  @IsNumber()
  contributionAmount: number;

  @ApiProperty({
    description: 'Indica se o valor foi pago ou não',
    example: false,
    type: Boolean,
  })
  @IsBoolean()
  paid?: boolean;
}
