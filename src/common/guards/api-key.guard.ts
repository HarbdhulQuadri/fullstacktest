import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

/**
 * Global guard that enforces a shared admin API key.
 *
 * - When `ADMIN_API_KEY` is unset (local dev / tests) the guard is a no-op so
 *   the app stays usable without credentials.
 * - When set (production), every request must present the key via the
 *   `x-api-key` header or `Authorization: Bearer <key>`.
 *
 * For a browser SPA this key should be injected by a same-origin reverse proxy
 * rather than shipped to clients; CORS below restricts allowed origins.
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly configuredKey: string | undefined;

  constructor(config: ConfigService) {
    this.configuredKey = config.get<string>('ADMIN_API_KEY');
  }

  canActivate(context: ExecutionContext): boolean {
    if (!this.configuredKey) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    if (request.method === 'OPTIONS') {
      return true;
    }

    const provided =
      (request.headers['x-api-key'] as string | undefined) ??
      this.bearerToken(request);

    if (provided !== this.configuredKey) {
      throw new UnauthorizedException('Invalid or missing API key');
    }

    return true;
  }

  private bearerToken(request: Request): string | undefined {
    const auth = request.headers['authorization'];
    if (typeof auth === 'string' && auth.startsWith('Bearer ')) {
      return auth.slice(7);
    }
    return undefined;
  }
}
