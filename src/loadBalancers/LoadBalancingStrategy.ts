export interface ILoadBalancingStrategy {
    getNextActiveServer(): Promise<{ url: string; isActive: boolean } | null>;
    addServer(url: string, weight?: number): void;
    removeServer(url: string): void;
    disableServer(url: string): void;
    enableServer(url: string): void;
}
