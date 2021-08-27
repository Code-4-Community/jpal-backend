import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AwsCreateUserService } from '../../src/util/aws-create-user/aws-create-user.service';
import { Roles } from './types/roles';
import { User } from './types/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private awsCreateUser: AwsCreateUserService,
  ) {}

  async create(email: string, role: Roles): Promise<User> {
    const emailNotUnique = await this.userRepository.findOne({ email });
    if (!!emailNotUnique) throw new ConflictException('Email already exists');
    try {
      await this.awsCreateUser.adminCreateUser(email);
      const user = this.userRepository.create({
        email,
        role,
        isClaimed: false,
      });
      return this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
