import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRegEvent } from './user_regEvent.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'date' })
  date: string;

  @Column()
  timeRange: string;
  @Column({ type: 'text' })
  description: string;

  @Column()
  eventLocation: string;

  @Column()
  capacity: number;

  @Column({ default: 0 })
  registered: number;

  @Column()
  tags: string;

  @Column({ nullable: true })
  image: string;

  @OneToMany(() => UserRegEvent, userRegEvent => userRegEvent.event)
  userRegEvents: UserRegEvent[];
}
