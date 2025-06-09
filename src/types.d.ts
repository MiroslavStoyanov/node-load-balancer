declare module 'node-load-balancer' {
    export class IServer {
        url: string;
        isActive: boolean;
    }

    export class ILoadBalancer {
        constructor(options: IServer[]);
        getNextActiveServer(): Promise<IServer | null>;
        addServer(url: string, weight?: number): void;
        removeServer(url: string): void;
        disableServer(url: string): void;
        enableServer(url: string): void;
    }

    export interface ILoadBalancingStrategy {
        getNextActiveServer(): Promise<IServer | null>;
        addServer(url: string, weight?: number): void;
        removeServer(url: string): void;
        disableServer(url: string): void;
        enableServer(url: string): void;
    }

    export class LoadBalancer implements ILoadBalancingStrategy {
        constructor(strategy: ILoadBalancingStrategy);
        setStrategy(strategy: ILoadBalancingStrategy): void;
        getNextActiveServer(): Promise<IServer | null>;
        addServer(url: string, weight?: number): void;
        removeServer(url: string): void;
        disableServer(url: string): void;
        enableServer(url: string): void;
    }

    export interface IWeightedServer extends IServer {
        weight: number;
    }

    export class IWeightedRoundRobinLoadBalancer extends ILoadBalancer {
        adjustServerWeight(url: string, newWeight: number): void;
    }

    export class ILeastConnectionsLoadBalancer extends ILoadBalancer {
        releaseServer(url: string): void;
    }

    export class IRandomChoiceLoadBalancer extends ILoadBalancer {
        releaseServer(url: string): void;
    }

    export class IConsistentHashLoadBalancer extends ILoadBalancer {
        getServerForKey(key: string): IServer | null;
    }

    export class IIPHashLoadBalancer extends ILoadBalancer {
        getServerForRequest(requestIp: string): IServer | null;
    }

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
        static create(config: LoadBalancerFactoryConfig): ILoadBalancingStrategy;
    }
}
