import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // strip unknown properties
      forbidNonWhitelisted: true, // throw error on extra properties
      transform: true         // auto-transform payloads to DTO classes
    }),
  );

  
  app.useGlobalFilters(new AllExceptionsFilter());


  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
}
bootstrap();