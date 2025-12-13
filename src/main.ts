import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
  const corsOrigin = process.env.CORS_ORIGIN;
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        corsOrigin,
        'http://localhost:5000',
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

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Gestion MDP API')
    .setDescription('API sécurisée pour la gestion des mots de passe')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token obtained from /auth/login endpoint',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in controller
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document); // Swagger dispo sur /api

  const port = parseInt(process.env.PORT|| process.env.NEST_PORT || '3001', 10);
  await app.listen(port ,'0.0.0.0');
  console.log(`Serveur NestJS démarré sur le port ${port}`);
}
bootstrap();
