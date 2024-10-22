import { Module } from '@nestjs/common';
import { ShortenerModule } from './modules/shortener/infra/shortener.module';
import { UserModule } from './modules/user/infra/user.module';
import { AuthModule } from './shared/auth/infra/auth.module';

@Module({
  imports: [ShortenerModule, UserModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
