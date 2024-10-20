import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Redirect,
  Req,
  Res,
} from '@nestjs/common';
import { ShortenerService } from './shortener.service';
import { CreateShortenedUrlDTO } from './shortener.dto';
import { Request, Response } from 'express';
import { AppError } from 'src/app.error';

@Controller()
export class ShortenerController {
  constructor(private readonly shortenerService: ShortenerService) {}

  @Post('shorten')
  async shortenUrl(
    @Req() request: Request,
    @Body() { sourceUrl }: CreateShortenedUrlDTO,
  ) {
    const path = await this.shortenerService.shortenUrl(sourceUrl);
    return `${request.protocol}://${request.get('host')}/${path}`;
  }

  @Get(':shortnedUrlPath')
  async sourceUrlRedirect(
    @Res() response: Response,
    @Param('shortnedUrlPath') shortnedUrlPath: string,
  ) {
    // TODO: Melhorar essa ideia de validação
    try {
      const url = await this.shortenerService.findSourceUrl(shortnedUrlPath);
      // TODO: contabilizar a visitia desse url
      return response.redirect(url);
    } catch (error: AppError | any) {
      return response.status(error?.statusCode).send(error.message);
    }
  }
}
