import { IWeightedServer } from 'node-load-balancer';
import { BaseLoadBalancer } from './BaseLoadBalancer';
import { ILoadBalancingStrategy } from './LoadBalancingStrategy';

interface InternalWeightedServer extends IWeightedServer {
    currentWeight: number;
}

export class WeightedRoundRobinLoadBalancer
    extends BaseLoadBalancer<InternalWeightedServer>
    implements ILoadBalancingStrategy
{
    private totalWeight = 0;

    constructor(servers: IWeightedServer[]) {
        super(servers as InternalWeightedServer[]);
        this.initialize();
    }

    private initialize() {
        this.totalWeight = this.servers.reduce((acc, s) => acc + s.weight, 0);
        this.servers.forEach((s) => {
            s.currentWeight = 0;
        });
    }

    async getNextActiveServer(): Promise<InternalWeightedServer | null> {
        return this.mutex.runExclusive(() => {
            const activeServers = this.servers.filter((s) => s.isActive && s.weight > 0);
            if (activeServers.length === 0) {
                return null;
            }
            let selected: InternalWeightedServer | null = null;
            for (const server of activeServers) {
                server.currentWeight += server.weight;
                if (!selected || server.currentWeight > selected.currentWeight) {
                    selected = server;
                }
            }
            if (!selected) {
                return null;
            }
            selected.currentWeight -= this.totalWeight;
            return selected;
        });
    }

    addServer(url: string, weight: number): void {
        this.servers.push({ url, weight, isActive: true, currentWeight: 0 });
        this.initialize();
    }

    removeServer(url: string): void {
        super.removeServer(url);
        this.initialize();
    }

    adjustServerWeight(url: string, newWeight: number): void {
        const server = this.servers.find((s) => s.url === url);
        if (server) {
            server.weight = newWeight;
            this.initialize();
        }
    }
}
