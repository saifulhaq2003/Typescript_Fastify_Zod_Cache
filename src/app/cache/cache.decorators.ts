import { redisClient } from "../../entry/redis";

export function CacheGet(
    prefix: string,
    margs: string[],  // fields from command object
    ttlSeconds = 60
) {
    return function (
        _target: any,//defines where object is defined, _ for that the parameter is not used but received by the decorator function
        _propertyKey: string,//name of the method being decorated
        descriptor: PropertyDescriptor //descriptor.value allows to Whenever someone calls getDocument, run my code instead.
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const command = args[0] ?? {};

            const cacheKeySegments = [prefix];

            for (const field of margs) {
                cacheKeySegments.push(String(command[field]));
            }

            const cacheKey = cacheKeySegments.join(":");

            try {
                const cached = await redisClient.get(cacheKey);

                if (cached) {
                    console.log("CACHE HIT:", cacheKey);
                    return JSON.parse(cached);
                }
            } catch (err) {
                console.warn("Redis unavailable → fallback to DB");
            }

            console.log("CACHE MISS:", cacheKey);

            const result = await originalMethod.apply(this, args);

            if (result !== undefined && result !== null) {
                try {
                    await redisClient.set(cacheKey, JSON.stringify(result), {
                        EX: ttlSeconds,
                    });
                } catch {
                    console.warn("Redis set failed — ignored");
                }
            }

            return result;
        };

        return descriptor;
    };
}


export function CachePurge(
    prefix: string,
    margs: string[]
) {
    return function (
        _target: any,
        _propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const result = await originalMethod.apply(this, args);

            try {
                if (margs.length > 0) {
                    const command = args[0];
                    const cacheKeySegments = [prefix];

                    for (const field of margs) {
                        cacheKeySegments.push(String(command[field]));
                    }
                    const cacheKey = cacheKeySegments.join(":");
                    await redisClient.del(cacheKey);
                    console.log("Cache purged:", cacheKey);
                }
                else {
                    let cursor = "0";

                    do {
                        const scanResult = await redisClient.scan(cursor, {
                            MATCH: `${prefix}:*`,
                            COUNT: 100,
                        });

                        cursor = scanResult.cursor;

                        if (scanResult.keys.length > 0) {
                            await redisClient.del(scanResult.keys);
                        }
                    } while (cursor !== "0");

                    console.log("Namespace purged:", prefix);
                }
            } catch {
                console.warn("Redis purge skipped (redis down)");
            }
            return result;
        };

        return descriptor;
    };
}