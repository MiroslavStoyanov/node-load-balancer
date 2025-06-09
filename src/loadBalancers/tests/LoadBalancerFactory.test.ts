import { LoadBalancerFactory } from '../LoadBalancerFactory';
import { RoundRobinLoadBalancer } from '../RoundRobinLoadBalancer';
import { WeightedRoundRobinLoadBalancer } from '../WeightedRoundRobinLoadBalancer';
import { IPHashLoadBalancer } from '../IPHashLoadBalancer';
import { LeastConnectionsLoadBalancer } from '../LeastConnectionsLoadBalancer';
import { RandomChoiceLoadBalancer } from '../RandomChoiceLoadBalancer';
import { ConsistentHashLoadBalancer } from '../ConsistentHashLoadBalancer';

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

    it('creates a least-connections strategy', () => {
        const strategy = LoadBalancerFactory.create({
            type: 'least-connections',
            servers: [{ url: 'a', isActive: true, connections: 0 } as any],
        });
        expect(strategy).toBeInstanceOf(LeastConnectionsLoadBalancer);
    });

    it('creates a random-choice strategy', () => {
        const strategy = LoadBalancerFactory.create({
            type: 'random-choice',
            servers: [{ url: 'a', isActive: true, connections: 0 } as any],
        });
        expect(strategy).toBeInstanceOf(RandomChoiceLoadBalancer);
    });

    it('creates a consistent-hash strategy', () => {
        const strategy = LoadBalancerFactory.create({
            type: 'consistent-hash',
            servers: [{ url: 'a', isActive: true }],
        });
        expect(strategy).toBeInstanceOf(ConsistentHashLoadBalancer);
    });
});
