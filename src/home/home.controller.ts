import { BadRequestException, Body, Controller, Get, ParseIntPipe, Post, Query } from '@nestjs/common';
import { HomeService } from './home.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';

@ApiTags('Home')
@Controller('home')
export class HomeController {
    constructor(private readonly homeService: HomeService) { }

    @Get('upcomingEventDetails')
    @ApiOperation({ summary: 'Get upcoming event details' })
    @ApiResponse({ status: 200, description: 'Upcoming event details retrieved successfully.' })
    upcomingEventDetails(
    ) {
        return this.homeService.upcomingEventDetails();
    }

    @Get('pastEventDetails')
    @ApiOperation({ summary: 'Get past event details' })
    @ApiResponse({ status: 200, description: 'Past event details retrieved successfully.' })
    async getPastEvents() {
        return this.homeService.pastEventDetails();
    }

    @Post('searchEvents')
    @ApiOperation({ summary: 'Search events by title' })
    @ApiResponse({ status: 200, description: 'Events matching the title retrieved successfully.' })
    @ApiBody({ schema: { type: 'object', properties: { title: { type: 'string' } }, required: ['title'] } })
    async searchEvents(@Body('title') title: string) {
        if (!title || title.trim() === '') {
            throw new BadRequestException('Title query parameter is required');
        }
        return this.homeService.searchEventsByTitle(title);
    }

    @Get('showEventDetails')
    @ApiOperation({ summary: 'Get event details by ID' })
    @ApiResponse({ status: 200, description: 'Event details retrieved successfully.' })
    @ApiQuery({ name: 'id', type: Number, description: 'ID of the event' })
    async getEventById(@Query('id', ParseIntPipe) id: number) {
        if (isNaN(id)) {
            throw new BadRequestException('Invalid event ID');
        }

        return this.homeService.eventDetailsById(id);
    }



}
