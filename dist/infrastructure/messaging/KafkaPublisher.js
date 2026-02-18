"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaPublisher = void 0;
const kafkajs_1 = require("kafkajs");
class KafkaPublisher {
    constructor(brokers) {
        const kafka = new kafkajs_1.Kafka({
            clientId: "document-service",
            brokers,
        });
        this.producer = kafka.producer();
    }
    async connect() {
        await this.producer.connect();
    }
    async publish(topic, message) {
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
exports.KafkaPublisher = KafkaPublisher;
//# sourceMappingURL=KafkaPublisher.js.map