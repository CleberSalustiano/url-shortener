import { Inject, Injectable } from '@nestjs/common';
import { AppError } from 'src/shared/errors/domain/app.error';
import ShortenedUrl from './shortenedUrl';
import IShortenedUrlRepository from './shortenedUrl.repository.interface';

@Injectable()
export class ShortenerService {
  constructor(
    @Inject('IShortenedUrlRepository')
    private shortenedUrlRepository: IShortenedUrlRepository,
  ) {}

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
    let alreadyExistPath = true;
    let path : string;
    
    do {
      path = this.generatePath();
      const existShortenedUrl =
        await this.shortenedUrlRepository.findByShortenedUrlPath(path);

      if (!existShortenedUrl) alreadyExistPath = false

    } while (alreadyExistPath);

    if (!sourceUrl) {
      throw new AppError('É necessário passar o caminho correto', 400);
    }

    await this.shortenedUrlRepository.create({
      sourceUrl,
      shortenedUrlPath: path,
      userId,
    });

    return path;
  }

  async findSourceUrl(shortenedUrlPath: string) {
    const result =
      await this.shortenedUrlRepository.findByShortenedUrlPath(
        shortenedUrlPath,
      );

    if (!result) {
      throw new AppError('O caminho passado não existe', 404);
    }

    return result;
  }

  async findAllByUserId(userId: number) {
    if (!userId) {
      throw new AppError('É necessário informar o id do usuário.', 400);
    }

    const result: ShortenedUrl[] =
      await this.shortenedUrlRepository.findAllByUserId(userId);

    return result;
  }

  async updateSourceUrl(sourceUrl: string, id: number) {
    if (!id) {
      throw new AppError('É necessário informar o id.', 400);
    }

    if (!sourceUrl) {
      throw new AppError('É necessário informar o caminho correto.', 400);
    }

    const result: ShortenedUrl = await this.shortenedUrlRepository.update({
      id,
      sourceUrl,
    });

    return result;
  }

  async deleteSourceUrl(id: number) {
    if (!id) {
      throw new AppError('É necessário informar o id.', 400);
    }

    await this.shortenedUrlRepository.delete(id);

    return 'Url deletada com sucesso!';
  }

  async urlAccessRecord(shortenedUrlId: number) {
    if (!shortenedUrlId) {
      throw new AppError('É necessário informar o id.', 400);
    }

    const urlAccess =
      await this.shortenedUrlRepository.urlAccessRecord(shortenedUrlId);

    return urlAccess;
  }
}
