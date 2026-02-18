"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheGet = CacheGet;
exports.CachePurge = CachePurge;
const redis_1 = require("../../entry/redis");
function CacheGet(prefix, ttlSeconds = 60) {
    return function (_target, _propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            const cacheKey = `${prefix}:${JSON.stringify(args)}`;
            try {
                const cached = await redis_1.redisClient.get(cacheKey);
                if (cached) {
                    console.log("CACHE HIT:", cacheKey);
                    return JSON.parse(cached);
                }
            }
            catch (err) {
                console.warn("Redis unavailable -> fallback to DB");
            }
            const result = await originalMethod.apply(this, args);
            try {
                await redis_1.redisClient.set(cacheKey, JSON.stringify(result), {
                    EX: ttlSeconds,
                });
            }
            catch {
                console.warn("Redis set failed — ignored");
            }
            return result;
        };
        return descriptor;
    };
}
function CachePurge(patterns) {
    return function (_target, _propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            const result = await originalMethod.apply(this, args);
            try {
                for (const pattern of patterns) {
                    let cursor = "0";
                    do {
                        const scanResult = await redis_1.redisClient.scan(cursor, {
                            MATCH: pattern,
                            COUNT: 100,
                        });
                        cursor = scanResult.cursor;
                        if (scanResult.keys.length > 0) {
                            await redis_1.redisClient.del(scanResult.keys);
                        }
                    } while (cursor !== "0");
                }
            }
            catch {
                console.warn("Redis purge skipped (redis down)");
            }
            return result;
        };
        return descriptor;
    };
}
//# sourceMappingURL=cache.decorators.js.map