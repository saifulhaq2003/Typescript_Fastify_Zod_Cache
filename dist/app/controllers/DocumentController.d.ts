import { FastifyReply, FastifyRequest } from "fastify";
import { IDocumentService } from "src/contracts/services/IDocumentServices";
import { CreateDocumentCommand, GetDocumentCommand, SearchDocumentCommand, UpdateDocumentCommand, DeleteDocumentCommand } from "src/contracts/states/document";
export declare class DocumentController {
    private readonly service;
    constructor(service: IDocumentService);
    create: (req: FastifyRequest<{
        Body: CreateDocumentCommand;
    }>, reply: FastifyReply) => Promise<import("src/contracts/states/document").Document>;
    getById: (req: FastifyRequest<{
        Params: GetDocumentCommand;
    }>) => Promise<import("src/contracts/states/document").Document>;
    search: (req: FastifyRequest<{
        Querystring: SearchDocumentCommand;
    }>) => Promise<import("src/contracts/states/document").Document[]>;
    update: (req: FastifyRequest<{
        Params: {
            id: string;
        };
        Body: Omit<UpdateDocumentCommand, "id">;
    }>) => Promise<import("src/contracts/states/document").Document>;
    delete: (req: FastifyRequest<{
        Params: DeleteDocumentCommand;
    }>, reply: FastifyReply) => Promise<void>;
}
//# sourceMappingURL=DocumentController.d.ts.map