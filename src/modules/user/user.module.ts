import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/database/prisma.service';
import { AuthService } from './auth.service';

@Module({
  controllers: [UserController],
  providers: [UserService, AuthService,PrismaService],
})
export class UserModule {}
