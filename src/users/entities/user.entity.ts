import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Task } from '../../tasks/entities/task.entity';

@ObjectType()
@Entity('users')
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Field()
  @Column()
  username: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => [Task], { nullable: true })
  @OneToMany(() => Task, (task) => task.user, { eager: false })
  tasks: Task[];
}
