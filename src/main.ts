import 'reflect-metadata';
import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module';
import { join } from 'path';
import { existsSync } from 'fs';

function resolveCorsOrigins(): string[] | boolean {
  const raw = process.env.CORS_ORIGINS;
  if (raw === '*') return true;
  if (raw) {
    return raw
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);
  }
  // Sensible local defaults for the Vite dev server.
  return ['http://localhost:5173', 'http://127.0.0.1:5173'];
}

function resolveClientDist(): string {
  // `main.js` lives in `dist/`, so the built frontend is at `../client/dist`.
  return join(__dirname, '..', 'client', 'dist');
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // @react-pdf/renderer bundles a WebAssembly layout engine (Yoga) that must
  // be instantiated in the browser, which violates the default CSP
  // (`script-src 'self'`). Allow `wasm-unsafe-eval` so PDF export works, and
  // permit https images so external profile photos render in the PDF.
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

  app.enableCors({
    origin: resolveCorsOrigins(),
    credentials: true,
  });

  const clientDist = resolveClientDist();
  if (existsSync(clientDist)) {
    app.useStaticAssets(clientDist, { index: false });
    // SPA fallback: serve index.html for client-side routes (non-API GETs).
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.method === 'GET' && !req.path.startsWith('/api')) {
        res.sendFile(join(clientDist, 'index.html'));
      } else {
        next();
      }
    });
  }

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

  const port = Number(process.env.PORT || 3000);
  await app.listen(port, '0.0.0.0');
  // eslint-disable-next-line no-console
  console.log(`API listening on http://0.0.0.0:${port}`);
}

void bootstrap();
