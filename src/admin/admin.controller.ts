import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AdminService } from './admin.service';
import { EventDto } from './DTO/event.dto';
import { UpdateEventDto } from './DTO/update_event.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { isBefore, startOfDay } from 'date-fns';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiQuery } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiTags('Admin')
@ApiBearerAuth('access-token')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Post('createNewEvent')
  @ApiOperation({
    summary: 'Create a new event',
    description: 'You must include a valid JWT token in the Authorization header to access this endpoint.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Event data with image file',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Title of the event', example: '' },
        date: { type: 'string', format: 'date-time', description: 'Date of the event', example: ''  },
        timeRange: {
          type: 'string',
          description: 'Time range in format HH:mm AM/PM - HH:mm AM/PM', example: '' 
        },
        description: { type: 'string', description: 'Description of the event', example: ''  },
        eventLocation: { type: 'string', description: 'Location of the event', example: ''  },
        capacity: { type: 'integer', description: 'Capacity of the event', example: ''  },
        tags: { type: 'string', description: 'Tags for the event, e.g. "tech,free,networking"', example: ''  },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Image file upload (JPG or PNG)',
        },
      },
      required: ['title', 'date', 'timeRange', 'description', 'eventLocation', 'capacity', 'tags', 'image'],
    },
  })
  @ApiResponse({ status: 201, description: 'Event created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, file.originalname); 
        },
      }),
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname).toLowerCase();
        if (ext !== '.jpg' && ext !== '.png') {
          return cb(
            new BadRequestException('Only .jpg or .png files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async createEvent(
    @Request() req,
    @Body() data: EventDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (req.user.role !== 'admin') {
      throw new BadRequestException('Access denied');
    }
    if (!image) {
      throw new BadRequestException('Image file is required');
    }
    const inputDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isBefore(inputDate, startOfDay(today))) {
      throw new BadRequestException('Invalid date: Event date must be in the future');
    }

    const [start, end] = data.timeRange.split(' - ');

    const startTime = new Date(`${data.date} ${start}`);
    const endTime = new Date(`${data.date} ${end}`);

    if (startTime >= endTime) {
      throw new BadRequestException('Invalid time range: Start time must be before end time');
    }
    return this.adminService.createNewEvent(data, image?.filename);
  }

  @Patch('updateEvent')
  @ApiOperation({
    summary: 'Update an existing event',
    description: 'You must include a valid JWT token in the Authorization header to access this endpoint.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Event data with image file',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Title of the event', example: ''  },
        date: { type: 'string', format: 'date-time', description: 'Date of the event', example: ''  },
        timeRange: {
          type: 'string',
          description: 'Time range in format HH:mm AM/PM - HH:mm AM/PM', example: '' ,
        },
        description: { type: 'string', description: 'Description of the event', example: ''  },
        eventLocation: { type: 'string', description: 'Location of the event', example: ''  },
        capacity: { type: 'integer', description: 'Capacity of the event', example: ''  },
        tags: { type: 'string', description: 'Tags for the event, e.g. "tech,free,networking"', example: ''  },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Image file upload (JPG or PNG)',
        },
      }
    },
  })
  @ApiResponse({ status: 200, description: 'Event updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiQuery({ name: 'id', type: Number, description: 'ID of the event to update' })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, file.originalname); 
        },
      }),
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname).toLowerCase();
        if (ext !== '.jpg' && ext !== '.png') {
          return cb(
            new BadRequestException('Only .jpg or .png files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async updateEvent(
    @Request() req,
    @Query('eventId', ParseIntPipe) id: number,
    @Body() data: UpdateEventDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (req.user.role !== 'admin') {
      throw new BadRequestException('Access denied!');
    }
    if (data.date) {
      const inputDate = new Date(data.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); 

      if (isBefore(inputDate, startOfDay(today))) {
        throw new BadRequestException('Invalid date: Event date must be in the future');
      }
    }

    if (data.timeRange) {
      const [start, end] = data.timeRange.split(' - ');

      const startTime = new Date(`${data.date} ${start}`);
      const endTime = new Date(`${data.date} ${end}`);

      if (startTime >= endTime) {
        throw new BadRequestException('Invalid time range: Start time must be before end time');
      }
    }
    return this.adminService.updateEvent(id, data, image?.filename);
  }

  @Delete('deleteEvent')
  @ApiOperation({
    summary: 'Delete an event by ID',
    description: 'You must include a valid JWT token in the Authorization header to access this endpoint.',
  })
  @ApiResponse({ status: 200, description: 'Event deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiQuery({ name: 'id', type: Number, description: 'ID of the event to delete' })
  async deleteEvent(
    @Request() req,
    @Query('eventId', ParseIntPipe) id: number,
  ) {
    if (req.user.role !== 'admin') {
      throw new BadRequestException('Access denied!');
    }
    return this.adminService.deleteEvent(id);
  }

  @Get('getAllEvents')
  @ApiOperation({
    summary: 'Get all events',
    description: 'You must include a valid JWT token in the Authorization header to access this endpoint.',
  })
  @ApiResponse({ status: 200, description: 'List of all events.' })
  async getAllEvents(
    @Request() req,
  ) {
    if (req.user.role !== 'admin') {
      throw new BadRequestException('Access denied!');
    }
    return this.adminService.getAllEvents();
  }
}
