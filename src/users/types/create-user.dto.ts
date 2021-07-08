import { User } from './user.entity';

type CreateUserDto = Omit<User, 'id'>;

export default CreateUserDto;
