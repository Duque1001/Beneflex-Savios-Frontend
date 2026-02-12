import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Lista de orígenes permitidos
  const allowedOrigins = [
    'http://localhost:4200', // Angular local (normal)
    'http://localhost:56406', 
    process.env.FRONTEND_URL, // tu Static Web App 
  ].filter(Boolean) as string[];

  app.enableCors({
    origin: (origin, callback) => {
      // Permite llamadas sin origin (Postman/cURL/health checks)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) return callback(null, true);

      return callback(new Error(`CORS bloqueado para origen: ${origin}`), false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // IMPORTANTE para Azure App Service
  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);

  console.log(`Backend escuchando en puerto ${port}`);
}
bootstrap();