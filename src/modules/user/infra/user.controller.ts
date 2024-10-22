import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from '../domain/user.service';
import { ICreateUserDTO } from '../domain/user.dto';

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDTO: ICreateUserDTO) {
    return this.userService.createUser(createUserDTO);
  }

}
