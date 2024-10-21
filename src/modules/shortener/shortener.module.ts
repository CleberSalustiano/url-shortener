import { Module } from '@nestjs/common';
import { ShortenerService } from './shortener.service';
import { ShortenerController } from './shortener.controller';
import { PrismaService } from 'src/database/prisma.service';
import { AuthService } from 'src/shared/auth/auth.service';

@Module({
  controllers: [ShortenerController],
  providers: [ShortenerService, PrismaService, AuthService],
})
export class ShortenerModule {}
