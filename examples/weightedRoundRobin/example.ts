import { IWeightedServer } from 'node-load-balancer';
import { LoadBalancer } from '../../src/loadBalancers/LoadBalancer';
import { WeightedRoundRobinLoadBalancer } from '../../src/loadBalancers/WeightedRoundRobinLoadBalancer';

const serverConfigs: IWeightedServer[] = [
    { url: 'http://server1', weight: 10, isActive: true },
    { url: 'http://server2', weight: 20, isActive: true },
    { url: 'http://server3', weight: 15, isActive: true },
];

const NUMBER_OF_REQUESTS = 1000;

async function simulateAsynchronousRequests(
    loadBalancer: LoadBalancer,
    numRequests: number,
): Promise<IWeightedServer[]> {
    const requests: IWeightedServer[] = [];
    for (let i = 0; i < numRequests; i++) {
        const server = loadBalancer.getNextActiveServer();
        if (server !== null) {
            requests.push(server);
        }
    }
    return Promise.all(requests);
}

const strategy = new WeightedRoundRobinLoadBalancer(serverConfigs);
const loadBalancer = new LoadBalancer(strategy);

(async () => {
    const results = await simulateAsynchronousRequests(loadBalancer, NUMBER_OF_REQUESTS);

    results.forEach((activeServer, index) => {
        console.log(`Request ${index + 1} sent to: ${activeServer.url}`);
    });
})();
