# Node Load Balancer Library

The Node Load Balancer Library is designed to provide a simple and flexible solution for load balancing requests across multiple backend servers in Node.js applications. Whether you're building a microservices architecture or need to distribute traffic efficiently, this library offers a range of load balancing algorithms to meet your needs.

## Purpose

The purpose of this project is to offer an easy-to-use Node.js library that provides basic load balancing functionalities. It aims to simplify the process of distributing requests across servers, enabling developers to achieve better resource utilization, improved performance, and higher availability in their applications.

## Features

- **Round Robin Load Balancing:** Distributes requests sequentially across backend servers.
- **Weighted Round Robin Load Balancing:** Assigns servers different weights for proportional load distribution.
- **IP Hash Load Balancing:** Ensures that requests from the same IP address are consistently directed to the same server.
- **Least Connections:** Chooses the server with the fewest active connections.
- **Random Choice / Power of Two Choices:** Picks a random subset of servers and forwards to the least loaded.
- **Consistent Hashing:** Minimizes cache disruption when servers are added or removed.
- **Pluggable Health Checks:** Periodically verify server availability with customizable strategies.

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

const activeServer = await loadBalancer.getNextActiveServer();
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

const activeServer = await loadBalancer.getNextActiveServer();
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

#### Least Connections Load Balancer
The Least Connections Load Balancer forwards requests to the server with the fewest active connections.
```typescript
import { LeastConnectionsLoadBalancer } from 'node-load-balancer';

const servers = [
  { url: 'http://server1', isActive: true, connections: 0 },
  { url: 'http://server2', isActive: true, connections: 0 },
  { url: 'http://server3', isActive: true, connections: 0 },
];

const loadBalancer = new LeastConnectionsLoadBalancer(servers);
const activeServer = await loadBalancer.getNextActiveServer();
console.log(`Request sent to: ${activeServer?.url}`);
loadBalancer.releaseServer(activeServer!.url);
```

#### Random Choice Load Balancer
The Random Choice Load Balancer picks a random subset of servers and forwards to the least loaded one.
```typescript
import { RandomChoiceLoadBalancer } from 'node-load-balancer';

const servers = [
  { url: 'http://server1', isActive: true, connections: 0 },
  { url: 'http://server2', isActive: true, connections: 0 },
  { url: 'http://server3', isActive: true, connections: 0 },
];

const loadBalancer = new RandomChoiceLoadBalancer(servers, 2);
const activeServer = await loadBalancer.getNextActiveServer();
console.log(`Request sent to: ${activeServer?.url}`);
loadBalancer.releaseServer(activeServer!.url);
```

#### Consistent Hash Load Balancer
The Consistent Hash Load Balancer maps keys to servers while minimizing disruption when servers change.
```typescript
import { ConsistentHashLoadBalancer } from 'node-load-balancer';

const serverUrls = [
  { url: 'http://server1', isActive: true },
  { url: 'http://server2', isActive: true },
  { url: 'http://server3', isActive: true },
];

const loadBalancer = new ConsistentHashLoadBalancer(serverUrls);
const userId = 'user-123';
const server = loadBalancer.getServerForKey(userId);
console.log(`User ${userId} routed to: ${server?.url}`);
```

#### Load Balancer Factory
Use the `LoadBalancerFactory` to instantiate a strategy based on configuration:
```typescript
import { LoadBalancerFactory, LoadBalancer } from 'node-load-balancer';

const config = {
  type: 'round-robin' as const,
  servers: [
    { url: 'http://server1', isActive: true },
    { url: 'http://server2', isActive: true },
  ],
};

const strategy = LoadBalancerFactory.create(config);
const loadBalancer = new LoadBalancer(strategy);
```

## Integrating with Express.js
You can easily integrate the load balancer library with an Express.js application using the proxyMiddleware function provided by each load balancer. Here's how:
```typescript
import express from 'express';
import {
  LoadBalancer,
  RoundRobinLoadBalancer,
  WeightedRoundRobinLoadBalancer,
  proxyMiddleware,
} from 'node-load-balancer';

const app = express();

const serverUrls = [
  'http://server1',
  'http://server2',
  'http://server3',
  // ... more server URLs
];

const strategy = new RoundRobinLoadBalancer(serverUrls);
const loadBalancer = new LoadBalancer(strategy);

// Use proxyMiddleware to balance requests in your Express app
app.use(proxyMiddleware(loadBalancer));

// Swap strategies if needed
loadBalancer.setStrategy(
  new WeightedRoundRobinLoadBalancer([
    { url: 'http://server1', weight: 5 },
    { url: 'http://server2', weight: 10 },
  ]),
);

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
import {
  LoadBalancer,
  RoundRobinLoadBalancer,
  proxyMiddleware,
} from 'node-load-balancer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const serverUrls = [
    'http://server1',
    'http://server2',
    'http://server3',
  ];

  const strategy = new RoundRobinLoadBalancer(serverUrls);
  const loadBalancer = new LoadBalancer(strategy);

  app.use(proxyMiddleware(loadBalancer));

  await app.listen(3000);
}
bootstrap();
```
You can also look at `examples/nestjs/main.ts` for a complete example.
## Testing

Install dependencies and run linting, build, and tests:
```bash
npm ci
npm run lint
npm run build
npm test
```

### Docker
You can still run the tests in a containerized environment by building the image:
```bash
docker build -t node-load-balancer .
docker run --rm node-load-balancer
```


## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your enhancements or bug fixes.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
