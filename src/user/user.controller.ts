import { Body, Controller, Delete, Get, ParseIntPipe, Post, Query, UseGuards, Request} from '@nestjs/common';
import { UserService } from './user.service';
import { NewUserDto } from './DTO/newUser.dto';
import { BookEventDto } from './DTO/bookEvent.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User registered successfully.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiBody({ type: NewUserDto })
    saveNewUser(@Body() data: NewUserDto) {
        return this.userService.saveNewUser(data);
    }

    @Post('bookEvent')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Book an event for the user',
    description: 'You must include a valid JWT token in the Authorization header to access this endpoint.', })
    @ApiResponse({ status: 200, description: 'Event booked successfully.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiQuery({ name: 'eventId', type: Number, description: 'ID of the event to book' })
    @ApiBody({ type: BookEventDto })
    bookEvent(
        @Request() req,
        @Query('eventId', ParseIntPipe) eventId: number,
        @Body() data: BookEventDto
    ) {
        const userId = req.user.id;
        return this.userService.bookEvent(userId, eventId, data.seats);
    }

    @Get('getUserEvents')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Get events booked by the user',
    description: 'You must include a valid JWT token in the Authorization header to access this endpoint.', })
    @ApiResponse({ status: 200, description: 'User events retrieved successfully.' })
    getUserEvents(
        @Request() req,
    ) {
        const userId = req.user.id;
        return this.userService.getUserEvents(userId);
    }

    @Get('browseMoreEvents')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Browse more events available',
    description: 'You must include a valid JWT token in the Authorization header to access this endpoint.', })
    @ApiResponse({ status: 200, description: 'More events retrieved successfully.' })
    browseMoreEvents() {
        return this.userService.browseMoreEvents();
    }

    @Delete('cancelBooking')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Cancel a booking for the user',
    description: 'You must include a valid JWT token in the Authorization header to access this endpoint.', })
    @ApiResponse({ status: 200, description: 'Booking cancelled successfully.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiQuery({ name: 'eventId', type: Number, description: 'ID of the event to cancel booking' })
    cancelBooking(
        @Request() req,
        @Query('eventId', ParseIntPipe) eventId: number
    ) {
        const userId = req.user.id;
        return this.userService.cancelBooking(userId, eventId);
    }
}
