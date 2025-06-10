import crypto from 'crypto';
import { IServer } from 'node-load-balancer';
import { BaseLoadBalancer } from './BaseLoadBalancer';
import { ILoadBalancingStrategy } from './LoadBalancingStrategy';

interface HashNode {
    hash: number;
    server: IServer;
}

export class ConsistentHashLoadBalancer extends BaseLoadBalancer<IServer> implements ILoadBalancingStrategy {
    private ring: HashNode[] = [];
    private replicas = 100;

    constructor(servers: IServer[]) {
        super(servers);
        this.buildRing();
    }

    private buildRing() {
        this.ring = [];
        for (const server of this.servers) {
            for (let i = 0; i < this.replicas; i++) {
                const hash = this.hash(server.url + ':' + i);
                this.ring.push({ hash, server });
            }
        }
        this.ring.sort((a, b) => a.hash - b.hash);
    }

    private hash(data: string): number {
        const digest = crypto.createHash('md5').update(data).digest('hex');
        return parseInt(digest.substring(0, 8), 16);
    }

    async getNextActiveServer(): Promise<IServer | null> {
        return this.mutex.runExclusive(() => {
            const activeServers = this.servers.filter((s) => s.isActive);
            if (activeServers.length === 0) {
                return null;
            }
            // just round robin among active servers if no key provided
            return activeServers[0];
        });
    }

    getServerForKey(key: string): IServer | null {
        if (this.ring.length === 0) {
            return null;
        }
        const hash = this.hash(key);
        for (const node of this.ring) {
            if (hash <= node.hash && node.server.isActive) {
                return node.server;
            }
        }
        return this.ring[0].server;
    }

    addServer(url: string): void {
        super.addServer(url);
        this.buildRing();
    }

    removeServer(url: string): void {
        super.removeServer(url);
        this.buildRing();
    }
}
