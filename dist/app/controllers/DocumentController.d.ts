import { FastifyReply, FastifyRequest } from "fastify";
import { IDocumentService } from "src/contracts/services/IDocumentServices";
export declare class DocumentController {
    private readonly service;
    constructor(service: IDocumentService);
    create: (req: FastifyRequest, reply: FastifyReply) => Promise<import("../../contracts/states/document").Document>;
    getById: (req: FastifyRequest, reply: FastifyReply) => Promise<import("../../contracts/states/document").Document>;
    search: (req: FastifyRequest) => Promise<import("../../contracts/states/document").Document[]>;
    update: (req: FastifyRequest) => Promise<import("../../contracts/states/document").Document>;
    delete: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
}
//# sourceMappingURL=DocumentController.d.ts.map