import { FastifyReply, FastifyRequest } from "fastify";
import { IDocumentService } from "src/contracts/services/IDocumentServices";
import {
    CreateDocumentCommand, GetDocumentCommand, SearchDocumentCommand, UpdateDocumentCommand, DeleteDocumentCommand
} from "src/contracts/states/document";

export class DocumentController {
    constructor(private readonly service: IDocumentService) { }

    create = async (
        req: FastifyRequest<{
            Body: CreateDocumentCommand
        }>,
        reply: FastifyReply
    ) => {
        const doc = await this.service.createDocument(req.body);
        reply.code(201);
        return doc;
    };

    getById = async (
        req: FastifyRequest<{ Params: GetDocumentCommand }>
    ) => {
        return this.service.getDocument(req.params);
    };

    search = async (
        req: FastifyRequest<{ Querystring: SearchDocumentCommand }>
    ) => {
        return this.service.searchDocument(req.query);
    };

    update = async (
        req: FastifyRequest<{
            Params: { id: string };
            Body: Omit<UpdateDocumentCommand, "id">;
        }>
    ) => {
        const { id } = req.params;

        return this.service.updateDocument({
            id,
            ...req.body,
        });
    };

    delete = async (
        req: FastifyRequest<{ Params: DeleteDocumentCommand }>,
        reply: FastifyReply) => {
        await this.service.deleteDocument(req.params);
        reply.code(204);
    };
}
