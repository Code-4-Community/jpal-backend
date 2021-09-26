import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AwsCreateUserService } from '../../src/util/aws-create-user/aws-create-user.service';
import { Role } from './types/role';
import { User } from './types/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private awsCreateUser: AwsCreateUserService,
  ) {}

  async create(email: string, role: Role): Promise<User> {
    const emailNotUnique = await this.userRepository.findOne({ email });
    if (!!emailNotUnique) throw new ConflictException('Email already exists');
    try {
      await this.awsCreateUser.adminCreateUser(email);
      const user = this.userRepository.create({
        email,
        role,
      });
      return this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllAdmins() : Promise<User[]> {
    console.log(await this.userRepository.find({where: {role: Role.ADMIN}}));
    console.log(await this.userRepository.find());
    return this.userRepository.find({where: {role: Role.ADMIN}})
  }
}
