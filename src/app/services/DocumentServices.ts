import type { IDocumentService } from "src/contracts/services/IDocumentServices";
import type { AddVersionCommand, CreateDocumentCommand, DeleteDocumentCommand, Document, DocumentVersion, GetDocumentCommand, GetVersionsCommand, SearchDocumentCommand, UpdateDocumentCommand } from "src/contracts/states/document";
import { DocumentRepository } from "../repositories/DocumentRepository";
// import { RedisClientType } from "redis";
import { redisClient } from "src/entry/redis";
import { PerformanceTracker } from "../performance/performance.decorator";
import { CacheGet, CachePurge } from "../cache/cache.decorators";
import { IEventPublisher } from "src/contracts/messaging/IEventPublisher";
import { DocumentCreatedEvent } from "src/contracts/events/document.event";

type RedisClient = typeof redisClient;
export class DocumentServices implements IDocumentService {
    constructor(
        private readonly repo: DocumentRepository,
        private readonly redis: RedisClient,
        private readonly eventPublisher: IEventPublisher,
    ) { }

    @PerformanceTracker("createDocument")
    @CachePurge(["documents:search:*"])
    async createDocument(command: CreateDocumentCommand): Promise<Document> {
        const entity = await this.repo.create(command);

        const event: DocumentCreatedEvent = {
            event: "document.created",
            payload: {
                documentId: entity.id,
                title: entity.title,
                type: entity.type,
                createdAt: entity.createdAt.toISOString(),
            }
        };

        try {

            await this.eventPublisher.publish("document.created", event);
        } catch (err) {
            console.error(`[DocumentServices] Failed to publish document.created event for id=${entity.id}. ` +
                `Event will not be retried. Error:`,
                err)
        }


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

    @PerformanceTracker("getDocument")
    @CacheGet("document", 60)
    async getDocument(command: GetDocumentCommand): Promise<Document> {
        console.log("Executing getDocument (DB)");

        const entity = await this.repo.findById(command.id);

        return {
            id: entity.id,
            title: entity.title,
            type: entity.type,
            status: entity.status,
            active: entity.active,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        };
    }

    @PerformanceTracker("searchDocument")
    async searchDocument(command: SearchDocumentCommand): Promise<Document[]> {
        const cacheKey = `documents:search:title=${command.title ?? "all"}`;

        try {
            const cached = await this.redis.get(cacheKey);

            if (cached) {
                console.log("Returning search result from CACHE")
                return JSON.parse(cached);
            }

            console.log("Executing searchDocument (DB)");

            const entities = await this.repo.searchByTitle(command.title);

            const docs = entities.map((entity) => ({
                id: entity.id,
                title: entity.title,
                type: entity.type,
                status: entity.status,
                active: entity.active,
                createdAt: entity.createdAt,
                updatedAt: entity.updatedAt,
            }));

            await this.redis.set(cacheKey, JSON.stringify(docs), { EX: 60 });

            return docs;

        } catch (error: any) {
            throw new Error("Failed to fetch documents");
        }
    }

    @PerformanceTracker("deleteDocument")
    @CachePurge(["documents:search:*"])
    async deleteDocument(command: DeleteDocumentCommand): Promise<boolean> {
        console.log("Executing deleteDocument (DB)");

        const deleted = await this.repo.deleteById(command.id);

        if (!deleted) {
            throw new Error("Document not found");
        }

        return true;
    }

    @PerformanceTracker("updateDocument")
    @CachePurge(["documents:search:*", "document:*"])
    async updateDocument(command: UpdateDocumentCommand): Promise<Document> {

        try {
            console.log("Executing updateDocument (DB)");
            const entity = await this.repo.update(command);

            return {
                id: entity.id,
                title: entity.title,
                type: entity.type,
                status: entity.status,
                active: entity.active,
                createdAt: entity.createdAt,
                updatedAt: entity.updatedAt,
            };

        } catch (err) {
            throw new Error("Document not found");
        }
    }
}