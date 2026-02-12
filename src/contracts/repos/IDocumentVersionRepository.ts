import { DocumentVersionEntity } from "src/app/database/entities/DocumentVersionEntity";
import { DocumentVersion } from "src/contracts/states/document";

export interface IDocumentVersionRepository {
    findLatestByDocumentId(documentId: string): Promise<DocumentVersionEntity | null>
    createVersion(data: { documentId: string; version: number; title: string; }): Promise<DocumentVersionEntity>
    findByDocumentId(documentId: string): Promise<DocumentVersionEntity[]>
}