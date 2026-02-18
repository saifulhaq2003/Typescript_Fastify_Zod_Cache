import { KafkaConsumer } from "../infrastructure/messaging/KafkaConsumer";
import { DocumentEventHandler } from "./DocumentEventHandler";
import { DocumentCreatedEvent } from "../contracts/events/document.event";
import "dotenv/config";
async function startWorker() {
    // ✅ was: new KafkaConsumer(["localhost:9092"], "document-worker-group")
    const consumer = new KafkaConsumer(
        process.env.KAFKA_BROKERS?.split(",") ?? ["localhost:9092"],
        "document-worker-group"
    );

    const handler = new DocumentEventHandler();

    await consumer.connect();
    await consumer.subscribe("document.created");

    await consumer.run(async ({ message }) => {
        if (!message.value) return;

        const event = JSON.parse(message.value.toString()) as DocumentCreatedEvent;

        if (event.event === "document.created") {
            await handler.handle(event);
        }
    });

    console.log("Worker is running...");
}

startWorker();