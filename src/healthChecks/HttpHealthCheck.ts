import axios from 'axios';
import { IServer } from 'node-load-balancer';
import { IHealthCheckStrategy } from './IHealthCheckStrategy';

export class HttpHealthCheck implements IHealthCheckStrategy {
    constructor(private path = '/health') {}

    async check(server: IServer): Promise<boolean> {
        try {
            const response = await axios.get(server.url + this.path);
            return response.status >= 200 && response.status < 300;
        } catch {
            return false;
        }
    }
}
