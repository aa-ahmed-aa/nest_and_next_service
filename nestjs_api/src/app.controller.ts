import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/decisionengine')
  getDecision(@Req() req, @Res() res): string {
    const result = this.appService.getDecision(req);
    return res.status(200).json(result);
  }
}
