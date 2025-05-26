import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlacklistedAuthToken } from 'src/entity/blacklistedAuthToken.entity';

@Injectable()
export class BlacklistedJwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    @InjectRepository(BlacklistedAuthToken)
    private blacklistAuthRepo: Repository<BlacklistedAuthToken>,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    const blacklisted = await this.blacklistAuthRepo.findOne({ where: { token } });
    if (blacklisted) {
      throw new UnauthorizedException('Token is blacklisted');
    }

    return super.canActivate(context) as boolean;
  }
}
