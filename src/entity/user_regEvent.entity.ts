import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Event } from './event.entity';

@Entity()
export class UserRegEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.userRegEvents)
  user: User;

  @ManyToOne(() => Event, event => event.userRegEvents)
  event: Event;

  @Column()
  seatsBooked: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  bookedAt: Date;
}
