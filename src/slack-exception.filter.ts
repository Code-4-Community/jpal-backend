import { HttpService } from '@nestjs/axios';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { take } from 'rxjs/operators';

const webhookUrl = process.env.SLACK_WEBHOOK_URL;

@Catch(HttpException)
export class SlackExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpService: HttpService) {
    this.httpService = httpService;
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const slackMessage =
      `<!channel>\n\`${status} ${request.method} ${request.url}\`\n` +
      `\`\`\`\n${JSON.stringify(request.headers, null, 2)}\n\`\`\`\n` +
      `\`\`\`\n${JSON.stringify(request.body, null, 2)}\n\`\`\``;

    this.httpService
      .post(webhookUrl, { text: slackMessage })
      .pipe(take(1))
      .subscribe();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
