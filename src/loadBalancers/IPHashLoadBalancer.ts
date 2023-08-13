import { IIPHashLoadBalancer, IServer } from 'node-load-balancer';

export class IPHashLoadBalancer implements IIPHashLoadBalancer {
    private servers: IServer[] = [];
    private currentIndex = 0;

    constructor(options: IServer[]) {
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

    addServer(url: string, weight?: number | undefined): void {
        this.servers.push({ url, isActive: true });
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
