import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiExcludeEndpoint()
  check() {
    return this.health.check([async () => this.db.pingCheck('database')]);
  }
}