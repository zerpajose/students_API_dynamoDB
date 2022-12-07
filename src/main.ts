import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { Express } from 'express';
import { Server } from 'http';
import { Context, Handler } from 'aws-lambda';
import { createServer, proxy, Response } from 'aws-serverless-express';
import * as express from 'express';

let cachedServer: Server;

process.on('unhandledRejection', (reason) => {
  console.error(reason);
})

process.on('uncaughtException', (reason) => {
  console.error(reason);
})

function setupSwagger(app: INestApplication){
  const options = new DocumentBuilder()
    .setTitle('Students')
    .setDescription('Students API')
    .setVersion('1.0')
    .addTag('students')
    .addTag('subject')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
}

async function createExpressApp(expressApp: Express,): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp),);

  const config = new DocumentBuilder()
                      .addApiKey({ type: 'apiKey', name: 'X-API-KEY', in: 'header' }, 'X-API-KEY')
                      .setTitle('Students API')
                      .addServer("/dev")
                      .setDescription("Students Test API")
                      .setVersion('v1')
                      .addTag('students')
                      .addTag('subjects')
                      .build();

  const options: SwaggerDocumentOptions =  {
    ignoreGlobalPrefix: true,
  };

  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('docs', app, document);

  app.setGlobalPrefix('');

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  return app;
}

async function bootstrap(): Promise<Server> {
  const expressApp = express();
  const app = await createExpressApp(expressApp);
  await app.init();
  return createServer(expressApp);
}

export async function handler(event: any, context: Context): Promise<Response> {
  if (!cachedServer) {
    const server = await bootstrap();
    cachedServer = server;
  }
  return proxy(cachedServer, event, context, 'PROMISE').promise;
}
