import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './types/user.entity';
import { Repository } from 'typeorm';
import { Roles } from './types/roles';
import { BcryptService } from '../util/bcrypt/bcrypt.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private bcryptService: BcryptService
  ) {}

  create(email: string, role: Roles, password: string): Promise<User> {
    const hashedPassword = this.bcryptService.hash(password);
    const user = this.userRepository.create({
      email,
      role,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: string): Promise<User> {
    return this.userRepository.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
