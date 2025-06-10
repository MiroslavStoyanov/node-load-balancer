import { IServer } from 'node-load-balancer';
import { BaseLoadBalancer } from './BaseLoadBalancer';
import { ILoadBalancingStrategy } from './LoadBalancingStrategy';

interface ConnectionServer extends IServer {
    connections: number;
}

export class LeastConnectionsLoadBalancer extends BaseLoadBalancer<ConnectionServer> implements ILoadBalancingStrategy {
    constructor(servers: ConnectionServer[]) {
        super(servers);
        this.servers.forEach((s) => {
            s.connections = s.connections || 0;
        });
    }

    async getNextActiveServer(): Promise<ConnectionServer | null> {
        return this.mutex.runExclusive(() => {
            const activeServers = this.servers.filter((s) => s.isActive);
            if (activeServers.length === 0) {
                return null;
            }
            let selected = activeServers[0];
            for (const server of activeServers) {
                if (server.connections < selected.connections) {
                    selected = server;
                }
            }
            selected.connections++;
            return selected;
        });
    }

    releaseServer(url: string): void {
        const server = this.servers.find((s) => s.url === url);
        if (server && server.connections > 0) {
            server.connections--;
        }
    }
}
