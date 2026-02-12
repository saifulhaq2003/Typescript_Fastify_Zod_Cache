import { DocumentVersionEntity } from "../database/entities/DocumentVersionEntity";
import { IDocumentVersionRepository } from "src/contracts/repos/IDocumentVersionRepository";
export declare class DocumentVersionRepository implements IDocumentVersionRepository {
    private repo;
    constructor();
    findLatestByDocumentId(documentId: string): Promise<DocumentVersionEntity | null>;
    createVersion(data: {
        documentId: string;
        version: number;
        title: string;
    }): Promise<DocumentVersionEntity>;
    findByDocumentId(documentId: string): Promise<DocumentVersionEntity[]>;
}
//# sourceMappingURL=DocumentVersionRepository.d.ts.map