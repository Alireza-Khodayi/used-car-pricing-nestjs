import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signUp(email: string, password: string) {
    // See if email in use
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('Email already in use!');
    }
    // Hash the users password
    // Create a new user and save it
    // Return the new user
  }

  signIn(email: string, password: string) {}
}
