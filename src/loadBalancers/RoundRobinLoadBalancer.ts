import { ILoadBalancer, IServer } from 'node-load-balancer';

/**
 * Represents a round-robin load balancer that distributes incoming requests evenly across backend servers.
 * Distributes the traffic to the load balancers in rotation, each request going to the next backend server in the list.
 * Once the end of the list is reached, it loops back to the first server.
 */
export class RoundRobinLoadBalancer implements ILoadBalancer {
    private servers: IServer[] = [];
    private currentIndex = 0;

    /**
     * Creates an instance of the RoundRobinLoadBalancer.
     * @param servers - An array of backend servers to balance the requests across.
     */
    constructor(servers: IServer[]) {
        this.servers = servers;
    }

    /**
     * Gets the next active server based on the round-robin logic.
     * @returns The next active server or null if no servers are available.
     */
    getNextActiveServer(): IServer | null {
        const activeServers = this.servers.filter((server: IServer) => server.isActive);

        if (activeServers.length === 0) {
            return null;
        }

        // short-circuit if just 1 server
        if (activeServers.length === 1) {
            return activeServers[0];
        }

        const server = activeServers[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % activeServers.length;
        return server;
    }

    /**
     * Adds a new server based on the round-robin logic.
     * @param url - The URL of the new server that is going to be added to the array.
     */
    addServer(url: string): void {
        this.servers.push({ url, isActive: true });
    }

    /**
     * Removes a server based on the round-robin logic.
     * @param url - The URL of the server that is going to be removed from the array.
     */
    removeServer(url: string) {
        const serverIndex = this.servers.findIndex((server: IServer) => server.url === url);

        if (serverIndex !== -1) {
            this.servers.splice(serverIndex, 1);
        }
    }

    /**
     * Disables a server from the list of active ones but does not remove it.
     * @param url - The URL of the server that needs to be tagged as inactive.
     */
    disableServer(url: string): void {
        const server = this.servers.find((server: IServer) => server.url === url);

        if (server) {
            server.isActive = false;
        }
    }

    /**
     * Enables a server that was previously disabled.
     * @param url - The URL of the server that needs to be tagged as active.
     */
    enableServer(url: string): void {
        const server = this.servers.find((server: IServer) => server.url === url);

        if (server) {
            server.isActive = true;
        }
    }
}
