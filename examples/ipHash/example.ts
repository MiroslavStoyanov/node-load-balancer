import { IServer } from 'node-load-balancer';
import { IPHashLoadBalancer } from '../../src/loadBalancers/IPHashLoadBalancer';

const servers: IServer[] = [
    {
        url: 'http://server1',
        isActive: true,
    },
    {
        url: 'http://server2',
        isActive: true,
    },
    {
        url: 'http://server3',
        isActive: true,
    },
];

const ipHashLoadBalancer = new IPHashLoadBalancer(servers);

const requestIps = [
    '192.168.1.1',
    '192.168.1.2',
    '192.168.1.3',
    '192.168.1.3',
    '192.168.1.2',
    '192.168.1.2',
    '192.168.1.3',
];

requestIps.forEach((ip) => {
    const activeServer = ipHashLoadBalancer.getServerForRequest(ip);
    console.log(`Request from IP ${ip} sent to: ${activeServer?.url}`);
});
