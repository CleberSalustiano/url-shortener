import { Module } from '@nestjs/common';
import { UserService } from '../domain/user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/database/prisma.service';
import { AuthService } from '../../../shared/auth/domain/auth.service';
import UserRepository from './user.repository';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    AuthService,
    PrismaService,
    { provide: 'IUserRepository', useClass: UserRepository },
  ],
  exports: ["IUserRepository"],
})
export class UserModule {}
