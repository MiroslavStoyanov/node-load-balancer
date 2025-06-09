import { IServer, IWeightedServer } from 'node-load-balancer';
import { IPHashLoadBalancer } from './IPHashLoadBalancer';
import { RoundRobinLoadBalancer } from './RoundRobinLoadBalancer';
import { WeightedRoundRobinLoadBalancer } from './WeightedRoundRobinLoadBalancer';
import { LeastConnectionsLoadBalancer } from './LeastConnectionsLoadBalancer';
import { RandomChoiceLoadBalancer } from './RandomChoiceLoadBalancer';
import { ConsistentHashLoadBalancer } from './ConsistentHashLoadBalancer';
import { ILoadBalancingStrategy } from './LoadBalancingStrategy';

export type LoadBalancerType =
    | 'round-robin'
    | 'weighted-round-robin'
    | 'ip-hash'
    | 'least-connections'
    | 'random-choice'
    | 'consistent-hash';

export interface LoadBalancerFactoryConfig {
    type: LoadBalancerType;
    servers: Array<IServer | IWeightedServer>;
}

export class LoadBalancerFactory {
    static create(config: LoadBalancerFactoryConfig): ILoadBalancingStrategy {
        switch (config.type) {
            case 'round-robin':
                return new RoundRobinLoadBalancer(config.servers as IServer[]);
            case 'weighted-round-robin':
                return new WeightedRoundRobinLoadBalancer(config.servers as IWeightedServer[]);
            case 'ip-hash':
                return new IPHashLoadBalancer(config.servers as IServer[]);
            case 'least-connections':
                return new LeastConnectionsLoadBalancer(config.servers as any);
            case 'random-choice':
                return new RandomChoiceLoadBalancer(config.servers as any);
            case 'consistent-hash':
                return new ConsistentHashLoadBalancer(config.servers as IServer[]);
            default:
                throw new Error(`Unknown load balancer type: ${config.type}`);
        }
    }
}
