import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("register")
    async register(
        @Body("email") email: string,
        @Body("name") name: string,
        @Body("password") password: string
    ) {
        return this.authService.register(email, name, password);
    }

    @Post("login")
    async login(
        @Body("email") email: string,
        @Body("password") password: string
    ) {
        const user = await this.authService.validateUser(email, password);

        if (!user) {
            throw new Error("Invalid credentials");
        }

        return this.authService.login(user);
    }
}
