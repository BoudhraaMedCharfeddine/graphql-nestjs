import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Resolver(() => Task)
@UseGuards(GqlAuthGuard)
export class TasksResolver {
  constructor(private readonly tasksService: TasksService) {}

  @Query(() => [Task], {
    description: "Get all tasks belonging to the current authenticated user",
  })
  async tasks(@CurrentUser() user: User): Promise<Task[]> {
    return this.tasksService.findAllByUser(user.id);
  }

  @Query(() => Task, {
    description: 'Get a single task by ID (must belong to the current user)',
  })
  async task(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<Task> {
    const task = await this.tasksService.findOneByIdOrThrow(id);

    if (task.userId !== user.id) {
      throw new Error('Task not found or access denied');
    }

    return task;
  }

  @Mutation(() => Task, {
    description: 'Create a new task for the current authenticated user',
  })
  async createTask(
    @Args('input') input: CreateTaskInput,
    @CurrentUser() user: User,
  ): Promise<Task> {
    return this.tasksService.create(input, user);
  }

  @Mutation(() => Task, {
    description: 'Update an existing task (must belong to the current user)',
  })
  async updateTask(
    @Args('input') input: UpdateTaskInput,
    @CurrentUser() user: User,
  ): Promise<Task> {
    return this.tasksService.update(input, user.id);
  }

  @Mutation(() => Boolean, {
    description: 'Delete a task by ID (must belong to the current user)',
  })
  async deleteTask(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.tasksService.remove(id, user.id);
  }
}
