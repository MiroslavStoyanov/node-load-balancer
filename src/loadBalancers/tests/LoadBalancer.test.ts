import { IServer } from 'node-load-balancer';
import { LoadBalancer } from '../LoadBalancer';
import { RoundRobinLoadBalancer } from '../RoundRobinLoadBalancer';

describe('LoadBalancer context', () => {
    it('should delegate calls to the current strategy', () => {
        const servers: IServer[] = [
            { url: 'a', isActive: true },
            { url: 'b', isActive: true },
        ];
        const strategy = new RoundRobinLoadBalancer(servers);
        const context = new LoadBalancer(strategy);

        expect(context.getNextActiveServer()).toBe(servers[0]);
        expect(context.getNextActiveServer()).toBe(servers[1]);
    });

    it('should allow swapping strategies at runtime', () => {
        const servers1: IServer[] = [
            { url: 'a', isActive: true },
            { url: 'b', isActive: true },
        ];
        const servers2: IServer[] = [{ url: 'c', isActive: true }];
        const strategy1 = new RoundRobinLoadBalancer(servers1);
        const context = new LoadBalancer(strategy1);

        expect(context.getNextActiveServer()).toBe(servers1[0]);

        const strategy2 = new RoundRobinLoadBalancer(servers2);
        context.setStrategy(strategy2);

        expect(context.getNextActiveServer()).toBe(servers2[0]);
    });
});
