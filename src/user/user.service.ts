import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AwsCreateUserService } from '../util/aws-create-user/aws-create-user.service';
import { Role } from './types/role';
import { User } from './types/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private awsCreateUser: AwsCreateUserService,
  ) {}

  async create(
    email: string,
    firstName: string,
    lastName: string,
    role: Role,
  ): Promise<User> {
    const emailNotUnique = await this.userRepository.findOne({ email });
    if (!!emailNotUnique) throw new ConflictException('Email already exists');
    try {
      await this.awsCreateUser.adminCreateUser(email);
      const user = this.userRepository.create({
        email,
        firstName,
        lastName,
        role,
      });
      return this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   *
   * grabs all users with the role admin and returns them as an array of Users
   */
  async getAllAdmins(): Promise<User[]> {
    return this.userRepository.find({ where: { role: Role.ADMIN } });
  }
}
