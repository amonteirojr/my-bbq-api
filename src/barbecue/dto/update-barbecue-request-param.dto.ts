import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UpdateBarbecueRequestParamDTO {
  @ApiProperty({
    description: 'UUID do churrasco',
    example: 'fc525f13-6c3e-4e6d-997d-cd2269f26b1d',
    type: String,
  })
  @IsUUID()
  barbecueUuid: string;
}
