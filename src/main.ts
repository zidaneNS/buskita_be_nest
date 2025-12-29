import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000'
  });
  
  const config = new DocumentBuilder()
    .setTitle('Buskita API')
    .addBearerAuth()
    .build()

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
  console.log('running on port', process.env.PORT ?? 3000);
}
bootstrap();
