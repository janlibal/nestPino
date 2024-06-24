import { Module } from '@nestjs/common'
import { AppController } from '../controllers/app.controller'
import { AppService } from '../operations/app.service'
import { AppRepository } from 'src/repositories/app.repository'

@Module({
  controllers: [AppController],
  providers: [AppService, AppRepository],
  exports: [AppModule],
})
export class AppModule {}
