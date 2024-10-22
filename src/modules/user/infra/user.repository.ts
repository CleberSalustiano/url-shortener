import { PrismaService } from "src/database/prisma.service";
import IUserRepository from "../domain/user.repository.interface";
import User from "../domain/user";
import { ICreateUserDTO } from "../domain/user.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class UserRepository implements IUserRepository {

  constructor(private prisma: PrismaService) {}

  async create(dto: ICreateUserDTO): Promise<User> {
      const user = await this.prisma.user.create({
        data: {
          name: dto.name,
          login: dto.login,
          password: dto.password,
        },
      });

      return user;
  }

  async findByLogin(login: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        login
      },
    });

    return user;
  }
}