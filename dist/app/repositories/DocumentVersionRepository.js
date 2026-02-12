"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentVersionRepository = void 0;
const DocumentVersionEntity_1 = require("../database/entities/DocumentVersionEntity");
const data_source_1 = require("../database/data-source");
class DocumentVersionRepository {
    constructor() {
        this.repo = data_source_1.AppDataSource.getRepository(DocumentVersionEntity_1.DocumentVersionEntity);
    }
    async findLatestByDocumentId(documentId) {
        return this.repo.findOne({
            where: { documentId },
            order: { version: "DESC" },
        });
    }
    async createVersion(data) {
        const entity = this.repo.create(data);
        return this.repo.save(entity);
    }
    async findByDocumentId(documentId) {
        return this.repo
            .createQueryBuilder("version")
            .where("version.documentId= :documentId", { documentId })
            .orderBy("version.version", "ASC")
            .getMany();
    }
}
exports.DocumentVersionRepository = DocumentVersionRepository;
//# sourceMappingURL=DocumentVersionRepository.js.map