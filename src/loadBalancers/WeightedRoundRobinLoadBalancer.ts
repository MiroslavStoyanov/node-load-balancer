import { IWeightedRoundRobinLoadBalancer, IWeightedServer } from 'node-load-balancer';

/**
 * Represents a weighted round-robin load balancer that distributes incoming requests unevenly across backend servers.
 * Each server is given a weight, allowing some severs to receive more of the traffic than others.
 */
export class WeightedRoundRobinLoadBalancer implements IWeightedRoundRobinLoadBalancer {
    private servers: IWeightedServer[] = [];
    private totalWeight = 0;
    private currentIndex = 0;

    /**
     * Creates an instance of the WeightedRoundRobinLoadBalancer.
     * It initializes the list of servers that are used to spread the load unevenly and
     * the total weight of the servers based on predefined data which is needed to determine
     * where the request needs to be sent
     * @param servers - An array of backend servers to send the requests across.
     */
    constructor(servers: IWeightedServer[]) {
        this.servers = servers;
        this.totalWeight = this.servers.reduce((sum, server) => sum + server.weight, 0);
    }

    /**
     * Gets the next active server based on the weighted round-robin logic.
     * @returns The next active server or null if no servers are available.
     */
    getNextActiveServer(): IWeightedServer | null {
        const activeServers = this.servers.filter((server: IWeightedServer) => server.isActive);

        if (activeServers.length === 0) {
            return null;
        }

        let index = this.currentIndex;
        let currentWeight = 0;

        do {
            currentWeight += activeServers[index].weight;
            if (++index >= activeServers.length) {
                index = 0;
            }
        } while (currentWeight < this.totalWeight);

        this.currentIndex = index;
        return activeServers[index];
    }

    /**
     * Adds a new server based on the weighted round-robin logic.
     * @param url - The URL of the new server that is going to be added to the array.
     */
    addServer(url: string, weight: number): void {
        this.servers.push({ url, weight, isActive: true });
    }

    /**
     * Removes a server based on the weighted round-robin logic.
     * @param url - The URL of the server that is going to be removed from the array.
     */
    removeServer(url: string): void {
        const serverIndex = this.servers.findIndex((server: IWeightedServer) => server.url === url);

        if (serverIndex !== -1) {
            this.servers.splice(serverIndex, 1);
        }
    }

    /**
     * Disables a server from the list of active ones but does not remove it.
     * @param url - The URL of the server that needs to be tagged as inactive.
     */
    disableServer(url: string): void {
        const server = this.servers.find((server: IWeightedServer) => server.url === url);

        if (server) {
            server.isActive = false;
        }
    }

    /**
     * Enables a server that was previously disabled.
     * @param url - The URL of the server that needs to be tagged as active.
     */
    enableServer(url: string): void {
        const server = this.servers.find((server: IWeightedServer) => server.url === url);

        if (server) {
            server.isActive = true;
        }
    }

    /**
     * Adjusts the server weight based on the weighted round-robin logic.
     * @param url - The URL of the server whose weight needs to be adjusted.
     * @param newWeight - The new weight of the server
     */
    adjustServerWeight(url: string, newWeight: number): void {
        const server = this.servers.find((server: IWeightedServer) => server.url === url);

        if (server) {
            server.weight = newWeight;
            this.totalWeight = this.servers.reduce((sum, srv) => sum + srv.weight, 0);
        }
    }
}
