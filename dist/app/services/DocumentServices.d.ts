import type { IDocumentService } from "src/contracts/services/IDocumentServices";
import type { CreateDocumentCommand, DeleteDocumentCommand, Document, GetDocumentCommand, SearchDocumentCommand, UpdateDocumentCommand } from "src/contracts/states/document";
import { DocumentRepository } from "../repositories/DocumentRepository";
import { redisClient } from "src/entry/redis";
type RedisClient = typeof redisClient;
export declare class DocumentServices implements IDocumentService {
    private readonly repo;
    private readonly redis;
    constructor(repo: DocumentRepository, redis: RedisClient);
    createDocument(command: CreateDocumentCommand): Promise<Document>;
    getDocument(command: GetDocumentCommand): Promise<Document>;
    searchDocument(command: SearchDocumentCommand): Promise<Document[]>;
    deleteDocument(command: DeleteDocumentCommand): Promise<boolean>;
    updateDocument(command: UpdateDocumentCommand): Promise<Document>;
}
export {};
//# sourceMappingURL=DocumentServices.d.ts.map