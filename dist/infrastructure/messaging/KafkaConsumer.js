"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaConsumer = void 0;
const kafkajs_1 = require("kafkajs");
class KafkaConsumer {
    constructor(brokers, groupId) {
        this.brokers = brokers;
        this.groupId = groupId;
        const kafka = new kafkajs_1.Kafka({
            clientId: "document-worker",
            brokers: this.brokers
        });
        this.consumer = kafka.consumer({ groupId: this.groupId });
    }
    async connect() {
        await this.consumer.connect();
    }
    async subscribe(topic) {
        await this.consumer.subscribe({
            topic,
            fromBeginning: false,
        });
    }
    async run(handler) {
        await this.consumer.run({
            eachMessage: async (payload) => {
                await handler(payload);
            },
        });
    }
}
exports.KafkaConsumer = KafkaConsumer;
//# sourceMappingURL=KafkaConsumer.js.map