import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsOptional, IsEnum, IsUUID, MinLength, MaxLength } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

@InputType()
export class UpdateTaskInput {
  @Field(() => ID)
  @IsUUID('4', { message: 'id must be a valid UUID' })
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Title must not be empty' })
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Description must not exceed 1000 characters' })
  description?: string;

  @Field(() => TaskStatus, { nullable: true })
  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Status must be PENDING, IN_PROGRESS, or DONE' })
  status?: TaskStatus;
}
