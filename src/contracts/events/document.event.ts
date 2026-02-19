import { DocStatusType, DocType } from "../states/document";

export interface DocumentCreatedEvent {
    event: "document.created";
    payload: {
        documentId: string;
        title: string;
        type: DocType;
        createdAt: string;
    }
}

export interface DocumentRetrievedEvent {
    event: "document.retrieved";
    payload: {
        documentId: string;
        source: "cache" | "db";
        retrievedAt: string;
    };
}

export interface DocumentSearchedEvent {
    event: "document.searched";
    payload: {
        filters: {
            title?: string;
        };
        resultCount: number;
        source: "cache" | "db";
        searchedAt: string;
    };
}

export interface DocumentDeletedEvent {
    event: "document.deleted";
    payload: {
        documentId: string;
        deletedAt: string;
    };
}

export interface DocumentUpdatedEvent {
    event: "document.updated";
    payload: {
        documentId: string;
        changes: {
            title?: string;
            type?: DocType;
            status?: DocStatusType;
            active?: boolean;
        }
        updatedAt: string;
    };
}

export type DocumentEvent = DocumentCreatedEvent | DocumentRetrievedEvent | DocumentSearchedEvent | DocumentDeletedEvent | DocumentUpdatedEvent;