import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDTO, LoginUserDTO } from './user.dto';
import { AuthService } from './auth.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private auth: AuthService,
  ) {}

  async createUser(dto: CreateUserDTO) {
    const hashedPassword = await this.auth.hashPassword(dto.password);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        login: dto.login,
        password: hashedPassword,
      },
    });

    return user;
  }

  async loginUser(dto: LoginUserDTO) {
    if (!dto.login || !dto.password) {
      throw new Error('Usuário ou senha inválidos');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        login: dto.login,
      },
    });
  
    if (!user) {
      throw new Error('Usuário ou senha inválidos');
    }
  
    const isPasswordValid = await this.auth.validatePassword(
      dto.password,
      user.password,
    );
  
    if (!isPasswordValid) {
      throw new Error('Usuário ou senha inválidos');
    }
  
    return user;
  }
}
