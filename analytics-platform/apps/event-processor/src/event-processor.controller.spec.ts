import { Test, TestingModule } from '@nestjs/testing';
import { EventProcessorController } from './event-processor.controller';
import { EventProcessorService } from './event-processor.service';

describe('EventProcessorController', () => {
  let eventProcessorController: EventProcessorController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EventProcessorController],
      providers: [EventProcessorService],
    }).compile();

    eventProcessorController = app.get<EventProcessorController>(EventProcessorController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(eventProcessorController.getHello()).toBe('Hello World!');
    });
  });
});
