import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable CORS for WebSocket and HTTP requests
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN') || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Get port from environment or use default
  const port = configService.get<number>('PORT') || 3000;
  const environment = configService.get<string>('NODE_ENV') || 'development';

  // Start the application
  await app.listen(port, '0.0.0.0');

  console.log(`
    ╔════════════════════════════════════════════════════════════╗
    ║          Task Master Backend - NestJS Server                ║
    ║────────────────────────────────────────────────────────────║
    ║  Environment: ${environment.padEnd(41)}║
    ║  Server: http://localhost:${port.toString().padEnd(42)}║
    ║  WebSocket: ws://localhost:${port.toString().padEnd(38)}║
    ║  CORS Origin: ${(configService.get<string>('CORS_ORIGIN') || '*').padEnd(42)}║
    ╚════════════════════════════════════════════════════════════╝
  `);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
