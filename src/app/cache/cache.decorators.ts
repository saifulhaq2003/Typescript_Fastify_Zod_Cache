import { redisClient } from "../../entry/redis";

export function CacheGet(prefix: string, ttlSeconds = 60) {
    return function (
        _target: any, //defines where object is defined, _ for that the parameter is not used but received by the decorator function
        _propertyKey: string, //name of the method being decorated
        descriptor: PropertyDescriptor // descriptor.value allows to Whenever someone calls getDocument, run my code instead.
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const cacheKey = `${prefix}:${JSON.stringify(args)}`;

            const cached = await redisClient.get(cacheKey);
            if (cached) {
                return {
                    source: "cache",
                    data: JSON.parse(cached),
                }
            }

            const result = await originalMethod.apply(this, args);

            await redisClient.set(cacheKey, JSON.stringify(result), {
                EX: ttlSeconds,
            });

            return {
                source: "db",
                data: result,
            }

        };
        return descriptor
    };
}

