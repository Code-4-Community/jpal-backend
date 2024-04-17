import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/types/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CognitoService } from '../util/cognito/cognito.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private cognitoService: CognitoService,
  ) {}

  async verifyJwt(jwt: string): Promise<User> {
    const userPayload = await this.cognitoService.validate(jwt);
    console.log('user payload', userPayload);
    console.log(!userPayload || !userPayload.email);
    if (!userPayload || !userPayload.email) throw new NotFoundException();
    const users = await this.userRepository.find();
    console.log(users);
    const user = await this.userRepository.findOneOrFail({
      email: userPayload.email,
    });
    return user;
  }
}
