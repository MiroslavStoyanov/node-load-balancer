import { NestFactory } from '@nestjs/core';
import { EventProcessorModule } from './event-processor.module';

async function bootstrap() {
  const app = await NestFactory.create(EventProcessorModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
