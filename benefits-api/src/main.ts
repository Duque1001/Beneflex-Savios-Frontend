import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

function normalizeOrigin(value?: string | null): string | undefined {
  if (!value) return undefined;
  return value.trim().replace(/\/+$/, '').toLowerCase();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // ===== ORÍGENES PERMITIDOS =====
  const allowedOrigins = new Set<string>(
    [
      process.env.FRONTEND_URL,
      'https://calm-rock-0ddd0211e.6.azurestaticapps.net',
      'http://localhost:4200',
    ]
      .map(normalizeOrigin)
      .filter((x): x is string => typeof x === 'string'),
  );

  type CorsCallback = (err: Error | null, allow?: boolean) => void;

  app.enableCors({
    origin: (origin: string | undefined, callback: CorsCallback) => {
      // Permite requests sin Origin (server-to-server / health checks)
      if (!origin) {
        callback(null, true);
        return;
      }

      const normalized = normalizeOrigin(origin);

      if (normalized && allowedOrigins.has(normalized)) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'authorization',
      'X-Requested-With',
    ],
    optionsSuccessStatus: 204,
  });

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port, '0.0.0.0');
}

bootstrap();
