import { IServer } from 'node-load-balancer';
import { ILoadBalancingStrategy } from './LoadBalancingStrategy';

export class LoadBalancer implements ILoadBalancingStrategy {
    private strategy: ILoadBalancingStrategy;

    constructor(strategy: ILoadBalancingStrategy) {
        this.strategy = strategy;
    }

    setStrategy(strategy: ILoadBalancingStrategy): void {
        this.strategy = strategy;
    }

    getNextActiveServer(): IServer | null {
        return this.strategy.getNextActiveServer();
    }

    addServer(url: string, weight?: number): void {
        this.strategy.addServer(url, weight);
    }

    removeServer(url: string): void {
        this.strategy.removeServer(url);
    }

    disableServer(url: string): void {
        this.strategy.disableServer(url);
    }

    enableServer(url: string): void {
        this.strategy.enableServer(url);
    }
}
