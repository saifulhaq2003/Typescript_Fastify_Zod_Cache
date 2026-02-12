import type { IDocumentService } from "../../contracts/services/IDocumentServices";
import type { CreateDocumentCommand, Document, GetDocumentCommand, SearchDocumentCommand, DeleteDocumentCommand, UpdateDocumentCommand } from "../../contracts/states/document";
export declare class InMemoryDocumentService implements IDocumentService {
    private documents;
    createDocument(command: CreateDocumentCommand): Promise<Document>;
    getDocument(command: GetDocumentCommand): Promise<Document>;
    searchDocument(command: SearchDocumentCommand): Promise<Document[]>;
    deleteDocument(command: DeleteDocumentCommand): Promise<boolean>;
    updateDocument(command: UpdateDocumentCommand): Promise<Document>;
}
//# sourceMappingURL=InMemoryDocumentService.d.ts.map