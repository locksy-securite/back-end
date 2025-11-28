import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from './database/database.service';

@Controller()
export class AppController {
  constructor(private readonly dbService: DatabaseService) {}

  @Get('tables')
  async getTables() {
    const result = await this.dbService['pool'].query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE';"
    );
    return result.rows;
  }
}
