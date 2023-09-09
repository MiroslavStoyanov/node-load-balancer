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

        const expectedOrder = [
            servers[0],
            servers[0],
            servers[0],
            servers[1],
            servers[1],
            servers[2],
            servers[0],
            servers[0],
            servers[0],
            servers[1],
        ];

        const result = [];
        for (let i = 0; i < 10; i++) {
            const activeServer = balancer.getNextActiveServer();
            result.push(activeServer);
        }

        expect(result).toEqual(expectedOrder);
    });

    it('should return null when no servers are available', () => {
        const balancer = new WeightedRoundRobinLoadBalancer([]);

        expect(balancer.getNextActiveServer()).toBeNull();
    });

    it('should handle single server gracefully', () => {
        const server = { url: 'test-url', isActive: true, weight: 5 };
        const balancer = new WeightedRoundRobinLoadBalancer([server]);

        const expectedOrder = [server, server, server, server, server];

        const result = [];
        for (let i = 0; i < 5; i++) {
            result.push(balancer.getNextActiveServer());
        }

        expect(result).toEqual(expectedOrder);
    });

    it('should skip servers without any weight', () => {
        const servers = [
            { url: 'test-url', isActive: true, weight: 2 },
            { url: 'test-url', isActive: true, weight: 0 },
            { url: 'test-url', isActive: true, weight: 3 },
        ];
        const balancer = new WeightedRoundRobinLoadBalancer(servers);

        const expectedOrder = [servers[0], servers[0], servers[2], servers[2], servers[2]]; // Weighted order (skipping the inactive server)

        const result = [];
        for (let i = 0; i < 5; i++) {
            result.push(balancer.getNextActiveServer());
        }

        expect(result).toEqual(expectedOrder);
    });

    it('should handle changes in server weights', () => {
        const servers = [
            { url: 'test-url-1', isActive: true, weight: 3 },
            { url: 'test-url-2', isActive: true, weight: 2 },
            { url: 'test-url-3', isActive: true, weight: 1 },
        ];
        const balancer = new WeightedRoundRobinLoadBalancer(servers);

        let expectedOrder = [
            servers[0],
            servers[0],
            servers[0],
            servers[1],
            servers[1],
            servers[2],
            servers[0],
            servers[0],
            servers[0],
            servers[1],
        ];

        let result = [];
        for (let i = 0; i < 10; i++) {
            result.push(balancer.getNextActiveServer());
        }

        expect(result).toEqual(expectedOrder);

        // Change weights
        servers[0].weight = 1;
        servers[1].weight = 4;

        balancer.adjustServerWeight(servers[0].url, 1);
        balancer.adjustServerWeight(servers[1].url, 4);

        expectedOrder = [
            servers[1],
            servers[2],
            servers[0],
            servers[1],
            servers[1],
            servers[1],
            servers[1],
            servers[2],
            servers[0],
            servers[1],
        ];

        result = [];
        for (let i = 0; i < 10; i++) {
            result.push(balancer.getNextActiveServer());
        }

        expect(result).toEqual(expectedOrder);
    });
});
