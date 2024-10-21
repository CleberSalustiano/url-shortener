import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { ICreateUserDTO, ILoginUserDTO } from './user.dto';
import { AuthService } from '../../shared/auth/auth.service';
import { AppError } from 'src/shared/errors/app.error';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private auth: AuthService,
  ) {}

  async createUser(dto: ICreateUserDTO) {
    const hashedPassword = await this.auth.hashPassword(dto.password);

    if (!dto.name || !dto.login || !dto.password) {
      throw new AppError('Informe os valores obrigatórios!', 400);
    }

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        login: dto.login,
        password: hashedPassword,
      },
    });

    delete user.password;

    return user;
  }
}
