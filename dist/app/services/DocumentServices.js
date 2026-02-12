"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentServices = void 0;
class DocumentServices {
    constructor(repo) {
        this.repo = repo;
    }
    async createDocument(command) {
        const entity = await this.repo.create(command);
        return {
            id: entity.id,
            title: entity.title,
            type: entity.type,
            status: entity.status,
            active: entity.active,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        };
    }
    async getDocument(command) {
        const entity = await this.repo.findById(command.id);
        return {
            id: entity.id,
            title: entity.title,
            type: entity.type,
            status: entity.status,
            active: entity.active,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        };
    }
    async searchDocument(command) {
        const entities = await this.repo.searchByTitle(command.title);
        return entities.map((entity) => ({
            id: entity.id,
            title: entity.title,
            type: entity.type,
            status: entity.status,
            active: entity.active,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        }));
    }
    async deleteDocument(command) {
        return this.repo.deleteById(command.id);
    }
    async updateDocument(command) {
        const entity = await this.repo.update(command);
        return {
            id: entity.id,
            title: entity.title,
            type: entity.type,
            status: entity.status,
            active: entity.active,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
exports.DocumentServices = DocumentServices;
//# sourceMappingURL=DocumentServices.js.map