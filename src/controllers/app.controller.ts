import { Controller, Get } from '@nestjs/common'
import { AppService } from 'src/operations/app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('/')
  public async getApiInfo() {
    const data = await this.appService.compileData()
    return data
  }
}
