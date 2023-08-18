declare module 'node-load-balancer' {
    export class IServer {
        url: string;
        isActive: boolean;
    }

    export class ILoadBalancer {
        constructor(options: IServer[]);
        getNextActiveServer(): IServer | null;
        addServer(url: string, weight?: number): void;
        removeServer(url: string): void;
        disableServer(url: string): void;
        enableServer(url: string): void;
    }

    export interface IWeightedServer extends IServer {
        weight: number;
    }

    export class IWeightedRoundRobinLoadBalancer extends ILoadBalancer {
        adjustServerWeight(url: string, newWeight: number): void;
    }

    export class IIPHashLoadBalancer extends ILoadBalancer {
        getServerForRequest(requestIp: string): IServer | null;
    }
}
