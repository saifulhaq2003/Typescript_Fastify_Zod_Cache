import { DocumentEntity } from "../database/entities/DocumentEntity";
import type { CreateDocumentCommand, UpdateDocumentCommand } from "../../contracts/states/document";
import { IDocumentRepository } from "src/contracts/repos/IDocumentRepository";
export declare class DocumentRepository implements IDocumentRepository {
    private repo;
    constructor();
    create(command: CreateDocumentCommand): Promise<DocumentEntity>;
    findById(id: string): Promise<DocumentEntity>;
    searchByTitle(title?: string): Promise<DocumentEntity[]>;
    deleteById(id: string): Promise<boolean>;
    update(command: UpdateDocumentCommand): Promise<DocumentEntity>;
}
//# sourceMappingURL=DocumentRepository.d.ts.map