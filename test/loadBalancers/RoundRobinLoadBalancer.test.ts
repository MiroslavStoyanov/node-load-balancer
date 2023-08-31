import { RoundRobinLoadBalancer } from '../../src/loadBalancers/RoundRobinLoadBalancer';

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
});
