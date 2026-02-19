import type { IDocumentService } from "../../contracts/services/IDocumentServices";
import type { AddVersionCommand, CreateDocumentCommand, DeleteDocumentCommand, Document, DocumentVersion, GetDocumentCommand, GetVersionsCommand, SearchDocumentCommand, UpdateDocumentCommand } from "../../contracts/states/document";
import { DocumentRepository } from "../repositories/DocumentRepository";
// import { RedisClientType } from "redis";
import { redisClient } from "src/entry/redis";
import { PerformanceTracker } from "../performance/performance.decorator";
import { CacheGet, CachePurge } from "../cache/cache.decorators";
import { IEventPublisher } from "../../contracts/messaging/IEventPublisher";
import { DocumentCreatedEvent, DocumentDeletedEvent, DocumentRetrievedEvent, DocumentSearchedEvent, DocumentUpdatedEvent } from "../../contracts/events/document.event";
import { DocumentEntity } from "../database/entities/DocumentEntity";
import { en } from "zod/v4/locales";

type RedisClient = typeof redisClient;
export class DocumentServices implements IDocumentService {
    constructor(
        private readonly repo: DocumentRepository,
        private readonly redis: RedisClient,
        private readonly eventPublisher: IEventPublisher,
    ) { }

    private async publishEvent<T>(topic: string, event: T, context: string): Promise<void> {
        try {
            await this.eventPublisher.publish(topic, event);
        } catch (err) {
            console.error(
                `[DocumentServices] Failed to publish ${topic} (${context})` +
                `Event will not be retried. Error:`,
                err
            );
        }
    }

    @PerformanceTracker("createDocument")
    @CachePurge(["documents:search:*"])
    async createDocument(command: CreateDocumentCommand): Promise<Document> {
        const entity = await this.repo.create(command);

        await this.publishEvent<DocumentCreatedEvent>("document.created", {
            event: "document.created",
            payload: {
                documentId: entity.id,
                title: entity.title,
                type: entity.type,
                createdAt: entity.createdAt.toISOString(),
            },
        }, `id=${entity.id}`);

        return this.toDocument(entity);

    }

    @PerformanceTracker("getDocument")
    @CacheGet("document", 60)
    async getDocument(command: GetDocumentCommand): Promise<Document> {
        console.log("Executing getDocument (DB)");

        const entity = await this.repo.findById(command.id);

        await this.publishEvent<DocumentRetrievedEvent>("document.retrieved", {
            event: "document.retrieved",
            payload: {
                documentId: command.id,
                source: "db",
                retrievedAt: new Date().toString(),
            },
        }, `id=${command.id}`);

        return this.toDocument(entity);
    }

    @PerformanceTracker("searchDocument")
    async searchDocument(command: SearchDocumentCommand): Promise<Document[]> {
        const cacheKey = `documents:search:title=${command.title ?? "all"}`;
        let source: "cache" | "db"
        let docs: Document[];

        try {
            const cached = await this.redis.get(cacheKey);

            if (cached) {
                console.log("Returning search result from CACHE")
                return JSON.parse(cached);
            } else {
                source = "db";
                const entities = await this.repo.searchByTitle(command.title);
                docs = entities.map((e) => this.toDocument(e));
                await this.redis.set(cacheKey, JSON.stringify(docs), { EX: 60 });
            }
        } catch {
            throw new Error("Failed to fetch documents");
        }

        await this.publishEvent<DocumentSearchedEvent>("document.searched", {
            event: "document.searched",
            payload: {
                filters: { title: command.title },
                resultCount: docs.length,
                source,
                searchedAt: new Date().toISOString(),
            },
        }, `title:${command.title ?? "all"}`);

        return docs;
    }

    @PerformanceTracker("deleteDocument")
    @CachePurge(["documents:search:*"])
    async deleteDocument(command: DeleteDocumentCommand): Promise<boolean> {
        const deleted = await this.repo.deleteById(command.id);

        if (!deleted) {
            throw new Error("Document not found");
        }

        await this.publishEvent<DocumentDeletedEvent>("document.deleted", {
            event: "document.deleted",
            payload: {
                documentId: command.id,
                deletedAt: new Date().toISOString(),
            },
        }, `id=${command.id}`);

        return true;
    }

    @PerformanceTracker("updateDocument")
    @CachePurge(["documents:search:*", "document:*"])
    async updateDocument(command: UpdateDocumentCommand): Promise<Document> {
        let entity;
        try {
            entity = await this.repo.update(command);
        } catch {
            throw new Error("Document not found");
        }
        await this.publishEvent<DocumentUpdatedEvent>("document.updated", {
            event: "document.updated",
            payload: {
                documentId: command.id,
                changes: {
                    ...(command.title !== undefined && { title: command.title }),
                    ...(command.status !== undefined && { status: command.status }),
                    ...(command.type !== undefined && { type: command.type }),
                    ...(command.active !== undefined && { active: command.active }),
                },
                updatedAt: entity.updatedAt.toString(),
            },
        }, `id=${command.id}`);

        return this.toDocument(entity);
    }

    private toDocument(entity: DocumentEntity): Document {
        return {
            id: entity.id,
            title: entity.title,
            type: entity.type,
            status: entity.status,
            active: entity.active,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}