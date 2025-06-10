import { IServer } from 'node-load-balancer';
import { ILoadBalancingStrategy } from './LoadBalancingStrategy';
import { IHealthCheckStrategy } from '../healthChecks/IHealthCheckStrategy';
import { NoopHealthCheck } from '../healthChecks/NoopHealthCheck';
import { Mutex } from '../utils/Mutex';

export abstract class BaseLoadBalancer<T extends IServer> implements ILoadBalancingStrategy {
    protected servers: T[];
    protected healthCheck: IHealthCheckStrategy;
    protected mutex = new Mutex();

    constructor(servers: T[], healthCheck: IHealthCheckStrategy = new NoopHealthCheck()) {
        this.servers = servers;
        this.healthCheck = healthCheck;
    }

    abstract getNextActiveServer(): Promise<T | null>;

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

    async startHealthCheck(interval = 10000): Promise<void> {
        setInterval(async () => {
            for (const server of this.servers) {
                server.isActive = await this.healthCheck.check(server);
            }
        }, interval);
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
