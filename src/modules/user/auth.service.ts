import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  private readonly secretKey = Buffer.from(process.env.SECRET_KEY ?? "");

  async hashPassword(password: string): Promise<string> {
    try {
      const hashedPassword = await argon2.hash(password, {
        secret: this.secretKey,
        type: argon2.argon2id,
      });
      return hashedPassword;
    } catch (error) {
      throw new Error('Erro ao criptografar a senha');
    }
  }

  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      return await argon2.verify(hashedPassword, password, {
        secret: this.secretKey,
      });
    } catch (error) {
      throw new Error('Erro ao validar a senha');
    }
  }
}
