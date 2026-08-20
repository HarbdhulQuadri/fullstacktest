import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe, HttpStatus } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import helmet from 'helmet';
import express from 'express';

const server = express();
let app: any;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    
    app.use(
      helmet({
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            scriptSrc: ["'self'", "'wasm-unsafe-eval'"],
            imgSrc: ["'self'", 'data:', 'https:'],
          },
        },
      }),
    );
    app.setGlobalPrefix('api');
    
    // Enable CORS for frontend communication
    app.enableCors({
      origin: true,
      credentials: true,
    });
    
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        transformOptions: {
          enableImplicitConversion: false,
        },
      }),
    );

    await app.init();
  }
}

// Export the serverless function handler
export default async (req: any, res: any) => {
  await bootstrap();
  server(req, res);
};
