declare module 'sample-load-balancer' {
    export interface IServerOptions {
        serverUrls: string[];
    }

    export class IServer {
        url: string;
        isActive: boolean;
    }

    export class IRoundRobinLoadBalancer {
        constructor(options: IServerOptions);
        getNextActiveServer(): IServer | null;
        addServer(url: string, weight?: number): void;
        removeServer(url: string): void;
        disableServer(url: string): void;
        enableServer(url: string): void;
        proxyMiddleware(): void;
    }

    export interface IWeightedServerOptions {
        url: string;
        weight: number;
    }

    export interface IWeightedServer {
        url: string;
        isActive: boolean;
        weight: number;
    }

    export class IWeightedRoundRobinLoadBalancer {
        constructor(options: IWeightedServerOptions[]);
        getNextActiveServer(): IWeightedServer | null;
        addServer(url: string, weight?: number): void;
        removeServer(url: string): void;
        disableServer(url: string): void;
        enableServer(url: string, weight: number): void;
        adjustServerWeight(url: string, newWeight: number): void;
        proxyMiddleware(): void;
    }
}