import { LoadBalancer } from './LoadBalancer';

export class IPHashLoadBalancer extends LoadBalancer {
  constructor(serverUrls: string[]) {
    super(serverUrls);
  }

  getServerForRequest(requestIp: string): Server | null {
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
