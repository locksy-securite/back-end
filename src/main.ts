import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // ValidationPipe global pour valider les DTOs
  app.useGlobalPipes(new ValidationPipe());

  // Active 10+ headers de sécurité d'un coup
  app.use(helmet());
  // Middleware pour parser les cookies
  app.use(cookieParser());

  // Configuration CORS sécurisée
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'https://startup.com', // A modifier avec le vrai domaine
        'https://admin.com',
        // 'http://localhost:3000', // Uniquement en dev !
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
