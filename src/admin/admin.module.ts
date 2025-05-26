import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Event } from '../entity/event.entity';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BlacklistedAuthToken } from '../entity/blacklistedAuthToken.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, BlacklistedAuthToken]),
    AuthModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, JwtAuthGuard],
})
export class AdminModule {}
