import { IIPHashLoadBalancer, IServer } from 'node-load-balancer';
import { BaseLoadBalancer } from './BaseLoadBalancer';

/**
 * Represents an IP hash load balancer that distributes incoming requests unevenly across backend servers.
 * The client’s IP address is hashed and the hash is used to determine which server to send the request to.
 */
export class IPHashLoadBalancer extends BaseLoadBalancer<IServer> implements IIPHashLoadBalancer {
    private currentIndex = 0;

    /**
     * Creates an instance of the IPHashLoadBalancer.
     * @param servers - An array of backend servers to send the requests across.
     */
    constructor(servers: IServer[]) {
        super(servers);
    }

    /**
     * Gets the next active server based on the IP hash logic.
     * @returns The next active server or null if no servers are available.
     */
    getNextActiveServer(): IServer | null {
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
