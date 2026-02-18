import type { IDocumentService } from "src/contracts/services/IDocumentServices";
import type { CreateDocumentCommand, DeleteDocumentCommand, Document, GetDocumentCommand, SearchDocumentCommand, UpdateDocumentCommand } from "src/contracts/states/document";
import { DocumentRepository } from "../repositories/DocumentRepository";
import { redisClient } from "src/entry/redis";
import { IEventPublisher } from "src/contracts/messaging/IEventPublisher";
type RedisClient = typeof redisClient;
export declare class DocumentServices implements IDocumentService {
    private readonly repo;
    private readonly redis;
    private readonly eventPublisher;
    constructor(repo: DocumentRepository, redis: RedisClient, eventPublisher: IEventPublisher);
    createDocument(command: CreateDocumentCommand): Promise<Document>;
    getDocument(command: GetDocumentCommand): Promise<Document>;
    searchDocument(command: SearchDocumentCommand): Promise<Document[]>;
    deleteDocument(command: DeleteDocumentCommand): Promise<boolean>;
    updateDocument(command: UpdateDocumentCommand): Promise<Document>;
}
export {};
//# sourceMappingURL=DocumentServices.d.ts.map