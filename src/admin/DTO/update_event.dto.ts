import {
    IsOptional,
    IsString,
    Matches,
    IsNumber,
    IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEventDto {
    @ApiProperty({ description: 'Title of the event', required: false })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({ description: 'Date of the event', type: String, format: 'date-time', required: false })
    @IsOptional()
    @IsDateString()
    date: string;

    @ApiProperty({ description: 'Time range of the event in format HH:mm AM/PM - HH:mm AM/PM', required: false })
    @IsOptional()
    @Matches(/^([0]?[1-9]|1[0-2]):[0-5][0-9] (AM|PM|am|pm) - ([0]?[1-9]|1[0-2]):[0-5][0-9] (AM|PM|am|pm)$/, {
        message: 'Time must be in format HH:mm AM/PM - HH:mm AM/PM',
    })
    timeRange?: string;

    @ApiProperty({ description: 'Description of the event', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: 'Location of the event', required: false })
    @IsOptional()
    @IsString()
    eventLocation?: string;

    @ApiProperty({ description: 'Capacity of the event', required: false })
    @IsOptional()
    @IsNumber()
    capacity?: number;

    @ApiProperty({ description: 'Tags for the event', required: false })
    @IsOptional()
    @IsString()
    tags?: string;

    @ApiProperty({ description: 'Image file name or URL', required: false })
    @IsOptional()
    @IsString()
    image?: string;
}
