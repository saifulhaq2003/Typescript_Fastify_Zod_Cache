import type { CreateDocumentCommand, DeleteDocumentCommand, Document, GetDocumentCommand, SearchDocumentCommand, UpdateDocumentCommand } from "../states/document";
export interface IDocumentService {
    createDocument(command: CreateDocumentCommand): Promise<Document>;
    getDocument(command: GetDocumentCommand): Promise<Document>;
    searchDocument(command: SearchDocumentCommand): Promise<Document[]>;
    deleteDocument(command: DeleteDocumentCommand): Promise<boolean>;
    updateDocument(command: UpdateDocumentCommand): Promise<Document>;
}
//# sourceMappingURL=IDocumentServices.d.ts.map