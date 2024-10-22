import { Module } from '@nestjs/common';
import { ShortenerService } from '../domain/shortener.service';
import { ShortenerController } from './shortener.controller';
import { PrismaService } from 'src/database/prisma.service';
import { AuthService } from 'src/shared/auth/domain/auth.service';
import ShortenedUrlRepository from './shortenedUrl.repository';
import { AuthModule } from 'src/shared/auth/infra/auth.module';

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
