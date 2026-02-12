import type { IDocumentService } from "src/contracts/services/IDocumentServices";
import type { AddVersionCommand, CreateDocumentCommand, DeleteDocumentCommand, Document, DocumentVersion, GetDocumentCommand, GetVersionsCommand, SearchDocumentCommand, UpdateDocumentCommand } from "src/contracts/states/document";
import { DocumentRepository } from "../repositories/DocumentRepository";
import { DocumentVersionRepository } from "../repositories/DocumentVersionRepository";
import { RedisClientType } from "redis";
import { redisClient } from "src/entry/redis";

type RedisClient = typeof redisClient;
export class DocumentServices implements IDocumentService {
    constructor(
        private readonly repo: DocumentRepository,
        private readonly redis: RedisClient
        // private readonly versionRepo: DocumentVersionRepository
    ) { }


    async createDocument(command: CreateDocumentCommand): Promise<Document> {
        const entity = await this.repo.create(command);

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

    async getDocument(command: GetDocumentCommand): Promise<Document> {
        const cacheKey = `document:${command.id}`;

        try {
            const cached = await this.redis.get(cacheKey);

            if (cached) {
                return JSON.parse(cached);
            }

            const entity = await this.repo.findById(command.id);

            const doc: Document = {
                id: entity.id,
                title: entity.title,
                type: entity.type,
                status: entity.status,
                active: entity.active,
                createdAt: entity.createdAt,
                updatedAt: entity.updatedAt
            };

            await this.redis.set(cacheKey, JSON.stringify(doc), { EX: 60 });

            return doc;

        } catch (error: any) {
            throw new Error("Document not found");
        }
    }

    async searchDocument(command: SearchDocumentCommand): Promise<Document[]> {
        const cacheKey = `documents:search:title=${command.title ?? "all"}`;

        try {
            const cached = await this.redis.get(cacheKey);

            if (cached) {
                return JSON.parse(cached);
            }

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

    async deleteDocument(command: DeleteDocumentCommand): Promise<boolean> {
        try {
            const deleted = await this.repo.deleteById(command.id);

            if (!deleted) {
                throw new Error("Document not found");
            }

            await this.redis.del(`documents:${command.id}`);
            await this.redis.del(`documents:search:all`);

            return true;

        } catch (err) {
            throw new Error("Document not found");
        }
    }

    async updateDocument(command: UpdateDocumentCommand): Promise<Document> {

        try {
            const entity = await this.repo.update(command);

            const doc: Document = {
                id: entity.id,
                title: entity.title,
                type: entity.type,
                status: entity.status,
                active: entity.active,
                createdAt: entity.createdAt,
                updatedAt: entity.updatedAt,
            };

            await this.redis.del(`documents:${command.id}`);
            await this.redis.del(`documents:search:title=all`);

            return doc;

        } catch (err) {
            throw new Error("Document not found");
        }
    }

    // async addVersion(command: AddVersionCommand): Promise<DocumentVersion> {
    //     const doc = await this.repo.findById(command.documentId);
    //     if (!doc) {
    //         throw new Error("Document not found");
    //     }

    //     const lastVersion = await this.versionRepo.findLatestByDocumentId(doc.id);
    //     const nextVersion = lastVersion ? lastVersion.version + 1 : 1;

    //     const versionEntity = await this.versionRepo.createVersion({
    //         documentId: doc.id,
    //         version: nextVersion,
    //         title: command.title,
    //     });

    //     await this.repo.updateTitle(doc.id, command.title);
    //     return {
    //         id: versionEntity.id,
    //         documentId: versionEntity.documentId,
    //         version: versionEntity.version,
    //         title: versionEntity.title,
    //         createdAt: versionEntity.createdAt
    //     };
    // }

    // async getVersions(command: GetVersionsCommand): Promise<DocumentVersion[]> {
    //     const entities = await this.versionRepo.findByDocumentId(command.documentId);

    //     return entities.map((entity) => ({
    //         id: entity.id,
    //         documentId: entity.documentId,
    //         version: entity.version,
    //         title: entity.title,
    //         createdAt: entity.createdAt
    //     }));
    // }

}