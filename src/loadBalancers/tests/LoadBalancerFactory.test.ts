import { LoadBalancerFactory } from '../LoadBalancerFactory';
import { RoundRobinLoadBalancer } from '../RoundRobinLoadBalancer';
import { WeightedRoundRobinLoadBalancer } from '../WeightedRoundRobinLoadBalancer';
import { IPHashLoadBalancer } from '../IPHashLoadBalancer';

describe('LoadBalancerFactory', () => {
    it('creates a round-robin strategy', () => {
        const strategy = LoadBalancerFactory.create({
            type: 'round-robin',
            servers: [{ url: 'a', isActive: true }],
        });
        expect(strategy).toBeInstanceOf(RoundRobinLoadBalancer);
    });

    it('creates a weighted round-robin strategy', () => {
        const strategy = LoadBalancerFactory.create({
            type: 'weighted-round-robin',
            servers: [{ url: 'a', weight: 1, isActive: true }],
        });
        expect(strategy).toBeInstanceOf(WeightedRoundRobinLoadBalancer);
    });

    it('creates an ip-hash strategy', () => {
        const strategy = LoadBalancerFactory.create({
            type: 'ip-hash',
            servers: [{ url: 'a', isActive: true }],
        });
        expect(strategy).toBeInstanceOf(IPHashLoadBalancer);
    });
});
