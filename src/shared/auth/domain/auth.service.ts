import { Inject, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { AppError } from '../../../shared/errors/domain/app.error';
import { ILoginUserDTO } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import IUserRepository from '../../../modules/user/domain/user.repository.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject("IUserRepository")
    private userRepository: IUserRepository,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    try {
      const hashedPassword = await argon2.hash(password, {
        secret: Buffer.from(process.env.PASSWORD_SECRET_KEY ?? ''),
        type: argon2.argon2id,
      });
      return hashedPassword;
    } catch (error) {
      throw new AppError('Erro ao criptografar a senha', 500);
    }
  }

  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      return await argon2.verify(hashedPassword, password, {
        secret: Buffer.from(process.env.PASSWORD_SECRET_KEY ?? ''),
      });
    } catch (error) {
      throw new AppError('Erro ao validar a senha', 500);
    }
  }

  async login(dto: ILoginUserDTO) {
    if (!dto.login || !dto.password) {
      throw new AppError('Usuário ou senha inválidos', 400);
    }

    const user = await this.userRepository.findByLogin(dto.login)

    if (!user) {
      throw new AppError('Usuário ou senha inválidos', 400);
    }

    const isPasswordValid = await this.validatePassword(
      dto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new AppError('Usuário ou senha inválidos', 400);
    }

    return {
      access_token: await this.jwtService.signAsync({
        id: user.id,
      }),
    };
  }

  async validateToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY ?? '',
      });

      return payload;
    } catch {
      throw new AppError('Token inválido', 401);
    }
  }
}
