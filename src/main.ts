/* eslint-disable @typescript-eslint/no-unused-vars */
import Debug from 'debug';
import { basename } from 'path';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { json, urlencoded } from 'body-parser';
import { getConnection } from 'typeorm';
import * as compression from 'compression';
import * as helmet from 'helmet';
import * as packageInfo from '../package.json';
import * as requestIp from 'request-ip';
import { AppModule } from './app.module';
import { ClassTransformOptions } from '@nestjs/common/interfaces/external/class-transform-options.interface';

require('dotenv').config();

const debug = Debug(`app:${basename(__dirname)}:${basename(__filename)}`);
const env = process.env.NODE_ENV;

if (!env) {
  console.log('No environment running');
  throw new Error('No environment running');
}

let app: NestExpressApplication;
declare const module: any;

async function bootstrap() {
  app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // logger: true
  });
  app.use(urlencoded({ extended: true }));
  app.use(json({ limit: '50mb' }));
  app.disable('x-powered-by');
  app.setViewEngine('hbs');
  app.use(compression());
  app.use(helmet()); // https://helmetjs.github.io/
  app.use(requestIp.mw());

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      // skipMissingProperties: true,
      // skipNullProperties: true,
      // skipUndefinedProperties: false,
      validationError: { target: false, value: false }, // object 와 value 역전송 막기
      transform: true,
      transformOptions: {
        excludeExtraneousValues: true,
      } as ClassTransformOptions, // version문제로 실제 있지만 여기 없음.. down casting
    }),
  );

  // Cors
  // see https://github.com/expressjs/cors#configuration-options
  app.enableCors({
    origin: '*',
    // origin: /\.nanudakitchen\.com$/,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Swagger
  if (process.env.NODE_ENV !== 'production') {
    const options = new DocumentBuilder()
      .setTitle(packageInfo.name.toUpperCase())
      .setDescription(packageInfo.description)
      .setVersion(packageInfo.version)
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('swagger', app, document);
  }
  // 8185 or 4000
  await app.listen(process.env.NODE_ENV === 'development' ? 4100 : 8200);

  const url = await app.getUrl();
  Logger.log(`${url}`, 'NestApplication');
  Logger.log(`${url}/swagger`, 'NestApplication');

  // HMR: Hot Reload (Webpack)
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
