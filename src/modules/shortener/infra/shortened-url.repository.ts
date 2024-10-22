import { Injectable } from '@nestjs/common';
import IShortenedUrlRepository from '../domain/shortened-url.repository.interface';
import ShortenedUrl from '../domain/shortened-url.entity';
import { PrismaService } from '../../../database/prisma.service';
import UrlAccess from '../domain/url-access.entity';

@Injectable()
export default class ShortenedUrlRepository implements IShortenedUrlRepository {
  constructor(private prisma: PrismaService) {}

  async create({
    sourceUrl,
    shortenedUrlPath,
    userId,
  }): Promise<ShortenedUrl> {
    return await this.prisma.shortenedUrl.create({
      data: {
        sourceUrl,
        shortenedUrlPath,
        userId,
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.shortenedUrl.update({
      where: {
        id: id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async findAllByUserId(userId: number): Promise<ShortenedUrl[]> {
    const result= await this.prisma.shortenedUrl.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      include: {
        _count: {
          select: { UrlAccess: true },
        },
      },
    });

    const urls = result.map(url => {
      const newUrls = {
        ...url,
        count: url._count.UrlAccess,
      }

      delete newUrls._count;

      return newUrls;
    });

    return urls;
  }

  async findByShortenedUrlPath(shortenedUrlPath: string): Promise<ShortenedUrl> {
    const result: ShortenedUrl = await this.prisma.shortenedUrl.findFirst({
      where: {
        shortenedUrlPath,
      },
    });

    return result;
  }

  async update({ id, sourceUrl }): Promise<ShortenedUrl> {
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

  async urlAccessRecord(shortenedUrlId: number): Promise<UrlAccess> {
    const urlAccess = await this.prisma.urlAccess.create({
      data: {
        shortenedUrlId,
      },
    });

    return urlAccess;
  }
}
