import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  type CorsCallback = (err: Error | null, allow?: boolean) => void;

  const allowedOrigins = [
    process.env.FRONTEND_URL ?? '',
    'https://calm-rock-0ddd0211e.6.azurestaticapps.net',
    'http://localhost:4200',
  ].filter((v): v is string => typeof v === 'string' && v.trim().length > 0);

  app.enableCors({
    origin: (origin: string | undefined, callback: CorsCallback) => {
      // Permite llamadas sin Origin (curl/postman/server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) return callback(null, true);

      return callback(new Error(`CORS blocked for origin: ${origin}`), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  //  Pipes globales
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Puerto correcto en Azure App Service
  const port = process.env.PORT ?? '8080';
  await app.listen(parseInt(port, 10));
}

bootstrap();
