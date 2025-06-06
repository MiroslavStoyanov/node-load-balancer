import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { RoundRobinLoadBalancer } from '../../src/loadBalancers/RoundRobinLoadBalancer';
import { proxyMiddleware } from '../../src/middlewares/proxyMiddleware';

@Module({})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const serverUrls = [
    { url: 'http://server1', isActive: true },
    { url: 'http://server2', isActive: true },
    { url: 'http://server3', isActive: true },
  ];

  const loadBalancer = new RoundRobinLoadBalancer(serverUrls);
  app.use(proxyMiddleware(loadBalancer));

  await app.listen(3000);
}
bootstrap();

