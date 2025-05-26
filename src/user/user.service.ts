import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserRegEvent } from 'src/entity/user_regEvent.entity';
import { Event } from 'src/entity/event.entity';
import { to24HourFormat } from 'src/common/utils/time.utils';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        @InjectRepository(Event) private eventRepo: Repository<Event>,
        @InjectRepository(UserRegEvent) private userRegEventRepo: Repository<UserRegEvent>,
    ) { }
    async saveNewUser(data) {
        const existingUser = await this.userRepo.findOne({ where: { email: data.email } });
        if (existingUser) {
            return { message: 'Email already exists!' };
        }
        const salt = await bcrypt.genSalt();
        data.password = await bcrypt.hash(data.password, salt);
        data.role = 'user';
        const newUser = this.userRepo.create(data);
        await this.userRepo.save(newUser);
        return {
            message: 'Account created successfully'
        };
    }

    async bookEvent(userId, eventId, seats) {
        const event = await this.eventRepo.findOne({ where: { id: eventId } });

        if (!event) return { message: 'Event not found' };
        
        const bookedEvents = await this.userRegEventRepo.find({
            where: { user: { id: userId }, event: { id: eventId } },
        });
        if (bookedEvents.length > 0) {
            return { message: 'You have already booked this event!' };
        }

        const timeStr = event.timeRange.split(' - ')[0];
        const time24h = to24HourFormat(timeStr);
        const eventDate = new Date(`${event.date}T${time24h}:00`);
        if (eventDate < new Date()) {
            return { message: 'Event is not available now!' };
        }

        if (event.registered + seats > event.capacity) {
            return { message: 'Not enough seats available' };
        }

        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) return { message: 'User not found' };

        const userRegEvent = this.userRegEventRepo.create({ user, event, seatsBooked: seats });
        await this.userRegEventRepo.save(userRegEvent);

        event.registered += seats;
        await this.eventRepo.save(event);

        return { message: 'Booking successful', seats };
    }

    async getUserEvents(userId) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) return { message: 'User not found' };

        const events = await this.userRegEventRepo.find({
            where: { user },
            relations: ['event'],
        });

        return events.map((regEvent) => ({
            title: regEvent.event.title,
            seatsBooked: regEvent.seatsBooked,
            date: regEvent.event.date,
            time: regEvent.event.timeRange,
            location: regEvent.event.eventLocation,
        }));
    }

    async browseMoreEvents() {
        const events = await this.eventRepo.find();
        return events.map((event) => ({
            title: event.title,
            date: event.date,
            location: event.eventLocation,
            registration: `${event.registered}/${event.capacity}`,
            tags: event.tags.split(',').map(tag => tag.trim()),
        }));
    }

    async cancelBooking(userId, eventId) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) return { message: 'User not found' };
        const event = await this.eventRepo.findOne({ where: { id: eventId } });
        if (!event) return { message: 'Event not found' };
        const regEvent = await this.userRegEventRepo.findOne({
            where: { user, event },
        });
        if (!regEvent) return { message: 'No booking found for this event' };
        event.registered -= regEvent.seatsBooked;
        await this.eventRepo.save(event);
        await this.userRegEventRepo.remove(regEvent);
        return { message: 'Booking cancelled successfully' };
    }
}
