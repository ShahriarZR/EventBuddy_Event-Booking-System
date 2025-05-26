import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Event } from '../entity/event.entity';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BlacklistedAuthToken } from '../entity/blacklistedAuthToken.entity';
import { UserRegEvent } from 'src/entity/user_regEvent.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, BlacklistedAuthToken, UserRegEvent]),
    AuthModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, JwtAuthGuard],
})
export class AdminModule {}
