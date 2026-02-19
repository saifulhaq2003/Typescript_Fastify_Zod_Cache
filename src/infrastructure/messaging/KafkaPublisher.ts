
import { IEventPublisher } from "../../contracts/messaging/IEventPublisher";
import { KafkaProducer } from "./KafkaProducer";

export class KafkaPublisher implements IEventPublisher {
    constructor(private readonly producer: KafkaProducer) { }

    async publish<T>(topic: string, message: T): Promise<void> {
        await this.producer.send(topic, message);
    }
}