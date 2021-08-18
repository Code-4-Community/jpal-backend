import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import * as Sentry from '@sentry/minimal';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap({
        error: (exception) => {
          Sentry.captureException(exception, (scope) => {
            scope.clear();
            // TODO: Set user info from cognito either here or in the cognito guard (email, uid):  scope.setUser({ id: '4711' });
            // https://docs.sentry.io/platforms/node/enriching-events/context/
            const request = context.switchToHttp().getRequest();
            scope.setExtra('request_headers', request.headers);
            scope.setExtra('request_body', request.body);
            return scope;
          });
        },
      }),
    );
  }
}
