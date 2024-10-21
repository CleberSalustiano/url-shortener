import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO, LoginUserDTO } from './user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async loginUser(@Body() loginUserDTO: LoginUserDTO) {
    return this.userService.loginUser(loginUserDTO);
  }

  @Post('create')
  async createUser(@Body() createUserDTO: CreateUserDTO) {
    return this.userService.createUser(createUserDTO);
  }

}
