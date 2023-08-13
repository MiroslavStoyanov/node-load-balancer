import { IIPHashLoadBalancer, IServer } from 'node-load-balancer';

/**
 * Represents an IP hash load balancer that distributes incoming requests unevenly across backend servers.
 * The client’s IP address is hashed and the hash is used to determine which server to send the request to.
 */
export class IPHashLoadBalancer implements IIPHashLoadBalancer {
    private servers: IServer[] = [];
    private currentIndex = 0;

    /**
     * Creates an instance of the IPHashLoadBalancer.
     * @param servers - An array of backend servers to sendthe requests across.
     */
    constructor(servers: IServer[]) {
        this.servers = servers;
    }

    /**
     * Gets the next active server based on the IP hash logic.
     * @returns The next active server or null if no servers are available.
     */
    getNextActiveServer(): IServer | null {
        const activeServers = this.servers.filter(server => server.isActive);

        if (activeServers.length === 0) {
            return null;
        }

        const server = activeServers[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % activeServers.length;
        return server;
    }

    /**
     * Adds a new server based on on the IP hash logic.
     * @param url - The URL of the new server that is going to be added to the array.
     */
    addServer(url: string): void {
        this.servers.push({ url, isActive: true });
    }

    /**
     * Removes a server based on the IP hash logic.
     * @param url - The URL of the server that is going to be removed from the array.
     */
    removeServer(url: string): void {
        const serverIndex = this.servers.findIndex(server => server.url === url);

        if (serverIndex !== -1) {
            this.servers.splice(serverIndex, 1);
        }
    }

    /**
     * Disables a server from the list of active ones but does not remove it.
     * @param url - The URL of the server that needs to be tagged as inactive.
     */
    disableServer(url: string): void {
        const server = this.servers.find(server => server.url === url);

        if (server) {
            server.isActive = false;
        }
    }

    /**
     * Enables a server that was previously disabled.
     * @param url - The URL of the server that needs to be tagged as active.
     */
    enableServer(url: string): void {
        const server = this.servers.find(server => server.url === url);

        if (server) {
            server.isActive = true;
        }
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
