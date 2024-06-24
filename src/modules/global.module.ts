import {
  MiddlewareConsumer,
  Module,
  NestMiddleware,
  NestModule,
} from '@nestjs/common'
import { AppModule } from './app.module'
import appConfig from 'src/config/app.config'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { LoggerMiddleware } from 'src/middleware/logger.middleware'
import { v4 as uuidv4 } from 'uuid'
import { LoggerModule } from 'nestjs-pino'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: `${process.cwd()}/src/config/env/.env.${process.env.NODE_ENV}`,
    }),
    /*LoggerModule.forRoot({
      pinoHttp: {
        customProps: (req, res) => ({
          context: 'HTTP'
        }),
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            levelFirst: true,
            translateTime: 'UTC:mm/dd/yyyy, h:MM:ss TT Z',
            singleLine: true
          }
        }
      }
    }),*/
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        //await somePromise(); // Any initialization logic if needed
        return {
          pinoHttp: {
            customProps: (req, res) => ({
              context: 'HTTP',
            }),
            transport: {
              target: 'pino-pretty',
              options: {
                colorize: true,
                levelFirst: true,
                translateTime: 'UTC:mm/dd/yyyy, h:MM:ss TT Z',
                singleLine: true,
              },
            },
            level: 'info', //config.get('LOG_LEVEL'), // Or any other config value
            genReqId: (request) =>
              request.headers['x-correlation-id'] || uuidv4(),
          },
        }
      },
    }),
    //LoggerModule.forRoot({ pinoHttp: { level: 'info' } }),
    AppModule,
  ],
  controllers: [],
})
export class GlobalModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
