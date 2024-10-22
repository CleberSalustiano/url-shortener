import { Inject, Injectable } from '@nestjs/common';
import { ICreateUserDTO } from './user.dto';
import { AuthService } from '../../../shared/auth/domain/auth.service';
import { AppError } from 'src/shared/errors/domain/app.error';
import IUserRepository from './user.repository.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject("IUserRepository")
    private userRepository: IUserRepository,
    private auth: AuthService,
  ) {}

  async createUser(dto: ICreateUserDTO) {
    const hashedPassword = await this.auth.hashPassword(dto.password);

    if (!dto.name || !dto.login || !dto.password) {
      throw new AppError('Informe os valores obrigatórios!', 400);
    }

    dto.password = hashedPassword;

    try {
      const user = await this.userRepository.create(dto);

      delete user.password;

      return user;
    } catch (e) {
      if (e.message.includes("login")) {
        throw new AppError("Esse login já existe", 400);
      } else {
        throw new Error("Internal Server Error");
      }
    }
  }

  async findUserByLogin(login: string) {
    const user = this.userRepository.findByLogin(login);

    return user;
  }
}
