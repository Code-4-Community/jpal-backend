import { Role } from './role';
import { User } from './user.entity';

export const ADMIN_1: User = {
  id: 1,
  email: 'test@test.com',
  role: Role.ADMIN,
};

export const ADMIN_2: User = {
  id: 2,
  email: 'already@exists.com',
  role: Role.ADMIN,
};

export const RESEARCHER_1: User = {
  id: 3,
  email: 'researcher@test.com',
  role: Role.RESEARCHER,
};
