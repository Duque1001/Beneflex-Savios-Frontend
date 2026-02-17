// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   // const allowedOrigins = [
//   //   'http://localhost:4200',
//   //   'http://localhost:56406',
//   //   process.env.FRONTEND_URL,
//   // ].filter((x): x is string => typeof x === 'string' && x.length > 0);

//   // app.enableCors({
//   //   origin: allowedOrigins,
//   //   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   //   credentials: true,
//   // });

//   app.setGlobalPrefix('api');

//   app.enableCors({
//     origin: [
//       'https://calm-rock-0ddd0211e.6.azurestaticapps.net',
//       'http://localhost:4200',
//     ],
//     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true,
//   });

//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true,
//       transform: true,
//     }),
//   );

//   // const port = Number(process.env.PORT) || 3000;
//   // await app.listen(port);
//   const port = Number(process.env.PORT) || 3000;
//   await app.listen(port, '0.0.0.0');

//   console.log(`Backend escuchando en puerto ${port}`);
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  const explicitAllowed = new Set<string>(
    [
      process.env.FRONTEND_URL,
      'https://calm-rock-0ddd0211e.6.azurestaticapps.net',
      'http://localhost:4200',
      'http://localhost:56406',
    ].filter(Boolean) as string[],
  );

  app.enableCors({
    origin: (
      origin: string | undefined,
      cb: (err: Error | null, allow?: boolean) => void,
    ) => {
      // algunos requests no mandan Origin
      if (!origin) {
        cb(null, true);
        return;
      }

      // allow-list exacta
      if (explicitAllowed.has(origin)) {
        cb(null, true);
        return;
      }

      // permitir cualquier Azure Static Web Apps (incluye previews)
      if (origin.endsWith('.azurestaticapps.net')) {
        cb(null, true);
        return;
      }

      cb(new Error(`CORS blocked: ${origin}`), false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`Backend escuchando en puerto ${port}`);
}
bootstrap();
