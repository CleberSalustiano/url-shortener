import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ShortenerService } from './shortener.service';
import {
  ICreateShortenedUrlDTO,
  IUpdateShortenedUrlDTO,
} from './shortener.dto';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/shared/auth/auth.guard';
import { AuthService } from 'src/shared/auth/auth.service';

@Controller()
export class ShortenerController {
  constructor(
    private readonly shortenerService: ShortenerService,
    private readonly authService: AuthService,
  ) {}

  @Post('shorten')
  async shortenUrl(
    @Req() request: Request,
    @Body() { sourceUrl }: ICreateShortenedUrlDTO,
  ) {
    let userId: number;
    if (request.headers.authorization) {
      const [, token] = request.headers.authorization.split(' ');
      const payload = await this.authService.validateToken(token);
      userId = payload.id;
    }
    const path = await this.shortenerService.createShortUrl(sourceUrl, userId);
    return `${request.protocol}://${request.get('host')}/${path}`;
  }

  @Get(':shortnedUrlPath')
  async sourceUrlRedirect(
    @Res() response: Response,
    @Param('shortnedUrlPath') shortnedUrlPath: string,
  ) {
    const url = await this.shortenerService.findSourceUrl(shortnedUrlPath);
    this.shortenerService.urlAccessRecord(url.id);
    return response.redirect(url.sourceUrl);
  }

  @UseGuards(AuthGuard)
  @Get('shortened/urls')
  async getAllUrls(@Req() request) {
    const userId = request.user.id;
    const urls = await this.shortenerService.findAllByUserId(userId);
    return urls;
  }

  @UseGuards(AuthGuard)
  @Put('shortened/url/:id')
  async updateSourceUrl(
    @Req() request,
    @Body() { sourceUrl }: IUpdateShortenedUrlDTO,
    @Param('id') id: string,
  ) {
    const urlShortenedId = Number(id);
    return await this.shortenerService.updateSourceUrl(
      sourceUrl,
      urlShortenedId,
    );
  }

  @HttpCode(204)
  @UseGuards(AuthGuard)
  @Delete('shortened/url/:id')
  async deleteSourceUrl(@Req() request, @Param('id') id: string) {
    const shortnedUrlId = Number(id);
    return await this.shortenerService.deleteSourceUrl(shortnedUrlId);
  }
}
