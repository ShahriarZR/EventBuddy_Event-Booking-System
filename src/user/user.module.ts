import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from 'src/entity/user.entity';
import { Event } from 'src/entity/event.entity';
import { UserRegEvent } from 'src/entity/user_regEvent.entity';
import { BlacklistedAuthToken } from 'src/entity/blacklistedAuthToken.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User, Event, UserRegEvent, BlacklistedAuthToken]), AuthModule,],
  controllers: [UserController],
  providers: [UserService, JwtAuthGuard],
})
export class UserModule {}
