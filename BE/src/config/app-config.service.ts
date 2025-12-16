import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: NestConfigService) {}

  get port(): number {
    return this.configService.get<number>('PORT', 3000);
  }

  get databaseConfig() {
    return {
      type: this.configService.get<string>('DATABASE_TYPE', 'mysql'),
      host: this.configService.get<string>('DATABASE_HOST', 'localhost'),
      port: this.configService.get<number>('DATABASE_PORT', 3306),
      user: this.configService.get<string>('DATABASE_USER', 'root'),
      password: this.configService.get<string>('DATABASE_PASSWORD', ''),
      databaseName: this.configService.get<string>('DATABASE_NAME', 'genglish'),
      sync: this.configService.get<boolean>('DATABASE_SYNC', false),
    };
  }

  get defaultUserRole(): string {
    return this.configService.get<string>('USER_DEFAULT_ROLE', 'user');
  }
}
