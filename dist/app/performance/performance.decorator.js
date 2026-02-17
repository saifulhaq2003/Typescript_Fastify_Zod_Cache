"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceTracker = PerformanceTracker;
function PerformanceTracker(label) {
    return function (_target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            const name = label ?? propertyKey;
            const start = performance.now();
            try {
                const result = await originalMethod.apply(this, args);
                return result;
            }
            finally {
                const end = performance.now();
                const timeTaken = (end - start).toFixed(2);
                console.log(`${name} took ${timeTaken} ms`);
            }
        };
        return descriptor;
    };
}
//# sourceMappingURL=performance.decorator.js.map