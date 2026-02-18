import { EachMessagePayload, Kafka } from "kafkajs";

export class KafkaConsumer {
    private consumer;

    constructor(
        private readonly brokers: string[],
        private readonly groupId: string
    ) {
        const kafka = new Kafka({
            clientId: "document-worker",
            brokers: this.brokers
        });

        this.consumer = kafka.consumer({ groupId: this.groupId });
    }

    async connect() {
        await this.consumer.connect();
    }

    async subscribe(topic: string) {
        await this.consumer.subscribe({
            topic,
            fromBeginning: false,
        });
    }

    async run(handler: (payload: EachMessagePayload) => Promise<void>) {
        await this.consumer.run({
            eachMessage: async (payload) => {
                await handler(payload);
            },
        });
    }

}