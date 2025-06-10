import { ConsistentHashLoadBalancer } from '../ConsistentHashLoadBalancer';

describe('ConsistentHashLoadBalancer', () => {
    it('should consistently map a key to the same server', () => {
        const servers = [
            { url: 'a', isActive: true },
            { url: 'b', isActive: true },
            { url: 'c', isActive: true },
        ];
        const balancer = new ConsistentHashLoadBalancer(servers);
        const server1 = balancer.getServerForKey('client1');
        const server2 = balancer.getServerForKey('client1');
        expect(server1?.url).toBe(server2?.url);
    });
});
