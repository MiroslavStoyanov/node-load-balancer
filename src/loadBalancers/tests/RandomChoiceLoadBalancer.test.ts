import { RandomChoiceLoadBalancer } from '../RandomChoiceLoadBalancer';

describe('RandomChoiceLoadBalancer', () => {
    it('should return a server from the pool', async () => {
        const servers = [
            { url: 'a', isActive: true, connections: 0 },
            { url: 'b', isActive: true, connections: 0 },
        ];
        const balancer = new RandomChoiceLoadBalancer(servers, 2);
        const server = await balancer.getNextActiveServer();
        expect(['a', 'b']).toContain(server?.url);
    });
});
