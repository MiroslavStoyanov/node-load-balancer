import { IServer } from 'node-load-balancer';
import { RoundRobinLoadBalancer } from '../../src/loadBalancers/RoundRobinLoadBalancer';

const servers: IServer[] = [
    {
        url: 'http://server1',
        isActive: true,
    },
    {
        url: 'http://server2',
        isActive: true,
    },
    {
        url: 'http://server3',
        isActive: true,
    },
];

const NUMBER_OF_REQUESTS = 1000;

async function simulateAsynchronousRequests(
    loadBalancer: RoundRobinLoadBalancer,
    numRequests: number,
): Promise<IServer[]> {
    const requests: IServer[] = [];
    for (let i = 0; i < numRequests; i++) {
        const server = loadBalancer.getNextActiveServer();
        if (server !== null) {
            requests.push(server);
        }
    }
    return Promise.all(requests);
}

const loadBalancer = new RoundRobinLoadBalancer(servers);

(async () => {
    const results = await simulateAsynchronousRequests(loadBalancer, NUMBER_OF_REQUESTS);

    results.forEach((activeServer, index) => {
        console.log(`Request ${index + 1} sent to: ${activeServer.url}`);
    });
})();
