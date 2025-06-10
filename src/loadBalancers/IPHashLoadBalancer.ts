import { IServer } from 'node-load-balancer';
import { BaseLoadBalancer } from './BaseLoadBalancer';
import { ILoadBalancingStrategy } from './LoadBalancingStrategy';

/**
 * Represents an IP hash load balancer that distributes incoming requests unevenly across backend servers.
 * The client’s IP address is hashed and the hash is used to determine which server to send the request to.
 */
export class IPHashLoadBalancer extends BaseLoadBalancer<IServer> implements ILoadBalancingStrategy {
    private currentIndex = 0;

    /**
     * Creates an instance of the IPHashLoadBalancer.
     * @param servers - An array of backend servers to send the requests across.
     */
    constructor(servers: IServer[]) {
        super(servers);
    }

    /**
     * Returns the next active server in a round-robin fashion.
     * This method is kept for compatibility with the base interface and does not
     * take the request IP into account. For IP-based routing, use
     * {@link getServerForRequest} instead.
     */
    async getNextActiveServer(): Promise<IServer | null> {
        return this.mutex.runExclusive(() => this.getNextServerRoundRobin());
    }

    private getNextServerRoundRobin(): IServer | null {
        const activeServers = this.servers.filter((server: IServer) => server.isActive);

        if (activeServers.length === 0) {
            return null;
        }

        const server = activeServers[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % activeServers.length;
        return server;
    }

    /**
     * Gets the server where the request needs to go based on the request IP.
     * @param requestIp - The IP of the client.
     */
    getServerForRequest(requestIp: string): IServer | null {
        if (this.servers.length === 0) {
            return null;
        }

        const ipHash = this.calculateIpHash(requestIp);
        const index = ipHash % this.servers.length;

        return this.servers[index];
    }

    private calculateIpHash(ip: string): number {
        let hash = 0;
        for (let i = 0; i < ip.length; i++) {
            hash = (hash << 5) - hash + ip.charCodeAt(i);
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }
}
