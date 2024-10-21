export class CreateUserDTO {
  name: string;
  login: string;
  password: string;
}

export class LoginUserDTO {
  login: string;
  password: string;
}