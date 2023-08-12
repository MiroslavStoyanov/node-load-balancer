import { IWeightedServer } from 'sample-load-balancer';
import { WeightedRoundRobinLoadBalancer } from '../../src/WeightedRoundRobinLoadBalancer';

const serverConfigs = [
  { url: 'http://server1', weight: 10 },
  { url: 'http://server2', weight: 20 },
  { url: 'http://server3', weight: 15 },
];

const NUMBER_OF_REQUESTS = 1000;

async function simulateAsynchronousRequests(loadBalancer: WeightedRoundRobinLoadBalancer, numRequests: number): Promise<IWeightedServer[]> {
  const requests: IWeightedServer[] = [];
  for (let i = 0; i < numRequests; i++) {
    const server = loadBalancer.getNextActiveServer();
    if (server !== null) {
        requests.push(server);
    }
  }
  return Promise.all(requests);
}

const loadBalancer = new WeightedRoundRobinLoadBalancer(serverConfigs);

(async () => {
  const results = await simulateAsynchronousRequests(loadBalancer, NUMBER_OF_REQUESTS);

  results.forEach((activeServer, index) => {
    console.log(`Request ${index + 1} sent to: ${activeServer.url}`);
  });
})();
