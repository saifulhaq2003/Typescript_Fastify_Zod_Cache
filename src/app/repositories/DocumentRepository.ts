import { ILike, Repository } from "typeorm";
import { randomUUID } from "crypto";
import { AppDataSource } from "../database/data-source";
import { DocumentEntity } from "../database/entities/DocumentEntity";
import type { CreateDocumentCommand, UpdateDocumentCommand } from "../../contracts/states/document"
import { DocStatusType } from "../../contracts/states/document";
import { IDocumentRepository } from "src/contracts/repositories/IDocumentRepository";

export class DocumentRepository implements IDocumentRepository {
    private repo: Repository<DocumentEntity>;

    constructor() {
        this.repo = AppDataSource.getRepository(DocumentEntity);
    }

    async create(command: CreateDocumentCommand): Promise<DocumentEntity> {
        const entity = this.repo.create({
            id: randomUUID(),
            title: command.title,
            type: command.type,
            status: DocStatusType.DRAFT,
            active: true,
            url: command.url,
        });

        return this.repo.save(entity);

    }

    async findById(id: string): Promise<DocumentEntity> {
        return this.repo.findOneByOrFail({ id });
    }

    async searchByTitle(title?: string): Promise<DocumentEntity[]> {
        if (!title) {
            return this.repo.find();
        }

        return this.repo.find({
            where: {
                title: ILike(`%${title}%`),
            },
        });
    }

    async deleteById(id: string): Promise<boolean> {
        const result = await this.repo.delete({ id });
        return (result.affected ?? 0) > 0;
    }

    async update(command: UpdateDocumentCommand): Promise<DocumentEntity> {
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
        if (command.url !== undefined) {
            entity.url = command.url;
        }

        return this.repo.save(entity);
    }

    // async updateTitle(id: string, title: string): Promise<void> {
    //     await this.repo.update({ id }, { title });
    // }
}