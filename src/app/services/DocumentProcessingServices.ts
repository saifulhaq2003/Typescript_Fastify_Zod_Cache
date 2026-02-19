import { DocumentEvent } from "src/contracts/events/document.event";

export class DocumentProcessingServices {
    async processEvent(event: DocumentEvent): Promise<void> {
        switch (event.event) {
            case "document.created":
                await this.handleCreated(event.payload);
                break;

            case "document.retrieved":
                await this.handleRetrieved(event.payload);
                break;

            case "document.searched":
                await this.handleSearched(event.payload);
                break;

            case "document.deleted":
                await this.handleDeleted(event.payload);
                break;

            case "document.updated":
                await this.handleUpdated(event.payload);
        }
    }



    private async handleCreated(payload: {
        documentId: string;
        title: string;
        type: string;
        createdAt: string;
    }): Promise<void> {
        console.log(`[ProcessingService] document.created`);
        console.log(`  ID:         ${payload.documentId}`);
        console.log(`  Title:      ${payload.title}`);
        console.log(`  Type:       ${payload.type}`);
        console.log(`  Created At: ${payload.createdAt}`);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log(`[Processing Service] Document processed successfully`);

    }

    private async handleRetrieved(payload: {
        documentId: string;
        source: "db" | "cache";
        retrievedAt: string;
    }): Promise<void> {
        console.log(`[ProcessingService] document.retrieved`);
        console.log(`  ID:           ${payload.documentId}`);
        console.log(`  Source:       ${payload.source}`);
        console.log(`  Retrieved At: ${payload.retrievedAt}`);

        await new Promise((resolve) => setTimeout(resolve, 100));

        console.log(`[ProcessingService] document.retrieved logged`);
    }

    private async handleSearched(payload: {
        filters: { title?: string };
        resultCount: number;
        source: "cache" | "db";
        searchedAt: string;
    }): Promise<void> {
        console.log(`[ProcessingService] document.searched`);
        console.log(`  Title Filter: ${payload.filters.title ?? "(none)"}`);
        console.log(`  Results:      ${payload.resultCount}`);
        console.log(`  Source:       ${payload.source}`);
        console.log(`  Searched At:  ${payload.searchedAt}`);

        await new Promise((resolve) => setTimeout(resolve, 100));

        console.log(`[ProcessingService] document.searched analytics recorded`);
    }

    private async handleDeleted(payload: {
        documentId: string;
        deletedAt: string;
    }): Promise<void> {
        console.log(`[ProcessingService] document.deleted`);
        console.log(`  ID:         ${payload.documentId}`);
        console.log(`  Deleted At: ${payload.deletedAt}`);

        await new Promise((resolve) => setTimeout(resolve, 200));

        console.log(`[ProcessingService] document.deleted → cleaned up successfully`);
    }

    private async handleUpdated(payload: {
        documentId: string,
        changes: Record<string, unknown>;
        updatedAt: string;
    }): Promise<void> {
        console.log(`[ProcessingService] document.updated`);
        console.log(`  ID:         ${payload.documentId}`);
        console.log(`  Changes:    ${JSON.stringify(payload.changes)}`);
        console.log(`  Updated At: ${payload.updatedAt}`);

        await new Promise((resolve) => setTimeout(resolve, 300));

        console.log(`[ProcessingService] document.updated → processed successfully`);
    }
}