import { createProxyMiddleware, Options } from 'http-proxy-middleware';

import { IWeightedRoundRobinLoadBalancer, IWeightedServer } from 'node-load-balancer';

export class WeightedRoundRobinLoadBalancer implements IWeightedRoundRobinLoadBalancer {
    private servers: IWeightedServer[] = [];
    private totalWeight = 0;
    private currentIndex = 0;

    constructor(serverConfigs: IWeightedServer[]) {
        this.servers = serverConfigs.map(({ url, weight, isActive }: IWeightedServer) => ({
            url,
            weight,
            isActive
        }));
        this.totalWeight = this.servers.reduce((sum, server) => sum + server.weight, 0);
    }

    getNextActiveServer(): IWeightedServer | null {
        const activeServers = this.servers.filter(server => server.isActive);

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

    addServer(url: string, weight: number): void {
        this.servers.push({ url, weight, isActive: true });
    }

    removeServer(url: string): void {
        const serverIndex = this.servers.findIndex(server => server.url === url);

        if (serverIndex !== -1) {
            this.servers.splice(serverIndex, 1);
        }
    }

    disableServer(url: string): void {
        const server = this.servers.find(server => server.url === url);

        if (server) {
            server.isActive = false;
        }
    }

    enableServer(url: string): void {
        const server = this.servers.find(server => server.url === url);

        if (server) {
            server.isActive = true;
        }
    }

    adjustServerWeight(url: string, newWeight: number): void {
        const server = this.servers.find(server => server.url === url);

        if (server) {
            server.weight = newWeight;
            this.totalWeight = this.servers.reduce((sum, srv) => sum + srv.weight, 0);
        }
    }

    proxyMiddleware(): (req: any, res: any, next: () => void) => void {
        return (req: any, res: any, next: () => void) => {
            const activeServer = this.getNextActiveServer();

            if (activeServer) {
                const proxyOptions: Options = {
                    target: activeServer.url,
                    selfHandleResponse: true,
                };

                const proxy = createProxyMiddleware(proxyOptions);

                proxy(req, res, next);
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('No active servers available.');
            }
        };
    }
}
