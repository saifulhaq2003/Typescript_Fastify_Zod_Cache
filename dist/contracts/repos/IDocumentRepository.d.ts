import { DocumentEntity } from "src/app/database/entities/DocumentEntity";
import { CreateDocumentCommand, UpdateDocumentCommand } from "src/contracts/states/document";
export interface IDocumentRepository {
    create(command: CreateDocumentCommand): Promise<DocumentEntity>;
    findById(id: string): Promise<DocumentEntity>;
    searchByTitle(title?: string): Promise<DocumentEntity[]>;
    deleteById(id: string): Promise<boolean>;
    update(command: UpdateDocumentCommand): Promise<DocumentEntity>;
    updateTitle(id: string, title: string): Promise<void>;
}
//# sourceMappingURL=IDocumentRepository.d.ts.map