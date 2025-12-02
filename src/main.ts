import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || process.env.NEST_PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Serveur NestJS démarré sur le port ${port}`);
}
bootstrap();
