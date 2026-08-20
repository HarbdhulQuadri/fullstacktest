import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

interface ErrorResponseBody {
  error: true;
  code: string;
  message: string;
  timestamp: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const { status, code, message } = this.resolveError(exception);

    const body: ErrorResponseBody = {
      error: true,
      code,
      message,
      timestamp: new Date().toISOString(),
    };

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `Unhandled error [${code}]: ${message}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    response.status(status).json(body);
  }

  private resolveError(exception: unknown): {
    status: number;
    code: string;
    message: string;
  } {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      const message = this.extractMessage(response);
      return {
        status,
        code: `HTTP_${status}`,
        message,
      };
    }

    if (exception instanceof QueryFailedError) {
      return {
        status: HttpStatus.BAD_REQUEST,
        code: 'DATABASE_ERROR',
        message: 'A database error occurred while processing the request.',
      };
    }

    if (exception instanceof Error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        code: exception.name || 'INTERNAL_ERROR',
        message: 'An unexpected internal error occurred.',
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred.',
    };
  }

  private extractMessage(response: unknown): string {
    if (typeof response === 'string') {
      return response;
    }

    if (typeof response === 'object' && response !== null) {
      const candidate = response as Record<string, unknown>;

      if (Array.isArray(candidate.message)) {
        return (candidate.message as unknown[])
          .map((item) => (typeof item === 'string' ? item : JSON.stringify(item)))
          .join('; ');
      }

      if (typeof candidate.message === 'string') {
        return candidate.message;
      }

      if (typeof candidate.error === 'string') {
        return candidate.error;
      }
    }

    return 'An error occurred.';
  }
}
