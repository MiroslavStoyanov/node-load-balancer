import { IServer } from 'node-load-balancer';
import { RoundRobinLoadBalancer } from '../RoundRobinLoadBalancer';

describe('RoundRobinLoadBalancer', () => {
    it('should return the next server in sequence', async () => {
        const servers = [
            { url: 'testUrl1', isActive: true },
            { url: 'testUrl2', isActive: true },
            { url: 'testUrl3', isActive: true },
        ];
        const balancer = new RoundRobinLoadBalancer(servers);

        expect(await balancer.getNextActiveServer()).toBe(servers[0]);
        expect(await balancer.getNextActiveServer()).toBe(servers[1]);
        expect(await balancer.getNextActiveServer()).toBe(servers[2]);
        expect(await balancer.getNextActiveServer()).toBe(servers[0]); // Loop back
    });

    it('should loop through the active servers only', async () => {
        const servers = [
            { url: 'testUrl1', isActive: true },
            { url: 'testUrl2', isActive: true },
            { url: 'testUrl3', isActive: false },
        ];
        const balancer = new RoundRobinLoadBalancer(servers);

        expect(await balancer.getNextActiveServer()).toBe(servers[0]);
        expect(await balancer.getNextActiveServer()).toBe(servers[1]);
        expect(await balancer.getNextActiveServer()).toBe(servers[0]);
        expect(await balancer.getNextActiveServer()).toBe(servers[1]); // Loop back
    });

    it('should return null when no servers are available', async () => {
        const balancer = new RoundRobinLoadBalancer([]);

        expect(await balancer.getNextActiveServer()).toBeNull();
    });

    it('should handle single server gracefully', async () => {
        const server: IServer = {
            url: 'random-url',
            isActive: true,
        };
        const balancer = new RoundRobinLoadBalancer([server]);

        expect(await balancer.getNextActiveServer()).toBe(server);
        expect(await balancer.getNextActiveServer()).toBe(server); // Loop back to the same server
    });
});
