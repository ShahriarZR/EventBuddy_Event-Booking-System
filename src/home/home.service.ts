import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from 'src/entity/event.entity';

@Injectable()
export class HomeService {
    constructor(
        @InjectRepository(Event) private eventRepo: Repository<Event>
    ) { }

    async upcomingEventDetails() {
        const today = new Date().toISOString().split('T')[0]; 

        const events = await this.eventRepo
            .createQueryBuilder('event')
            .where('event.date > :today', { today })
            .orderBy('event.date', 'ASC')
            .getMany();

        if (!events || events.length === 0) {
            return { message: 'No upcoming events found' };
        }

        return events.map((event) => ({
            title: event.title,
            date: event.date,
            time: event.timeRange,
            image: event.image,
            description: event.description,
            location: event.eventLocation,
            tags: event.tags.split(',').map(tag => tag.trim()),
            seatsLeft: event.capacity - event.registered,
            capacity: event.capacity,
        }));
    }

    async pastEventDetails() {
        const today = new Date().toISOString().split('T')[0]; 

        const pastEvents = await this.eventRepo
            .createQueryBuilder('event')
            .where('event.date < :today', { today })
            .orderBy('event.date', 'DESC')
            .getMany();

        if (!pastEvents || pastEvents.length === 0) {
            return { message: 'No past events found' };
        }

        return pastEvents.map((pastEvent) => ({
            title: pastEvent.title,
            date: pastEvent.date,
            time: pastEvent.timeRange,
            image: pastEvent.image,
            description: pastEvent.description,
            location: pastEvent.eventLocation,
            tags: pastEvent.tags.split(',').map(tag => tag.trim()),
            seatsLeft: pastEvent.capacity - pastEvent.registered,
            capacity: pastEvent.capacity,
        }));
    }

    async searchEventsByTitle(title: string) {
        const events = await this.eventRepo
            .createQueryBuilder('event')
            .where('LOWER(event.title) LIKE :title', { title: `%${title.toLowerCase()}%` })
            .orderBy('event.date', 'ASC')
            .getMany();

        if (!events || events.length === 0) {
            return { message: 'No events matched your search' };
        }

        return events.map((event) => ({
            title: event.title,
            date: event.date,
            time: event.timeRange,
            image: event.image,
            description: event.description,
            location: event.eventLocation,
            tags: event.tags.split(',').map(tag => tag.trim()),
            seatsLeft: event.capacity - event.registered,
            capacity: event.capacity,
        }));
    }

    async eventDetailsById(id: number) {
        const event = await this.eventRepo.findOne({ where: { id } });

        if (!event) {
            return { message: 'Event not found' };
        }

        return {
            title: event.title,
            date: event.date,
            day: new Date(event.date).toLocaleDateString('en-US', { weekday: 'long' }),
            time: event.timeRange,
            image: event.image,
            description: event.description,
            location: event.eventLocation,
            tags: event.tags.split(',').map(tag => tag.trim()),
            seatsLeft: event.capacity - event.registered,
            capacity: event.capacity,
        };
    }
}
