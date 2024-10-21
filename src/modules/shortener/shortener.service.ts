import { Injectable } from '@nestjs/common';
import { AppError } from 'src/shared/errors/app.error';
import { PrismaService } from 'src/database/prisma.service';
import { ShortenedUrl } from './ShortenedUrl';

@Injectable()
export class ShortenerService {
  constructor(private prisma: PrismaService) {}

  private generatePath() {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    while (result.length < 6) {
      const randomChar = characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
      result += randomChar;
    }
    return result;
  }

  async createShortUrl(sourceUrl: string, userId: number) {
    const path = this.generatePath();
    // TODO: Verificar se o caminho já existe

    if (!sourceUrl) {
      throw new AppError('É necessário passar o caminho correto', 400);
    }

    await this.prisma.shortenedUrl.create({
      data: {
        sourceUrl,
        shortnedUrlPath: path,
        userId,
      },
    });

    return path;
  }

  async findSourceUrl(shortnedUrlPath: string) {
    const result: ShortenedUrl = await this.prisma.shortenedUrl.findFirst({
      where: {
        shortnedUrlPath,
      },
    });

    if (!result) {
      throw new AppError('O caminho passado não existe', 404);
    }

    return result;
  }

  async findAllByUserId(userId: number) {
    if (!userId) {
      throw new AppError('É necessário informar o id do usuário.', 400);
    }

    // TODO: Verificar se consegue deixar mais performático
    const result: ShortenedUrl[] = await this.prisma.shortenedUrl.findMany({
      where: {
        userId,
        deletedAt: null,
      },
    });

    for (let i = 0; i < result.length; i++) {
      const url = result[i];
      const count = await this.prisma.urlAccess.count({
        where: {
          shortenedUrlId: url.id,
        },
      });
      url.count = count;
    }

    return result;
  }

  async updateSourceUrl(sourceUrl: string, id: number) {
    if (!id) {
      throw new AppError('É necessário informar o id.', 400);
    }

    if (!sourceUrl) {
      throw new AppError('É necessário informar o caminho correto.', 400);
    }

    const result: ShortenedUrl = await this.prisma.shortenedUrl.update({
      where: {
        id: id,
      },
      data: {
        sourceUrl: sourceUrl,
      },
    });

    return result;
  }

  async deleteSourceUrl(id: number) {
    if (!id) {
      throw new AppError('É necessário informar o id.', 400);
    }

    await this.prisma.shortenedUrl.update({
      where: {
        id: id,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return 'Url deletada com sucesso!';
  }

  async urlAccessRecord(shortenedUrlId: number) {
    if (!shortenedUrlId) {
      throw new AppError('É necessário informar o id.', 400);
    }

    const urlAccess = await this.prisma.urlAccess.create({
      data: {
        shortenedUrlId: shortenedUrlId,
      },
    });

    return urlAccess;
  }
}
