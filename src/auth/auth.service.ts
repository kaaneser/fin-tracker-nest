import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { User } from './schema/user.schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcryptjs";
import { JwtPayload } from 'src/helper/jwt-payload.interface';


@Injectable()
export class AuthService {
    constructor(
        @InjectModel("User") private userModel: Model<User>,
        private jwtService: JwtService,
    ) {}

    async register(email: string, name: string, password: string): Promise<User>
    {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new this.userModel({
            email,
            name,
            password: hashedPassword
        });

        return newUser.save();
    }

    async validateUser(email: string, password: string): Promise<any>
    {
        const user = await this.userModel.findOne({ email });

        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) return null;

        return { id: user.id, email: user.email, name: user.name };
    }

    async login(user: any) {
        const payload: JwtPayload = { email: user.email, sub: user.id };

        return {
            access_token: this.jwtService.sign(payload)
        };
    }
}
