"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentRepository = void 0;
const typeorm_1 = require("typeorm");
const crypto_1 = require("crypto");
const data_source_1 = require("../database/data-source");
const DocumentEntity_1 = require("../database/entities/DocumentEntity");
const document_1 = require("../../contracts/states/document");
class DocumentRepository {
    constructor() {
        this.repo = data_source_1.AppDataSource.getRepository(DocumentEntity_1.DocumentEntity);
    }
    async create(command) {
        const entity = this.repo.create({
            id: (0, crypto_1.randomUUID)(),
            title: command.title,
            type: command.type,
            status: document_1.DocStatusType.DRAFT,
            active: true,
        });
        return this.repo.save(entity);
    }
    async findById(id) {
        return this.repo.findOneByOrFail({ id });
    }
    async searchByTitle(title) {
        if (!title) {
            return this.repo.find();
        }
        return this.repo.find({
            where: {
                title: (0, typeorm_1.ILike)(`%${title}%`),
            },
        });
    }
    async deleteById(id) {
        const result = await this.repo.delete({ id });
        return (result.affected ?? 0) > 0;
    }
    async update(command) {
        const entity = await this.repo.findOneByOrFail({ id: command.id });
        if (command.title !== undefined) {
            entity.title = command.title;
        }
        if (command.status !== undefined) {
            entity.status = command.status;
        }
        if (command.active !== undefined) {
            entity.active = command.active;
        }
        if (command.type !== undefined) {
            entity.type = command.type;
        }
        return this.repo.save(entity);
    }
    async updateTitle(id, title) {
        await this.repo.update({ id }, { title });
    }
}
exports.DocumentRepository = DocumentRepository;
//# sourceMappingURL=DocumentRepository.js.map