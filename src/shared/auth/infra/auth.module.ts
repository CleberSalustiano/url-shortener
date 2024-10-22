import { Module } from '@nestjs/common';
import { AuthService } from '../domain/auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../../../database/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../../../modules/user/infra/user.module';
import UserRepository from '../../../modules/user/infra/user.repository';

@Module({
  imports: [
    PassportModule,
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY ?? '',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    { provide: 'IUserRepository', useClass: UserRepository },
  ],
  exports: ["IUserRepository"]
})
export class AuthModule {}
