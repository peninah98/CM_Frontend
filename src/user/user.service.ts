import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './interfaces/user.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private users: User[] = [];import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './interfaces/user.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private users: User[] = [];
  private nextId = 1;

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    // Check if user with email already exists
    const existingUser = this.users.find(user => user.email === createUserDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create new user
    const newUser: User = {
      id: this.nextId++,
      ...createUserDto,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(newUser);

    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  findAll(): Omit<User, 'password'>[] {
    return this.users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  findOne(id: number): Omit<User, 'password'> {
    const user = this.users.find(user => user.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<Omit<User, 'password'>> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check if email is being updated and if it already exists
    if (updateUserDto.email) {
      const existingUser = this.users.find(user => user.email === updateUserDto.email && user.id !== id);
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    // Hash password if it's being updated
    let hashedPassword: string | undefined;
    if (updateUserDto.password) {
      hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Update user
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updateUserDto,
      ...(hashedPassword && { password: hashedPassword }),
      updatedAt: new Date(),
    };

    const { password, ...userWithoutPassword } = this.users[userIndex];
    return userWithoutPassword;
  }

  remove(id: number): { message: string } {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    this.users.splice(userIndex, 1);
    return { message: `User with ID ${id} has been successfully deleted` };
  }

  // Additional utility methods
  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  async validateUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }
}
  private nextId = 1;

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    // Check if user with email already exists
    const existingUser = this.users.find(user => user.email === createUserDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create new user
    const newUser: User = {
      id: this.nextId++,
      ...createUserDto,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(newUser);

    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  findAll(): Omit<User, 'password'>[] {
    return this.users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  findOne(id: number): Omit<User, 'password'> {
    const user = this.users.find(user => user.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<Omit<User, 'password'>> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check if email is being updated and if it already exists
    if (updateUserDto.email) {
      const existingUser = this.users.find(user => user.email === updateUserDto.email && user.id !== id);
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    // Hash password if it's being updated
    let hashedPassword: string | undefined;
    if (updateUserDto.password) {
      hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Update user
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updateUserDto,
      ...(hashedPassword && { password: hashedPassword }),
      updatedAt: new Date(),
    };

    const { password, ...userWithoutPassword } = this.users[userIndex];
    return userWithoutPassword;
  }

  remove(id: number): { message: string } {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    this.users.splice(userIndex, 1);
    return { message: `User with ID ${id} has been successfully deleted` };
  }

  // Additional utility methods
  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  async validateUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }
}
