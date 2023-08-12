import { IServer } from 'sample-load-balancer';
import { RoundRobinLoadBalancer } from '../../src/RoundRobinLoadBalancer';

const serverUrls = [
    'http://server1',
    'http://server2',
    'http://server3'
];

const NUMBER_OF_REQUESTS = 1000;

async function simulateAsynchronousRequests(loadBalancer: RoundRobinLoadBalancer, numRequests: number): Promise<IServer[]> {
    const requests: IServer[] = [];
    for (let i = 0; i < numRequests; i++) {
        const server = loadBalancer.getNextActiveServer();
        if (server !== null) {
            requests.push(server);
        }
    }
    return Promise.all(requests);
}

const loadBalancer = new RoundRobinLoadBalancer({ serverUrls });

(async () => {
    const results = await simulateAsynchronousRequests(loadBalancer, NUMBER_OF_REQUESTS);

    results.forEach((activeServer, index) => {
        console.log(`Request ${index + 1} sent to: ${activeServer.url}`);
    });
})();
