import { IEventPublisher } from "src/contracts/messaging/IEventPublisher";
export declare class KafkaPublisher implements IEventPublisher {
    private producer;
    constructor(brokers: string[]);
    connect(): Promise<void>;
    publish<T>(topic: string, message: T): Promise<void>;
}
//# sourceMappingURL=KafkaPublisher.d.ts.map