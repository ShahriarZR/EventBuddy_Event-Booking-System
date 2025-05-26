import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EventDto {
  @ApiProperty({ description: 'Title of the event' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Date of the event', type: String, format: 'date-time' })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'Time range of the event in format HH:mm AM/PM - HH:mm AM/PM' })
  @IsNotEmpty()
  @Matches(/^([0]?[1-9]|1[0-2]):[0-5][0-9] (AM|PM|am|pm) - ([0]?[1-9]|1[0-2]):[0-5][0-9] (AM|PM|am|pm)$/, {
    message: 'Time must be in format HH:mm AM/PM - HH:mm AM/PM',
  })
  timeRange: string;


  @ApiProperty({ description: 'Description of the event' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Location of the event' })
  @IsNotEmpty()
  @IsString()
  eventLocation: string;

  @ApiProperty({ description: 'Capacity of the event' })
  @IsNotEmpty()
  @IsNumber()
  capacity: number;

  @ApiProperty({ description: 'Tags for the event, e.g. "tech,free,networking"' })
  @IsNotEmpty()
  @IsString()
  tags: string;

  @ApiProperty({ description: 'Image file name or URL', required: false })
  @IsOptional()
  @IsString()
  image?: string;
}
