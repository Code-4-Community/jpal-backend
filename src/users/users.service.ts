import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './types/user.entity';
import { Repository } from 'typeorm';
import { Roles } from './types/roles';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(email: string, role: Roles): Promise<User> {
    const emailNotUnique = await this.userRepository.findOne({ email });
    if (!!emailNotUnique) throw new ConflictException('Email already exists');
    const user = this.userRepository.create({
      email,
      role,
    });
    return this.userRepository.save(user);
  }
}
