"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryDocumentService = void 0;
const node_crypto_1 = require("node:crypto");
const document_1 = require("../../contracts/states/document");
class InMemoryDocumentService {
    constructor() {
        this.documents = [];
    }
    async createDocument(command) {
        const now = new Date();
        const doc = {
            id: (0, node_crypto_1.randomUUID)(),
            title: command.title,
            type: command.type,
            status: document_1.DocStatusType.DRAFT,
            active: true,
            createdAt: now,
            updatedAt: now,
        };
        this.documents.push(doc);
        return doc;
    }
    async getDocument(command) {
        const doc = this.documents.find(d => d.id === command.id);
        if (!doc) {
            throw new Error("DOCUMENT_NOT_FOUND");
        }
        return doc;
    }
    async searchDocument(command) {
        if (!command.title) {
            return this.documents;
        }
        return this.documents.filter(d => d.title.toLowerCase().includes(command.title.toLowerCase()));
    }
    async deleteDocument(command) {
        const index = this.documents.findIndex((doc) => doc.id === command.id);
        if (index === -1) {
            return false;
        }
        this.documents.splice(index, 1);
        return true;
    }
    async updateDocument(command) {
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
        }
        catch (err) {
            throw new Error("DOCUMENT_NOT_FOUND");
        }
    }
}
exports.InMemoryDocumentService = InMemoryDocumentService;
//# sourceMappingURL=InMemoryDocumentService.js.map