import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { BlacklistedAuthToken } from 'src/entity/blacklistedAuthToken.entity';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        private jwtService: JwtService,
        @InjectRepository(BlacklistedAuthToken) private blacklistedAuthTokenRepo: Repository<BlacklistedAuthToken>,
    ) { }

    async validateUser(email: string, password: string): Promise<User> {
        const user = await this.userRepo.findOne({
            where: { email },
            select: ['id', 'email', 'password', 'name', 'role'],
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return user;
    }

    async login(data) {
        const user = await this.validateUser(data.email, data.password);

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        return {
            accessToken: this.jwtService.sign(payload)
        };
    }

    async logout(token: string) {
        const blacklisted = this.blacklistedAuthTokenRepo.create({ token });
        await this.blacklistedAuthTokenRepo.save(blacklisted);
        return { message: 'Successfully logged out' };
    }
}
