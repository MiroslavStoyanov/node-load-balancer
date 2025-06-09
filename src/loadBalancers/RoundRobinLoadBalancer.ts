import { IServer } from 'node-load-balancer';
import { BaseLoadBalancer } from './BaseLoadBalancer';
import { ILoadBalancingStrategy } from './LoadBalancingStrategy';

/**
 * Represents a round-robin load balancer that distributes incoming requests evenly across backend servers.
 * Distributes the traffic to the load balancers in rotation, each request going to the next backend server in the list.
 * Once the end of the list is reached, it loops back to the first server.
 */
export class RoundRobinLoadBalancer extends BaseLoadBalancer<IServer> implements ILoadBalancingStrategy {
    private currentIndex = 0;

    /**
     * Creates an instance of the RoundRobinLoadBalancer.
     * @param servers - An array of backend servers to balance the requests across.
     */
    constructor(servers: IServer[]) {
        super(servers);
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
}
