import { Injectable } from '@nestjs/common';

@Injectable()
export class EventProcessorService {
  getHello(): string {
    return 'Hello World!';
  }
}
