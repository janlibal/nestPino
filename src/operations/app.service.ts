import { Injectable } from '@nestjs/common'
import * as pkginfo from '../../package.json'
import { AppRepository } from 'src/repositories/app.repository'
import { Logger } from 'nestjs-pino'

@Injectable()
export class AppService {
  constructor(private readonly appRepository: AppRepository, private readonly logger: Logger) {}
  public async compileData() {
    this.logger.log('Stareted to retrieve data')
    const env = await this.appRepository.getEnv()
    if(!env){
      this.logger.fatal('Fatal env issue!')
    }
    const data = {
      name: pkginfo.name,
      version: pkginfo.version,
      description: pkginfo.description,
      env,
    }
    //this.logger.log({ id: 'retrieve all errors'}, 'retrieve all app data')
    this.logger.log('Finished retrieving data')
    return data
  }
}
