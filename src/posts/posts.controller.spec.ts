import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

const mockPostsService = mock<PostsService>();

describe('PostsController', () => {
  let controller: PostsController;
  const mockPost: Post = new Post();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: mockPostsService,
        },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);

    mockPost.id = 1;
    mockPost.title = 'test';
    mockPost.body = 'test';
    mockPost.userId = 1;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get all Posts by calling the service appropriately', async () => {
    expect.assertions(1);
    const mockReturn = [mockPost];
    mockPostsService.findAll.mockResolvedValueOnce(mockReturn);
    expect(await controller.findAll()).toEqual(mockReturn);
  });

  it('should fail to get all Posts when service fails', async () => {
    expect.assertions(1);
    const error = new Error('error');
    mockPostsService.findAll.mockRejectedValueOnce(error);
    await expect(controller.findAll()).rejects.toThrow(error);
  });

  it('should get Post by id', async () => {
    expect.assertions(2);
    const mockReturn = mockPost;
    mockPostsService.findOne.mockResolvedValueOnce(mockReturn);
    expect(await controller.findOne(mockPost.id)).toEqual(mockReturn);
    expect(mockPostsService.findOne).toHaveBeenCalledWith(mockPost.id);
  });

  it('should fail to get Post by id when service fails', async () => {
    expect.assertions(1);
    const error = new Error('error');
    mockPostsService.findOne.mockRejectedValueOnce(error);
    await expect(controller.findOne(mockPost.id)).rejects.toThrow(
      new BadRequestException(error.message),
    );
  });

  it('should create a Post', async () => {
    expect.assertions(2);
    const mockReturn = mockPost;
    const mockRequest: CreatePostDto = {
      title: mockPost.title,
      body: mockPost.body,
      userId: 1,
    };
    mockPostsService.create.mockResolvedValueOnce(mockReturn);
    expect(await controller.create(mockRequest)).toEqual(mockReturn);
    expect(mockPostsService.create).toHaveBeenCalledWith(mockRequest);
  });

  it('should fail to create Post when service fails', async () => {
    expect.assertions(1);
    const mockRequest: CreatePostDto = {
      title: mockPost.title,
      body: mockPost.body,
      userId: 1,
    };
    const error = new Error('error');
    mockPostsService.create.mockRejectedValueOnce(error);
    await expect(controller.create(mockRequest)).rejects.toThrow(
      new BadRequestException(error.message),
    );
  });

  it('should update a Post', async () => {
    expect.assertions(2);
    const mockReturn = mockPost;
    const mockRequest: UpdatePostDto = {
      title: mockPost.title,
      body: mockPost.body,
      userId: 1,
    };
    mockPostsService.findOne.mockResolvedValueOnce(mockReturn);
    mockPostsService.update.mockResolvedValueOnce(mockReturn);
    expect(await controller.update(mockReturn.id, mockRequest)).toEqual(
      mockReturn,
    );
    expect(mockPostsService.update).toHaveBeenCalledWith(
      mockReturn.id,
      mockRequest,
    );
  });

  it('should fail to update Post when service fails', async () => {
    expect.assertions(1);
    const mockRequest: UpdatePostDto = {
      title: mockPost.title,
      body: mockPost.body,
      userId: 1,
    };
    const error = new Error('error');
    mockPostsService.findOne.mockResolvedValueOnce(new Post());
    mockPostsService.update.mockRejectedValueOnce(error);
    await expect(controller.update(1, mockRequest)).rejects.toThrow(
      new BadRequestException(error.message),
    );
  });

  it('should delete a Post', async () => {
    expect.assertions(2);
    mockPostsService.findOne.mockResolvedValueOnce(new Post());
    expect(await controller.remove(1)).toBe(undefined);
    expect(mockPostsService.remove).toHaveBeenCalledWith(1);
  });

  it('should fail to delete Post when service fails', async () => {
    expect.assertions(1);
    mockPostsService.findOne.mockResolvedValueOnce(new Post());
    const error = new Error('error');
    mockPostsService.remove.mockRejectedValueOnce(error);
    await expect(controller.remove(1)).rejects.toThrow(
      new BadRequestException(error.message),
    );
  });

  it("should fail to delete Post when Post doesn't exist", async () => {
    expect.assertions(1);
    mockPostsService.findOne.mockResolvedValueOnce(undefined);
    await expect(controller.remove(1)).rejects.toThrow(
      new BadRequestException(`Post with id ${1} not found`),
    );
  });
});
