export interface ICreateUserDTO {
  name: string;
  login: string;
  password: string;
}

export interface ILoginUserDTO {
  login: string;
  password: string;
}