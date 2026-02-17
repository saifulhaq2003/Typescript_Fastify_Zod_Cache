import { FastifyReply, FastifyRequest } from "fastify";
import { IDocumentService } from "src/contracts/services/IDocumentServices";

export class DocumentController {
    constructor(private readonly service: IDocumentService) { }

    create = async (req: FastifyRequest, reply: FastifyReply) => {
        const body = req.body as any;

        const doc = await this.service.createDocument(body);
        reply.code(201);
        return doc;
    };

    getById = async (req: FastifyRequest, reply: FastifyReply) => {
        const { id } = req.params as any;
        return this.service.getDocument({ id });
    };

    search = async (req: FastifyRequest) => {
        const { title } = req.query as any;
        return this.service.searchDocument({ title });
    };

    update = async (req: FastifyRequest) => {
        const { id } = req.params as any;
        const body = req.body as any;

        return this.service.updateDocument({ id, ...body });
    };

    delete = async (req: FastifyRequest, reply: FastifyReply) => {
        const { id } = req.params as any;
        await this.service.deleteDocument({ id });
        reply.code(204);
    };
}
