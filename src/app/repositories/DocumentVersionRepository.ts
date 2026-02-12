import { Repository } from "typeorm";
import { DocumentVersionEntity } from "../database/entities/DocumentVersionEntity";
import { AppDataSource } from "../database/data-source";
import { IDocumentRepository } from "src/contracts/repos/IDocumentRepository";
import { IDocumentVersionRepository } from "src/contracts/repos/IDocumentVersionRepository";

export class DocumentVersionRepository implements IDocumentVersionRepository {
    private repo: Repository<DocumentVersionEntity>;

    constructor() {
        this.repo = AppDataSource.getRepository(DocumentVersionEntity);
    }

    async findLatestByDocumentId(documentId: string): Promise<DocumentVersionEntity | null> {
        return this.repo.findOne({
            where: { documentId },
            order: { version: "DESC" },
        });
    }

    async createVersion(data: { documentId: string; version: number; title: string; }): Promise<DocumentVersionEntity> {
        const entity = this.repo.create(data);
        return this.repo.save(entity);
    }

    async findByDocumentId(documentId: string): Promise<DocumentVersionEntity[]> {
        return this.repo
            .createQueryBuilder("version")
            .where("version.documentId= :documentId", { documentId })
            .orderBy("version.version", "ASC")
            .getMany();
    }

}