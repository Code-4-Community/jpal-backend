import { Role } from './role';
import { User } from './user.entity';

export const ADMIN_1: User = {
  id: 1,
  firstName: 'first',
  lastName: 'last',
  email: 'test@test.com',
  role: Role.ADMIN,
  createdDate: new Date('2023-09-24'),
};

export const ADMIN_2: User = {
  id: 2,
  firstName: 'first',
  lastName: 'last',
  email: 'already@exists.com',
  role: Role.ADMIN,
  createdDate: new Date('2023-09-24'),
};

export const RESEARCHER_1: User = {
  id: 3,
  firstName: 'first',
  lastName: 'last',
  email: 'researcher@test.com',
  role: Role.RESEARCHER,
  createdDate: new Date('2023-09-24'),
};
