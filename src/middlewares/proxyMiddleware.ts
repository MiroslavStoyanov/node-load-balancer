import axios from 'axios';
import { ILoadBalancingStrategy } from '../loadBalancers/LoadBalancingStrategy';
import { Request, Response } from 'express';

export function proxyMiddleware(loadBalancer: ILoadBalancingStrategy) {
    return async (req: Request, res: Response) => {
        try {
            const activeServer = await loadBalancer.getNextActiveServer();

            if (!activeServer) {
                throw new Error('No active servers available.');
            }

            const response = await axios({
                method: req.method,
                url: activeServer.url + req.originalUrl,
                data: req.body,
                headers: req.headers,
            });

            res.status(response.status).send(response.data);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    };
}
