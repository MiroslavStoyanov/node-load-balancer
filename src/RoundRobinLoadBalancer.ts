import { createProxyMiddleware, Options } from 'http-proxy-middleware';

import { ILoadBalancer, IServer } from 'node-load-balancer';

export class RoundRobinLoadBalancer implements ILoadBalancer {
    private servers: IServer[] = [];
    private currentIndex = 0;

    constructor (options: IServer[]) {
        this.servers = options.map(({ url, isActive }: IServer) => ({ url, isActive }));
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
