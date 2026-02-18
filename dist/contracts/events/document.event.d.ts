import { DocType } from "../states/document";
export interface DocumentCreatedEvent {
    event: "document.created";
    payload: {
        documentId: string;
        title: string;
        type: DocType;
        createdAt: string;
    };
}
//# sourceMappingURL=document.event.d.ts.map