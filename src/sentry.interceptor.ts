import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SpanStatus } from '@sentry/tracing';
@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const transaction = Sentry.startTransaction({
      op: 'transaction',
      name: `${request.method} ${request.path}`,
      traceId: request.headers['sentry-trace'] || undefined,
    });

    return next.handle().pipe(
      tap({
        error: (exception) => {
          Sentry.captureException(exception, (scope) => {
            // TODO: Set user info from cognito either here or in the cognito guard (email, uid):  scope.setUser({ id: '4711' });
            // https://docs.sentry.io/platforms/node/enriching-events/context/
            const request = context.switchToHttp().getRequest();
            scope.setExtra('request_headers', request.headers);
            scope.setExtra('request_body', request.body);
            return scope;
          });
        },
      }),
      tap(() => {
        const response = context.switchToHttp().getResponse();
        transaction.setStatus(SpanStatus.fromHttpCode(response.statusCode));
        transaction.finish();
      }),
    );
  }
}
