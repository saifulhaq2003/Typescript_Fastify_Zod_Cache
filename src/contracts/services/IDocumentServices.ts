import type { AddVersionCommand, CreateDocumentCommand, DeleteDocumentCommand, Document, GetDocumentCommand, SearchDocumentCommand, UpdateDocumentCommand, DocumentVersion } from "../states/document"

export interface IDocumentService {
  createDocument(command: CreateDocumentCommand): Promise<Document>;
  getDocument(command: GetDocumentCommand): Promise<Document>;
  searchDocument(command: SearchDocumentCommand): Promise<Document[]>;
  deleteDocument(command: DeleteDocumentCommand): Promise<boolean>;
  updateDocument(command: UpdateDocumentCommand): Promise<Document>;
}