import { IWeightedRoundRobinLoadBalancer, IWeightedServer } from 'node-load-balancer';
import { BaseLoadBalancer } from './BaseLoadBalancer';

/**
 * Represents a weighted round-robin load balancer that distributes incoming requests unevenly across backend servers.
 * Each server is given a weight, allowing some servers to receive more of the traffic than others.
 */
export class WeightedRoundRobinLoadBalancer
    extends BaseLoadBalancer<IWeightedServer>
    implements IWeightedRoundRobinLoadBalancer
{
    private remainingServerCapacity: Array<{ server: IWeightedServer; capacity: number }> = [];
    private currentIndex = 0;

    /**
     * Creates an instance of the WeightedRoundRobinLoadBalancer.
     * It initializes the list of servers that are used to spread the load unevenly and
     * the total weight of the servers based on predefined data which is needed to determine
     * where the request needs to be sent
     * @param servers - An array of backend servers to send the requests across.
     */
    constructor(servers: IWeightedServer[]) {
        super(servers);
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

        // short-circuit if just 1 server
        if (activeServers.length === 1) {
            return activeServers[0];
        }

        if (this.remainingServerCapacity.length === 0) {
            this.remainingServerCapacity = activeServers.map((server: IWeightedServer) => ({
                server,
                capacity: server.weight,
            }));
        }

        while (true) {
            // Loop through the servers
            const serverInfo = this.remainingServerCapacity[this.currentIndex];

            if (serverInfo.capacity > 0) {
                // This server can handle more requests
                serverInfo.capacity--;

                if (serverInfo.capacity === 0) {
                    // If this server is drained, increment currentIndex
                    this.currentIndex = (this.currentIndex + 1) % activeServers.length;
                }

                return serverInfo.server;
            } else {
                // Check if all servers are drained
                const allDrained = this.remainingServerCapacity.every((info) => info.capacity === 0);

                if (allDrained) {
                    // Rehydrate all servers
                    this.remainingServerCapacity.forEach((info) => (info.capacity = info.server.weight));
                } else {
                    // Move to the next server
                    this.currentIndex = (this.currentIndex + 1) % activeServers.length;
                }
            }
        }
    }

    /**
     * Adds a new server based on the weighted round-robin logic.
     * @param url - The URL of the new server that is going to be added to the array.
     */
    addServer(url: string, weight: number): void {
        this.servers.push({ url, weight, isActive: true });
        this.remainingServerCapacity = [];
        this.currentIndex = 0;
    }

    /**
     * Removes a server based on the weighted round-robin logic.
     * @param url - The URL of the server that is going to be removed from the array.
     */
    removeServer(url: string): void {
        super.removeServer(url);
        this.remainingServerCapacity = [];
        this.currentIndex = 0;
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
        }
    }
}
