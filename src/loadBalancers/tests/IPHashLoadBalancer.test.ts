import { IPHashLoadBalancer } from '../IPHashLoadBalancer';

describe('IPHashLoadBalancer', () => {
    let loadBalancer: IPHashLoadBalancer;

    beforeEach(() => {
        loadBalancer = new IPHashLoadBalancer([
            { url: 'server1', isActive: true },
            { url: 'server2', isActive: true },
            { url: 'server3', isActive: true },
        ]);
    });

    it('should get the next active server in a round-robin fashion', () => {
        // The IP hash of 'client1' corresponds to 'server1'
        expect(loadBalancer.getServerForRequest('client1')?.url).toBe('server1');
        // The IP hash of 'client2' corresponds to 'server2'
        expect(loadBalancer.getServerForRequest('client2')?.url).toBe('server2');
        // The IP hash of 'client3' corresponds to 'server3'
        expect(loadBalancer.getServerForRequest('client3')?.url).toBe('server3');
        // The IP hash of 'client4' corresponds to 'server1'
        expect(loadBalancer.getServerForRequest('client4')?.url).toBe('server1');
    });

    it('should add a new server', () => {
        loadBalancer.addServer('server4');
        expect(loadBalancer.getServerForRequest('client1')?.url).toBe('server1');
        expect(loadBalancer.getServerForRequest('client5')?.url).toBe('server4');
    });

    it('should remove a server', () => {
        loadBalancer.removeServer('server2');
        expect(loadBalancer.getServerForRequest('client1')?.url).toBe('server1');
        expect(loadBalancer.getServerForRequest('client2')?.url).toBe('server3');
    });

    it('should disable a server', () => {
        loadBalancer.disableServer('server2');
        expect(loadBalancer.getServerForRequest('client1')?.url).toBe('server1');
        expect(loadBalancer.getServerForRequest('client2')?.url).toBe('server3');
    });

    it('should enable a server', () => {
        loadBalancer.disableServer('server2');
        expect(loadBalancer.getServerForRequest('client1')?.url).toBe('server1');
        expect(loadBalancer.getServerForRequest('client2')?.url).toBe('server3');

        loadBalancer.enableServer('server2');
        expect(loadBalancer.getServerForRequest('client1')?.url).toBe('server1');
        expect(loadBalancer.getServerForRequest('client2')?.url).toBe('server2');
    });

    it('should handle empty server list', () => {
        const emptyLoadBalancer = new IPHashLoadBalancer([]);
        expect(emptyLoadBalancer.getServerForRequest('client1')).toBeNull();
    });

    it('should get the correct server for the request IP', () => {
        // Ensure the IP hash calculation is working as expected
        const server = loadBalancer.getServerForRequest('192.168.1.1');
        expect(server?.url).toBe('server2');
    });
});
