import { ExceptionFilter, Catch, ArgumentsHost, HttpException, InternalServerErrorException } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppError } from './app.error'; 

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof AppError) {
      return response.status(exception.statusCode).json({
        status: 'error',
        message: exception.message,
      });
    }

    const status = 
      exception instanceof HttpException 
        ? exception.getStatus() 
        : 500;

    console.error(exception);

    return response.status(status).json({
      status: 'error',
      message: status === 500 ? 'Internal server error' : (exception as any).message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
