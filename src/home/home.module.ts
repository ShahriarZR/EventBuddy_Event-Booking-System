import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeController } from './home.controller';
import { Event } from 'src/entity/event.entity';
@Module({
    imports: [TypeOrmModule.forFeature([Event])],
    controllers: [HomeController],
  providers: [HomeService]
})
export class HomeModule {}
