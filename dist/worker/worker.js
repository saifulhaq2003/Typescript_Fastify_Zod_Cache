"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const KafkaConsumer_1 = require("../infrastructure/messaging/KafkaConsumer");
const DocumentEventHandler_1 = require("./DocumentEventHandler");
require("dotenv/config");
async function startWorker() {
    const consumer = new KafkaConsumer_1.KafkaConsumer(process.env.KAFKA_BROKERS?.split(",") ?? ["localhost:9092"], "document-worker-group");
    const handler = new DocumentEventHandler_1.DocumentEventHandler();
    await consumer.connect();
    await consumer.subscribe("document.created");
    await consumer.run(async ({ message }) => {
        if (!message.value)
            return;
        const event = JSON.parse(message.value.toString());
        if (event.event === "document.created") {
            await handler.handle(event);
        }
    });
    console.log("Worker is running...");
}
startWorker();
//# sourceMappingURL=worker.js.map