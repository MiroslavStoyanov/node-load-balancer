import { IWeightedServer } from 'node-load-balancer';
import { WeightedRoundRobinLoadBalancer } from '../WeightedRoundRobinLoadBalancer';

describe('WeightedRoundRobinLoadBalancer', () => {
    it('should return the servers based on their weight', async () => {
        const servers: IWeightedServer[] = [
            { url: 'test-url-1', isActive: true, weight: 3 },
            { url: 'test-url-2', isActive: true, weight: 2 },
            { url: 'test-url-3', isActive: true, weight: 1 },
        ];
        const balancer = new WeightedRoundRobinLoadBalancer(servers);
        const expectedOrder = [
            'test-url-1',
            'test-url-2',
            'test-url-1',
            'test-url-3',
            'test-url-2',
            'test-url-1',
            'test-url-1',
            'test-url-2',
            'test-url-1',
            'test-url-3',
        ];
        const result: string[] = [];
        for (let i = 0; i < 10; i++) {
            const server = await balancer.getNextActiveServer();
            result.push(server!.url);
        }
        expect(result).toEqual(expectedOrder);
    });

    it('should return null when no servers are available', async () => {
        const balancer = new WeightedRoundRobinLoadBalancer([]);
        expect(await balancer.getNextActiveServer()).toBeNull();
    });

    it('should handle single server gracefully', async () => {
        const server = { url: 'test-url', isActive: true, weight: 5 };
        const balancer = new WeightedRoundRobinLoadBalancer([server]);
        const expectedOrder = Array(5).fill('test-url');
        const result: string[] = [];
        for (let i = 0; i < 5; i++) {
            const s = await balancer.getNextActiveServer();
            result.push(s!.url);
        }
        expect(result).toEqual(expectedOrder);
    });

    it('should skip servers without any weight', async () => {
        const servers = [
            { url: 'test-url-1', isActive: true, weight: 2 },
            { url: 'test-url-2', isActive: true, weight: 0 },
            { url: 'test-url-3', isActive: true, weight: 3 },
        ];
        const balancer = new WeightedRoundRobinLoadBalancer(servers);
        const expectedOrder = ['test-url-3', 'test-url-1', 'test-url-3', 'test-url-1', 'test-url-3'];
        const result: string[] = [];
        for (let i = 0; i < 5; i++) {
            const s = await balancer.getNextActiveServer();
            result.push(s!.url);
        }
        expect(result).toEqual(expectedOrder);
    });

    it('should handle changes in server weights', async () => {
        const servers = [
            { url: 'test-url-1', isActive: true, weight: 3 },
            { url: 'test-url-2', isActive: true, weight: 2 },
            { url: 'test-url-3', isActive: true, weight: 1 },
        ];
        const balancer = new WeightedRoundRobinLoadBalancer(servers);
        const initialOrder = [
            'test-url-1',
            'test-url-2',
            'test-url-1',
            'test-url-3',
            'test-url-2',
            'test-url-1',
            'test-url-1',
            'test-url-2',
            'test-url-1',
            'test-url-3',
        ];
        const result1: string[] = [];
        for (let i = 0; i < 10; i++) {
            const s = await balancer.getNextActiveServer();
            result1.push(s!.url);
        }
        expect(result1).toEqual(initialOrder);

        servers[0].weight = 1;
        servers[1].weight = 4;
        balancer.adjustServerWeight(servers[0].url, 1);
        balancer.adjustServerWeight(servers[1].url, 4);

        const newOrder = [
            'test-url-2',
            'test-url-1',
            'test-url-2',
            'test-url-2',
            'test-url-3',
            'test-url-2',
            'test-url-2',
            'test-url-1',
            'test-url-2',
            'test-url-2',
        ];
        const result2: string[] = [];
        for (let i = 0; i < 10; i++) {
            const s = await balancer.getNextActiveServer();
            result2.push(s!.url);
        }
        expect(result2).toEqual(newOrder);
    });

    it('should reset state when a server is added', async () => {
        const servers = [
            { url: 'a', isActive: true, weight: 1 },
            { url: 'b', isActive: true, weight: 1 },
        ];
        const balancer = new WeightedRoundRobinLoadBalancer(servers);
        expect((await balancer.getNextActiveServer())?.url).toBe('a');
        balancer.addServer('c', 1);
        expect((await balancer.getNextActiveServer())?.url).toBe('a');
        expect((await balancer.getNextActiveServer())?.url).toBe('b');
        expect((await balancer.getNextActiveServer())?.url).toBe('c');
    });

    it('should reset state when a server is removed', async () => {
        const servers = [
            { url: 'a', isActive: true, weight: 1 },
            { url: 'b', isActive: true, weight: 1 },
            { url: 'c', isActive: true, weight: 1 },
        ];
        const balancer = new WeightedRoundRobinLoadBalancer(servers);
        expect((await balancer.getNextActiveServer())?.url).toBe('a');
        balancer.removeServer('a');
        expect((await balancer.getNextActiveServer())?.url).toBe('b');
        expect((await balancer.getNextActiveServer())?.url).toBe('c');
    });
});
