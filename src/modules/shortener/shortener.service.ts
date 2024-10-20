import { Injectable } from '@nestjs/common';
import { AppError } from 'src/app.error';
import { PrismaService } from 'src/database/prisma.service';

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

  async shortenUrl(sourceUrl: string) {
    const path = this.generatePath();

    // TODO: Tratar "sourceUrl" vazia

    await this.prisma.urlShortener.create({
      data: {
        sourceUrl,
        shortnedUrlPath: path
      }
    });
    
    return path;
  }

  async findSourceUrl(shortnedUrlPath: string) {
    const result = await this.prisma.urlShortener.findFirst({
      where: {
        shortnedUrlPath
      }
    })

    if (!result) {
      throw new AppError("O link passado não existe", 404)
    }

    return result.sourceUrl;
  }

}
