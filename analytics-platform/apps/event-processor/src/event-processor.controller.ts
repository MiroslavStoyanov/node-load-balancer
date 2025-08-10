import { Controller, Get } from '@nestjs/common';
import { EventProcessorService } from './event-processor.service';

@Controller()
export class EventProcessorController {
  constructor(private readonly eventProcessorService: EventProcessorService) {}

  @Get()
  getHello(): string {
    return this.eventProcessorService.getHello();
  }
}
