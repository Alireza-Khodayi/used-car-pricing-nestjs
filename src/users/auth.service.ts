import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

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
    // 1) Generate Salt
    const salt = randomBytes(8).toString('hex');
    // 2) Hash Salt and Password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    // 2) Hash Salt and Password together
    const result = salt + '.' + hash.toString('hex');
    // 3) Join the hashed result and salt together
    const user = await this.usersService.create(email, result);

    // Create a new user and save it
    // Return the new user
    return user;
  }

  async signIn(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Invalid email or password!');
    }

    return user;
  }
}
