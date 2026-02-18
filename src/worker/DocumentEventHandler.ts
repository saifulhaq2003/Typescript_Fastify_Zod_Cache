import { DocumentCreatedEvent } from "../contracts/events/document.event";

export class DocumentEventHandler {
    async handle(event: DocumentCreatedEvent) {
        console.log("Processing document:", event.payload.documentId);

        await new Promise((resolve) => setTimeout(resolve, 2000));

        console.log("Document Processed:", event.payload.title);
    }
} 