import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CodeErrors } from 'src/shared/code-errors.enum';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserRepository } from './repositories/user.repository';

import * as bcrypt from 'bcrypt';
import User from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly userRepository: UserRepository) {}

  async findByEmail(email: string) {
    try {
      return await this.userRepository.findOne({ email });
    } catch (err) {
      this.logger.log(`Error while trying to find a user by e-mail: ${err}`);

      throw new InternalServerErrorException({
        code: CodeErrors.FAIL_TO_FIND_USER,
        message: 'fail to find user by email',
      });
    }
  }

  async createUser(createUserDTO: CreateUserDTO): Promise<User> {
    try {
      const userDTO = {
        email: createUserDTO.email,
        password: bcrypt.hashSync(createUserDTO.password, 1),
      };

      const user = this.userRepository.create(userDTO);

      const { email, uuid } = await this.userRepository.save(user);

      return { email, uuid } as User;
    } catch (err) {
      this.logger.log(`Error on create user: ${err}`);

      if (err.code === '23505') {
        throw new ConflictException({
          code: CodeErrors.USER_ALREADY_EXISTS,
          message: 'user already exists',
        });
      }

      throw new InternalServerErrorException({
        code: CodeErrors.FAIL_TO_CREATE_USER,
        message: 'fail to create user',
      });
    }
  }
}
