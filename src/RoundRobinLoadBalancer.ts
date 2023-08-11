import { createProxyMiddleware, Options } from 'http-proxy-middleware';

import { IServerOptions, IRoundRobinLoadBalancer, IServer } from 'sample-load-balancer';

export class RoundRobinLoadBalancer implements IRoundRobinLoadBalancer {
    private servers: IServer[] = [];
    private currentIndex = 0;

    constructor (options: IServerOptions) {
        this.servers = options.serverUrls.map(url => ({ url, isActive: true }));
    }

    getNextActiveServer(): IServer | null {
        const activeServers = this.servers.filter(server => server.isActive);

        if (activeServers.length === 0) {
            return null;
        }

        const server = activeServers[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % activeServers.length;
        return server;
    }

    addServer(url: string) {
        this.servers.push({ url, isActive: true });
    }

    removeServer(url: string) {
        const serverIndex = this.servers.findIndex(server => server.url === url);

        if (serverIndex !== -1) {
            this.servers.splice(serverIndex, 1);
        }
    }

    disableServer(url: string) {
        const server = this.servers.find(server => server.url === url);

        if (server) {
            server.isActive = false;
        }
    }

    enableServer(url: string) {
        const server = this.servers.find(server => server.url === url);

        if (server) {
            server.isActive = true;
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
