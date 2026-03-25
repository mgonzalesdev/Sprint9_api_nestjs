import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';

async function bootstrap() {
  //const app = await NestFactory.create(AppModule);
 // await app.listen(process.env.PORT ?? 3000);
const app = await NestFactory.create(AppModule);

  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ limit: '10mb', extended: true }));


  // --- CONFIGURACIÓN DE CORS ---
  app.enableCors({
    origin: 'http://localhost:4200', // El puerto donde corre tu Angular
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  // -----------------------------

  app.useGlobalPipes(new ValidationPipe());
  console.log(process.env.JWT_SECRET)
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);

}
bootstrap();
