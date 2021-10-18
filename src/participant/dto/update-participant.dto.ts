import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateParticipantDTO {
  @ApiProperty({
    description: 'Indica se o usuário já pagou',
    type: Boolean,
  })
  @IsBoolean()
  paid: boolean;

  @ApiProperty({
    description: 'Nome do participante',
    type: String,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Valor de contribuição',
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  contributionAmount?: number;
}
