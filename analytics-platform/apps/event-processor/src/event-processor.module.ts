import { Module } from '@nestjs/common';
import { EventProcessorController } from './event-processor.controller';
import { EventProcessorService } from './event-processor.service';

@Module({
  imports: [],
  controllers: [EventProcessorController],
  providers: [EventProcessorService],
})
export class EventProcessorModule {}
