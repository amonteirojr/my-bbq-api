import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({
    description: 'E-mail de acesso',
    example: 'mail@mail.com.br',
    type: String,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Senha de acesso',
    example: 'abc102030',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
