import { KafkaConsumer } from "../infrastructure/messaging/KafkaConsumer";
import { DocumentProcessingServices } from "../app/services/DocumentProcessingServices";
import { DocumentEvent } from "../contracts/events/document.event";

const DOCUMENT_TOPICS = [
    "document.created",
    "document.retrieved",
    "document.searched",
    "document.updated",
    "document.deleted",
] as const;

export async function startKafkaListener() {
    const consumer = new KafkaConsumer(
        process.env.KAFKA_BROKERS?.split(",") ?? ["localhost:9092"],
        "document-processing-group"
    )

    const processingService = new DocumentProcessingServices();

    await consumer.connect();

    for (const topic of DOCUMENT_TOPICS) {
        await consumer.subscribe(topic);
    }

    await consumer.run(async ({ topic, message }) => {
        if (!message.value) return;

        let event: DocumentEvent;
        try {
            event = JSON.parse(message.value.toString()) as DocumentEvent;
        } catch (err) {
            console.log(`[KafkaListener] Failed to parse message on topic=${topic}:`, err);
            return;
        }

        try {
            await processingService.processEvent(event);
        } catch (err) {
            console.error(
                `[KafkaListener] Error processing event type=${event.event} on topic=${topic}:`,
                err
            )
        }
    });
    console.log(`[KafkaListener] Listening on topics: ${DOCUMENT_TOPICS.join(", ")}`);
}
