import { ICreateUserDTO } from './user.dto';
import User from "./user"

export default interface IUserRepository {
  create(dto: ICreateUserDTO): Promise<User>;
  findByLogin(login: string): Promise<User>
}
