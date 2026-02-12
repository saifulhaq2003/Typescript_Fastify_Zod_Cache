import type { IDocumentService } from "src/contracts/services/IDocumentServices";
import type { CreateDocumentCommand, DeleteDocumentCommand, Document, GetDocumentCommand, SearchDocumentCommand, UpdateDocumentCommand } from "src/contracts/states/document";
import { DocumentRepository } from "../repositories/DocumentRepository";
export declare class DocumentServices implements IDocumentService {
    private readonly repo;
    constructor(repo: DocumentRepository);
    createDocument(command: CreateDocumentCommand): Promise<Document>;
    getDocument(command: GetDocumentCommand): Promise<Document>;
    searchDocument(command: SearchDocumentCommand): Promise<Document[]>;
    deleteDocument(command: DeleteDocumentCommand): Promise<boolean>;
    updateDocument(command: UpdateDocumentCommand): Promise<Document>;
}
//# sourceMappingURL=DocumentServices.d.ts.map