import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // ValidationPipe global pour valider les DTOs
  app.useGlobalPipes(new ValidationPipe());

  // Active 10+ headers de sécurité d'un coup
  app.use(helmet());

  // Configuration CORS sécurisée
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        process.env.ALLOWED_ORIGIN
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Autorise les cookies sécurisés
  });

  const port = process.env.PORT || process.env.NEST_PORT || 3000;
  await app.listen(port);
  console.log(`Serveur NestJS démarré sur le port ${port}`);
}
bootstrap();
