import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class GetBarbecueRequestParamsDTO {
  @ApiProperty({
    description: 'UUID do churrasco',
    example: 'dfd8a4c1-65fb-46fb-962d-585e02a54c85',
    type: String,
  })
  @IsUUID()
  barbecueUuid: string;
}
