import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.postsService.findOne(id);
    if (!result) {
      throw new BadRequestException(`Post with id ${id} not found`);
    } else {
      return result;
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    if (!(await this.postsService.findOne(id))) {
      throw new BadRequestException(`Post with id ${id} not found`);
    } else {
      return this.postsService.update(id, updatePostDto);
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    if (!(await this.postsService.findOne(id))) {
      throw new BadRequestException(`Post with id ${id} not found`);
    }
    await this.postsService.remove(id);
    return;
  }
}
