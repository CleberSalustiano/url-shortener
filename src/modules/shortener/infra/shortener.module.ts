import { Module } from '@nestjs/common';
import { ShortenerService } from '../domain/shortener.service';
import { ShortenerController } from './shortener.controller';
import { PrismaService } from '../../../database/prisma.service';
import { AuthService } from '../../../shared/auth/domain/auth.service';
import ShortenedUrlRepository from './shortened-url.repository';
import { AuthModule } from '../../../shared/auth/infra/auth.module';

@Module({
  imports:[AuthModule],
  controllers: [ShortenerController],
  providers: [
    ShortenerService,
    PrismaService,
    AuthService,
    {
      provide: 'IShortenedUrlRepository',
      useClass: ShortenedUrlRepository,
    },
  ],
})
export class ShortenerModule {}
