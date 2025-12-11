import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import csrf from 'csrf';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // ValidationPipe global pour valider les DTOs
  app.useGlobalPipes(new ValidationPipe());

  // Active 10+ headers de sécurité d'un coup
  app.use(helmet());

  // Rate limiting pour les endpoints d'authentification
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 tentatives par fenêtre
    message: 'Trop de tentatives de connexion, réessayez dans 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Appliquer le rate limiting aux routes d'auth
  app.use('/auth/login', authLimiter);
 app.use('/auth/register', authLimiter);

  // Configuration CORS sécurisée
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:5173', // A modifier avec le vrai domaine
        'https://admin.com',
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

  // Ajout du document Swagger pour l'API
  const config = new DocumentBuilder()
    .setTitle('Gestion MDP API')
    .setDescription('API pour la gestion des mots de passe')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = configService.get<number>('NEST_PORT') || 3000;
  await app.listen(port);
  console.log(`Serveur NestJS démarré sur le port ${port}`);
}
bootstrap();
