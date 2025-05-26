import { IsInt, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BookEventDto {

  @ApiProperty({ description: 'Number of seats to book', minimum: 1, maximum: 4 })
  @IsInt()
  @Min(1)
  @Max(4)
  seats: number;
}
