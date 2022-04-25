import { mock } from 'jest-mock-extended';
import { Repository } from 'typeorm';
import { User } from './types/user.entity';
import { ADMIN_1, ADMIN_2, RESEARCHER_1 } from './types/user.examples';

export const mockUserRepository: Repository<User> = mock<Repository<User>>();
const data: User[] = [ADMIN_1, ADMIN_2, RESEARCHER_1];

mockUserRepository.find = jest.fn().mockResolvedValue(data);

const findRecord = (id: number): Promise<User> =>
  Promise.resolve(data.find((user) => user.id === id));

mockUserRepository.findOne = jest.fn().mockImplementation(findRecord);

mockUserRepository.findOneOrFail = jest.fn().mockImplementation((id: number): Promise<User> => {
  const res = data.find((user) => user.id === id);
  if (!res) throw new Error('Record not found');
  return Promise.resolve(res);
});

mockUserRepository.save = jest.fn().mockImplementation((user) => {
  const newRecord = (user?.id && data.find((other) => other.id === user.id)) ?? {
    ...user,
    id: data.length + 1,
  };
  data.push(newRecord);
  return Promise.resolve(newRecord);
});
