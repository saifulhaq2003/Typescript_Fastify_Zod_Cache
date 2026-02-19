// src/infrastructure/messaging/KafkaProducer.ts
import { Kafka, Producer } from "kafkajs";

export class KafkaProducer {
    private producer: Producer;

    constructor(brokers: string[]) {
        const kafka = new Kafka({
            clientId: "document-service",
            brokers,
        });

        this.producer = kafka.producer();
    }

    async connect(): Promise<void> {
        await this.producer.connect();
    }

    async disconnect(): Promise<void> {
        await this.producer.disconnect();
    }

    async send<T>(topic: string, message: T): Promise<void> {
        await this.producer.send({
            topic,
            messages: [{ value: JSON.stringify(message) }],
        });
    }
}