import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { Role } from './types/role';
import { UsersService } from './users.service';
import { User } from './types/user.entity';

const mockUser: User = {
  id: 1,
  email: 'test@test.com',
  role: Role.ADMIN,
};


const listMockUsers: User[] = [mockUser];

const serviceMock: Partial<UsersService> = {
  create: jest.fn(() => Promise.resolve(mockUser)),
  getAllAdmins: jest.fn(() => Promise.resolve(listMockUsers))
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should delegate user creation to the users service', async () => {
    expect.assertions(2);
    expect(
      await controller.create({ email: mockUser.email, role: mockUser.role }),
    ).toEqual(mockUser);
    expect(serviceMock.create).toHaveBeenCalledWith(
      mockUser.email,
      mockUser.role,
    );
  });

  it('should delegate fetching all admins to the users service', async () => {
    expect.assertions(2);
    expect(
      await controller.getAllAdmins()
    ).toEqual(listMockUsers);
    expect(serviceMock.getAllAdmins).toHaveBeenCalled();
  }) 
});
