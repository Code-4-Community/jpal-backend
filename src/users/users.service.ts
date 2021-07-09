import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './types/user.entity';
import { Repository } from 'typeorm';
import { Roles } from './types/roles';
import { BcryptService } from '../util/bcrypt/bcrypt.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private bcryptService: BcryptService,
  ) {}

  async create(email: string, role: Roles, password: string): Promise<User> {
    const hashedPassword = this.bcryptService.hash(password);
    const emailNotUnique = await this.userRepository.findOne({ email });
    if (!!emailNotUnique) throw new ConflictException('Email already exists');
    const user = this.userRepository.create({
      email,
      role,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }
}
