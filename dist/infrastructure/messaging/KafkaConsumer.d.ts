import { EachMessagePayload } from "kafkajs";
export declare class KafkaConsumer {
    private readonly brokers;
    private readonly groupId;
    private consumer;
    constructor(brokers: string[], groupId: string);
    connect(): Promise<void>;
    subscribe(topic: string): Promise<void>;
    run(handler: (payload: EachMessagePayload) => Promise<void>): Promise<void>;
}
//# sourceMappingURL=KafkaConsumer.d.ts.map