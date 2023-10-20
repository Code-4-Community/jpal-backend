import { Role } from './types/role';

export const userExamples = [
  {
    email: 'c4cneu.jpal+admin@gmail.com',
    role: Role.ADMIN,
    firstName: 'admin',
    lastName: 'user',
    createdDate: new Date('2023-09-24'),
  },
  {
    email: 'c4cneu.jpal+researcher@gmail.com',
    role: Role.RESEARCHER,
    firstName: 'researcher',
    lastName: 'user',
    createdDate: new Date('2023-09-24'),
  },
];
