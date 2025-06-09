import { LeastConnectionsLoadBalancer } from '../LeastConnectionsLoadBalancer';

describe('LeastConnectionsLoadBalancer', () => {
    it('should pick the server with the fewest connections', async () => {
        const servers = [
            { url: 'a', isActive: true, connections: 1 },
            { url: 'b', isActive: true, connections: 0 },
            { url: 'c', isActive: true, connections: 2 },
        ];
        const balancer = new LeastConnectionsLoadBalancer(servers);

        const server = await balancer.getNextActiveServer();
        expect(server?.url).toBe('b');
        balancer.releaseServer('b');
    });
});
