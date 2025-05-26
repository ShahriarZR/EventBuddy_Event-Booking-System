import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from 'src/entity/event.entity';
import { UserRegEvent } from 'src/entity/user_regEvent.entity';


@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>
    ,
    @InjectRepository(UserRegEvent) private userRegEventRepo: Repository<UserRegEvent>,
  ) { }

  async createNewEvent(data, imageFilename?: string) {
    const existingEvent = await this.eventRepo.findOneBy({ title: data.title, date: data.date });
    if (existingEvent) {
      return { message: 'Event with this title in the same date already exists' };
    }
    data.tags = data.tags
      .split(',')
      .map(tag => tag.trim().toLowerCase())
      .join(',');

    data.timeRange = data.timeRange.replace(/\s?(am|pm)/gi, match => match.toUpperCase());

    const event = this.eventRepo.create({
      ...data,
      image: imageFilename ?? null,
    });

    await this.eventRepo.save(event);
    return { message: 'New Event created successfully', title: data.title };
  }

  async updateEvent(id: number, data, imageFilename?: string) {
    const event = await this.eventRepo.findOneBy({ id });
    if (!event) {
      return { message: 'Event not found' };
    }
    if (data.title && data.date) {
      const existingEvent = await this.eventRepo.findOneBy({ title: data.title, date: data.date });
      if (existingEvent && existingEvent.id !== event.id) {
        return { message: 'Event with this title in the same date already exists' };
      }
    }
    if (data.date) {
      const existingEvent = await this.eventRepo.findOneBy({ title: event.title, date: data.date });
      if (existingEvent && existingEvent.id !== event.id) {
        return { message: 'Event with this title in the same date already exists' };
      }
    }
    if (data.title) {
      const existingEvent = await this.eventRepo.findOneBy({ title: data.title, date: event.date });
      if (existingEvent && existingEvent.id !== event.id) {
        return { message: 'Event with this title in the same date already exists' };
      }
    }
    if (data.timeRange) {
      data.timeRange = data.timeRange.replace(/\s?(am|pm)/gi, match => match.toUpperCase());
    }
    if (data.tags) {
      data.tags = data.tags
        .split(',')
        .map(tag => tag.trim().toLowerCase())
        .join(',');
    }

    const updated = {
      ...event,
      ...data,
      image: imageFilename ?? event.image,
    };

    await this.eventRepo.save(updated);
    return { message: 'Event updated successfully' };
  }

  async deleteEvent(id) {
    const event = await this.eventRepo.findOneBy({ id });
    if (!event) {
      return { message: 'Event not found' };
    }

    await this.userRegEventRepo.delete({ event: id });
    await this.eventRepo.delete({ id });
    return { message: 'Event deleted successfully' };
  }

  async getAllEvents() {
    const events = await this.eventRepo.find();
    return events.map((event) => ({
      title: event.title,
      date: event.date,
      location: event.eventLocation,
      registration: `${event.registered}/${event.capacity}`,
      tags: event.tags.split(',').map(tag => tag.trim()),
    }));
  }


}
