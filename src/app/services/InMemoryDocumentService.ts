import { randomUUID } from "node:crypto";
import type { IDocumentService } from "../../contracts/services/IDocumentServices";
import type {
    CreateDocumentCommand,
    Document,
    GetDocumentCommand,
    SearchDocumentCommand,
    DeleteDocumentCommand,
    UpdateDocumentCommand,
} from "../../contracts/states/document";
import { DocStatusType } from "../../contracts/states/document";


export class InMemoryDocumentService implements IDocumentService {

    private documents: Document[] = [];

    async createDocument(command: CreateDocumentCommand): Promise<Document> {
        const now = new Date();

        const doc: Document = {
            id: randomUUID(),
            title: command.title,
            type: command.type,
            status: DocStatusType.DRAFT,
            active: true,
            createdAt: now,
            updatedAt: now,
        };

        this.documents.push(doc);
        return doc;
    }

    async getDocument(command: GetDocumentCommand): Promise<Document> {
        const doc = this.documents.find(d => d.id === command.id);

        if (!doc) {
            throw new Error("DOCUMENT_NOT_FOUND");
        }
        return doc;
    }

    async searchDocument(command: SearchDocumentCommand): Promise<Document[]> {
        if (!command.title) {
            return this.documents;
        }

        return this.documents.filter(d => d.title.toLowerCase().includes(command.title!.toLowerCase()));


    }
    async deleteDocument(command: DeleteDocumentCommand): Promise<boolean> {
        const index = this.documents.findIndex((doc) => doc.id === command.id);

        if (index === -1) {
            return false;
        }

        this.documents.splice(index, 1);
        return true;
    }
    async updateDocument(command: UpdateDocumentCommand): Promise<Document> {
        try {

            const doc = this.documents.find((doc) => doc.id === command.id);
            if (!doc) {
                throw new Error(`Document with id ${command.id} not found`);
            }


            if (command.title !== undefined) {
                doc.title = command.title;
            }

            if (command.status !== undefined) {
                doc.status = command.status;
            }

            if (command.active !== undefined) {
                doc.active = command.active;
            }

            if (command.type !== undefined) {
                doc.type = command.type;
            }

            doc.updatedAt = new Date();

            return doc;
        } catch (err) {
            throw new Error("DOCUMENT_NOT_FOUND");
        }
    }

}