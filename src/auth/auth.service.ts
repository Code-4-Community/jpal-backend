import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../users/types/user.entity';
import { LoginResponseDto } from './dto/login-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BcryptService } from '../util/bcrypt/bcrypt.service';
import { JwtService } from '../util/jwt/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private bcryptService: BcryptService,
    private jwtService: JwtService,
  ) {}

  async logIn(email: string, password: string): Promise<LoginResponseDto> {
    const user = await this.userRepository.findOne({ email });
    if (!user) throw new NotFoundException('User not found');

    const verified = this.bcryptService.compare(password, user.password);
    if (!verified) throw new UnauthorizedException('Password mismatch');

    const jwt = this.jwtService.sign(user.id);
    return {
      user,
      jwt,
    };
  }

  async verifyJwt(jwt: string): Promise<User> {
    try {
      const userId = this.jwtService.verify(jwt);
      if (!userId) throw new NotFoundException();
      const user = await this.userRepository.findOneOrFail({ id: userId });
      return user;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
