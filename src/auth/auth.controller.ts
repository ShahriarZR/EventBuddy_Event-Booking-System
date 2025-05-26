import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './DTO/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @ApiOperation({ summary: 'User login' })
    @ApiResponse({ status: 201, description: 'User logged in successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiBody({ type: LoginDto })
    login(@Body() data: LoginDto) {
        return this.authService.login(data);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'User logout',
    description: 'You must include a valid JWT token in the Authorization header to access this endpoint.', })
    @ApiResponse({ status: 200, description: 'User logged out successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async logout(@Req() req: Request) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        return this.authService.logout(token);
    }
}
