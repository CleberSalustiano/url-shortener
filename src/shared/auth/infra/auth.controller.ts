import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../domain/auth.service';
import { ILoginUserDTO } from '../domain/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async loginUser(@Body() loginUserDTO: ILoginUserDTO) {
    return this.authService.login(loginUserDTO);
  }
}
