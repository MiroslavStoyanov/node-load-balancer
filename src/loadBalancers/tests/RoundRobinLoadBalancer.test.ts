import { IServer } from 'node-load-balancer';
import { RoundRobinLoadBalancer } from '../RoundRobinLoadBalancer';

describe('RoundRobinLoadBalancer', () => {
    it('should return the next server in sequence', () => {
        const servers = [
            { url: 'testUrl1', isActive: true },
            { url: 'testUrl2', isActive: true },
            { url: 'testUrl3', isActive: true },
        ];
        const balancer = new RoundRobinLoadBalancer(servers);

        expect(balancer.getNextActiveServer()).toBe(servers[0]);
        expect(balancer.getNextActiveServer()).toBe(servers[1]);
        expect(balancer.getNextActiveServer()).toBe(servers[2]);
        expect(balancer.getNextActiveServer()).toBe(servers[0]); // Loop back
    });

    it('should loop through the active servers only', () => {
        const servers = [
            { url: 'testUrl1', isActive: true },
            { url: 'testUrl2', isActive: true },
            { url: 'testUrl3', isActive: false },
        ];
        const balancer = new RoundRobinLoadBalancer(servers);

        expect(balancer.getNextActiveServer()).toBe(servers[0]);
        expect(balancer.getNextActiveServer()).toBe(servers[1]);
        expect(balancer.getNextActiveServer()).toBe(servers[0]);
        expect(balancer.getNextActiveServer()).toBe(servers[1]); // Loop back
    });

    it('should return null when no servers are available', () => {
        const balancer = new RoundRobinLoadBalancer([]);

        expect(balancer.getNextActiveServer()).toBeNull();
    });

    it('should handle single server gracefully', () => {
        const server: IServer = {
            url: 'random-url',
            isActive: true,
        };
        const balancer = new RoundRobinLoadBalancer([server]);

        expect(balancer.getNextActiveServer()).toBe(server);
        expect(balancer.getNextActiveServer()).toBe(server); // Loop back to the same server
    });
});
