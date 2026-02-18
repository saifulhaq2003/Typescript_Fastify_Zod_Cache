export interface IEventPublisher {
    publish<T>(topic: string, message: T): Promise<void>;
}
//# sourceMappingURL=IEventPublisher.d.ts.map