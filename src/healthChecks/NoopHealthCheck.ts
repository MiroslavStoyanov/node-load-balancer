import { IServer } from 'node-load-balancer';
import { IHealthCheckStrategy } from './IHealthCheckStrategy';

export class NoopHealthCheck implements IHealthCheckStrategy {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async check(_server?: IServer): Promise<boolean> {
        return true;
    }
}
