import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SwaggerConfig } from './config/swagger.config';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from "cookie-parser"
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  console.log(process.env.CORS_ORIGIN_URL.split(','))
  app.enableCors({
    origin: process.env.CORS_ORIGIN_URL.split(','),
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', "OPTION"],

  })
  app.useGlobalPipes(new ValidationPipe())
  app.use(cookieParser(process.env.COOKIE_SECRET))
  SwaggerConfig(app)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
