import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly body: string;

  @IsInt()
  @Min(0)
  readonly userId: number;
}
