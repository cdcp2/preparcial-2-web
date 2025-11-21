import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class DeleteCountryGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const providedToken = request.header('x-country-delete-token');

    const expectedToken =
      this.configService.get<string>('COUNTRY_DELETE_TOKEN') ?? '';

    if (!expectedToken) {
      throw new ForbiddenException(
        'Country deletion is not configured on the server',
      );
    }

    if (typeof providedToken !== 'string') {
      throw new ForbiddenException('Missing deletion token');
    }

    if (providedToken !== expectedToken) {
      throw new ForbiddenException('Invalid deletion token');
    }

    return true;
  }
}
