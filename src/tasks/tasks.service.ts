import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  async findAllByUser(userId: string): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOneById(id: string): Promise<Task | null> {
    return this.tasksRepository.findOne({ where: { id } });
  }

  async findOneByIdOrThrow(id: string): Promise<Task> {
    const task = await this.findOneById(id);
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return task;
  }

  async create(createTaskInput: CreateTaskInput, user: User): Promise<Task> {
    const task = this.tasksRepository.create({
      ...createTaskInput,
      userId: user.id,
      user,
    });
    return this.tasksRepository.save(task);
  }

  async update(updateTaskInput: UpdateTaskInput, userId: string): Promise<Task> {
    const { id, ...updates } = updateTaskInput;

    const task = await this.findOneByIdOrThrow(id);

    if (task.userId !== userId) {
      throw new ForbiddenException('You are not allowed to update this task');
    }

    Object.assign(task, updates);
    return this.tasksRepository.save(task);
  }

  async remove(id: string, userId: string): Promise<boolean> {
    const task = await this.findOneByIdOrThrow(id);

    if (task.userId !== userId) {
      throw new ForbiddenException('You are not allowed to delete this task');
    }

    await this.tasksRepository.remove(task);
    return true;
  }
}
