import { Role } from './role';
import { User } from './user.entity';

export const ADMIN_1: User = {
  id: 1,
  firstName: 'first',
  lastName: 'last',
  email: 'test@test.com',
  creation_date: new Date("2-6'2022"),
  role: Role.ADMIN,
};

export const ADMIN_2: User = {
  id: 2,
  firstName: 'first',
  lastName: 'last',
  email: 'already@exists.com',
  creation_date: new Date("2-6'2022"),
  role: Role.ADMIN,
};

export const RESEARCHER_1: User = {
  id: 3,
  firstName: 'first',
  lastName: 'last',
  email: 'researcher@test.com',
  creation_date: new Date("2-6'2022"),
  role: Role.RESEARCHER,
};
