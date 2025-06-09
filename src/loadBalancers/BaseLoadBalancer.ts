import { IServer } from 'node-load-balancer';
import { ILoadBalancingStrategy } from './LoadBalancingStrategy';

export abstract class BaseLoadBalancer<T extends IServer> implements ILoadBalancingStrategy {
    protected servers: T[];

    constructor(servers: T[]) {
        this.servers = servers;
    }

    abstract getNextActiveServer(): T | null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addServer(url: string, _weight?: number): void {
        this.servers.push({ url, isActive: true } as T);
    }

    removeServer(url: string): void {
        const serverIndex = this.servers.findIndex((server: T) => server.url === url);

        if (serverIndex !== -1) {
            this.servers.splice(serverIndex, 1);
        }
    }

    disableServer(url: string): void {
        const server = this.servers.find((server: T) => server.url === url);

        if (server) {
            server.isActive = false;
        }
    }

    enableServer(url: string): void {
        const server = this.servers.find((server: T) => server.url === url);

        if (server) {
            server.isActive = true;
        }
    }
}
