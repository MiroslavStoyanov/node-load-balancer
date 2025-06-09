import { IServer } from 'node-load-balancer';

export interface IHealthCheckStrategy {
    check(server: IServer): Promise<boolean>;
}
