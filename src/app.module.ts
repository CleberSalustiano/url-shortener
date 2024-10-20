import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ShortenerModule } from './modules/shortener/shortener.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [ShortenerModule, UserModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
