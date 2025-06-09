import { IServer } from 'node-load-balancer';
import { BaseLoadBalancer } from './BaseLoadBalancer';
import { ILoadBalancingStrategy } from './LoadBalancingStrategy';

interface RandomServer extends IServer {
    connections: number;
}

export class RandomChoiceLoadBalancer extends BaseLoadBalancer<RandomServer> implements ILoadBalancingStrategy {
    constructor(
        servers: RandomServer[],
        private subsetSize = 2,
    ) {
        super(servers);
        this.servers.forEach((s) => (s.connections = s.connections || 0));
    }

    async getNextActiveServer(): Promise<RandomServer | null> {
        return this.mutex.runExclusive(() => {
            const activeServers = this.servers.filter((s) => s.isActive);
            if (activeServers.length === 0) {
                return null;
            }
            const choices: RandomServer[] = [];
            for (let i = 0; i < this.subsetSize; i++) {
                const rand = Math.floor(Math.random() * activeServers.length);
                choices.push(activeServers[rand]);
            }
            let selected = choices[0];
            for (const server of choices) {
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
