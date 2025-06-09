import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { LoadBalancer } from '../../src/loadBalancers/LoadBalancer';
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

    const strategy = new RoundRobinLoadBalancer(serverUrls);
    const loadBalancer = new LoadBalancer(strategy);
    app.use(proxyMiddleware(loadBalancer));

    await app.listen(3000);
}
bootstrap();
