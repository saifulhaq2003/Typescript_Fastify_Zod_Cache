export function PerformanceTracker(label?: string) {
    return function (
        _target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const name = label ?? propertyKey;

            const start = performance.now();

            try {
                const result = await originalMethod.apply(this, args);
                return result;
            } finally {
                const end = performance.now();
                const timeTaken = (end - start).toFixed(2);

                console.log(`${name} took ${timeTaken} ms`);
            }
        };
        return descriptor;
    }
}