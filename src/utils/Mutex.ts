export class Mutex {
    private queue: Array<() => void> = [];
    private locked = false;

    async acquire(): Promise<() => void> {
        return new Promise((resolve) => {
            const release = () => {
                const next = this.queue.shift();
                if (next) {
                    next();
                } else {
                    this.locked = false;
                }
            };

            if (this.locked) {
                this.queue.push(() => resolve(release));
            } else {
                this.locked = true;
                resolve(release);
            }
        });
    }

    async runExclusive<T>(callback: () => Promise<T> | T): Promise<T> {
        const release = await this.acquire();
        try {
            return await callback();
        } finally {
            release();
        }
    }
}
