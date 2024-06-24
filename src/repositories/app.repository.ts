import { Injectable } from '@nestjs/common'
import * as os from 'os'

@Injectable()
export class AppRepository {
  public async getEnv() {
    const environments = {
      nodeVersion: process.versions['node'],
      hostName: os.hostname(),
      platform: `${process.platform}/${process.arch}`,
    }
    return environments
  }
}
