import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ValidationPipe global pour valider les DTOs
  app.useGlobalPipes(new ValidationPipe());

  // Active 10+ headers de sécurité d'un coup
  app.use(helmet());

  // Configuration CORS sécurisée
  app.enableCors({
    origin: (origin, callback) => {
      const allowed = [
        process.env.ALLOWED_ORIGIN?.replace(/\/$/, ''),
        (process.env.ALLOWED_ORIGIN || '') + '/'
      ];
  
      if (!origin || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS not allowed for ${origin}`));
      }
    },
    credentials: true,
  });

  const port = process.env.PORT || process.env.NEST_PORT || 3000;
  await app.listen(port);
  console.log(`Serveur NestJS démarré sur le port ${port}`);
}
bootstrap();
