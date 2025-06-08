# Node Load Balancer Library

The Node Load Balancer Library is designed to provide a simple and flexible solution for load balancing requests across multiple backend servers in Node.js applications. Whether you're building a microservices architecture or need to distribute traffic efficiently, this library offers a range of load balancing algorithms to meet your needs.

## Purpose

The purpose of this project is to offer an easy-to-use Node.js library that provides basic load balancing functionalities. It aims to simplify the process of distributing requests across servers, enabling developers to achieve better resource utilization, improved performance, and higher availability in their applications.

## Features

- **Round Robin Load Balancing:** Distributes requests sequentially across backend servers.
- **Weighted Round Robin Load Balancing:** Assigns servers different weights for proportional load distribution.
- **IP Hash Load Balancing:** Ensures that requests from the same IP address are consistently directed to the same server.

## Installation

```bash
npm install node-load-balancer
```

## Usage
#### Round Robin Load Balancer
The Round Robin Load Balancer distributes incoming requests sequentially across the available backend servers.
```typescript
import { RoundRobinLoadBalancer } from 'node-load-balancer';

const serverUrls = [
  'http://server1',
  'http://server2',
  'http://server3',
  // ... more server URLs
];

const loadBalancer = new RoundRobinLoadBalancer(serverUrls);

const activeServer = loadBalancer.getNextActiveServer();
console.log(`Request sent to: ${activeServer?.url}`);
```

#### Weighted Round Robin Load Balancer
The Weighted Round Robin Load Balancer assigns servers different weights to achieve proportional load distribution.
```typescript
import { WeightedRoundRobinLoadBalancer } from 'node-load-balancer';

const serverConfigs = [
  { url: 'http://server1', weight: 10 },
  { url: 'http://server2', weight: 20 },
  { url: 'http://server3', weight: 15 },
  // ... more server configurations
];

const loadBalancer = new WeightedRoundRobinLoadBalancer(serverConfigs);

const activeServer = loadBalancer.getNextActiveServer();
console.log(`Request sent to: ${activeServer?.url}`);
```

#### IP Hash Load Balancer
The IP Hash Load Balancer ensures that requests from the same IP address are consistently directed to the same server.
```typescript
import { IPHashLoadBalancer } from 'node-load-balancer';

const serverUrls = [
  'http://server1',
  'http://server2',
  'http://server3',
  // ... more server URLs
];

const loadBalancer = new IPHashLoadBalancer(serverUrls);

const requestIp = '192.168.1.1';
const activeServer = loadBalancer.getServerForRequest(requestIp);
console.log(`Request from IP ${requestIp} sent to: ${activeServer?.url}`);
```

## Integrating with Express.js
You can easily integrate the load balancer library with an Express.js application using the proxyMiddleware function provided by each load balancer. Here's how:
```typescript
import express from 'express';
import { RoundRobinLoadBalancer, proxyMiddleware } from 'node-load-balancer';

const app = express();

const serverUrls = [
  'http://server1',
  'http://server2',
  'http://server3',
  // ... more server URLs
];

const loadBalancer = new RoundRobinLoadBalancer(serverUrls);

// Use proxyMiddleware to balance requests in your Express app
app.use(proxyMiddleware(loadBalancer));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

## Integrating with NestJS
NestJS applications can use the same middleware approach because they run on Express by default. Add the middleware in `main.ts`:
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RoundRobinLoadBalancer, proxyMiddleware } from 'node-load-balancer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const serverUrls = [
    'http://server1',
    'http://server2',
    'http://server3',
  ];

  const loadBalancer = new RoundRobinLoadBalancer(serverUrls);

  app.use(proxyMiddleware(loadBalancer));

  await app.listen(3000);
}
bootstrap();
```
You can also look at `examples/nestjs/main.ts` for a complete example.

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your enhancements or bug fixes.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
