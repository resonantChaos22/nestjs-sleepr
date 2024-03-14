import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { AUTH_SERVICE } from '../constants';
import { UserDto } from '../dto';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  canActivate(context: ExecutionContext): boolean | Observable<boolean> {
    const jwt = (context.switchToHttp().getRequest() as Request).cookies
      ?.Authentication;

    if (!jwt) {
      return false;
    }

    return this.authClient
      .send<UserDto>('authenticate', {
        Authentication: jwt,
      })
      .pipe(
        tap((res) => {
          context.switchToHttp().getRequest().user = res;
        }),
        map(() => true),
        catchError((error) => {
          console.error(error);
          return of(false);
        }),
      );
  }
}
