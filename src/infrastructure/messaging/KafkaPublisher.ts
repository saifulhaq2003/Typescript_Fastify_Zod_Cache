import { Kafka } from "kafkajs"
import { IEventPublisher } from "src/contracts/messaging/IEventPublisher";

export class KafkaPublisher implements IEventPublisher {
    private producer;

    constructor(brokers: string[]) {
        const kafka = new Kafka({
            clientId: "document-service",
            brokers,
        });
        this.producer = kafka.producer();
    }

    async connect() {
        await this.producer.connect();
    }

    async publish<T>(topic: string, message: T): Promise<void> {
        await this.producer.send({
            topic,
            messages: [
                {
                    value: JSON.stringify(message),
                },
            ],
        });
    }
}