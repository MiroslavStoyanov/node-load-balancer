import { IWeightedServer } from 'node-load-balancer';
import { WeightedRoundRobinLoadBalancer } from '../WeightedRoundRobinLoadBalancer';

describe('WeightedRoundRobinLoadBalancer', () => {
    it('should return the servers based on their weight', () => {
        const servers: IWeightedServer[] = [
            { url: 'test-url', isActive: true, weight: 3 },
            { url: 'test-url', isActive: true, weight: 2 },
            { url: 'test-url', isActive: true, weight: 1 },
        ];
        const balancer = new WeightedRoundRobinLoadBalancer(servers);

        const expectedOrder = [servers[0], servers[1], servers[0], servers[0], servers[2]]; // Weighted order

        const result = [];
        for (let i = 0; i < 5; i++) {
            result.push(balancer.getNextActiveServer());
        }

        expect(result).toEqual(expectedOrder);
    });

    it('should return null when no servers are available', () => {
        const balancer = new WeightedRoundRobinLoadBalancer([]);

        expect(balancer.getNextActiveServer()).toBeNull();
    });
});
