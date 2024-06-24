import { NestFactory } from '@nestjs/core'
import { GlobalModule } from './modules/global.module'
import { useContainer } from 'class-validator'
import { AllConfigType } from './types/config.type'
import { ConfigService } from '@nestjs/config'
import { API_PREFIX } from './shared/constants/global.constants'
import helmet from 'helmet'
import * as rateLimit from 'express-rate-limit'
import * as compression from 'compression'
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino'
import { InternalDisabledLogger } from './utils/internal.disabled.logger'

async function bootstrap() {
  const app = await NestFactory.create(GlobalModule, {
    cors: true,
    logger: new InternalDisabledLogger(),
    bufferLogs: true,
  })

  //app.useLogger(app.get(Logger))

  useContainer(app.select(GlobalModule), { fallbackOnErrors: true })

  app.useGlobalInterceptors(new LoggerErrorInterceptor())

  const configService = app.get(ConfigService<AllConfigType>)

  app.setGlobalPrefix(API_PREFIX)

  app.use(helmet())

  app.use(compression())

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  )

  const logger = await app.resolve(Logger)
  const appName = configService.getOrThrow('app.name', { infer: true })
  const port = configService.getOrThrow('app.port', { infer: true })

  await app.listen(port, () => {
    logger.log(`App ${appName} started listening on ${port}`)
  })
}
bootstrap()
