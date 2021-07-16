import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../users/types/user.entity';
import { LoginResponseDto } from './types/login-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtUtils } from '../util/jwt/jwt';
import { BcryptService } from '../util/bcrypt/bcrypt.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private bcryptService: BcryptService,
  ) {}

  async logIn(email: string, password: string): Promise<LoginResponseDto> {
    const user = await this.userRepository.findOne({ email });
    if (!user) throw new NotFoundException();
    const verified = this.bcryptService.compare(password, user.password);
    if (!verified) throw new UnauthorizedException();
    const jwt = JwtUtils.sign(user.id);
    return {
      user,
      jwt,
    };
  }

  async verifyJwt(jwt: string): Promise<User> {
    try {
      const userId = JwtUtils.verify(jwt);
      const user = await this.userRepository.findOneOrFail({ id: userId });
      return user;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
