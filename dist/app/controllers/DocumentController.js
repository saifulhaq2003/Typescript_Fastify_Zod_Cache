"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentController = void 0;
class DocumentController {
    constructor(service) {
        this.service = service;
        this.create = async (req, reply) => {
            const body = req.body;
            const doc = await this.service.createDocument(body);
            reply.code(201);
            return doc;
        };
        this.getById = async (req, reply) => {
            const { id } = req.params;
            return this.service.getDocument({ id });
        };
        this.search = async (req) => {
            const { title } = req.query;
            return this.service.searchDocument({ title });
        };
        this.update = async (req) => {
            const { id } = req.params;
            const body = req.body;
            return this.service.updateDocument({ id, ...body });
        };
        this.delete = async (req, reply) => {
            const { id } = req.params;
            await this.service.deleteDocument({ id });
            reply.code(204);
        };
    }
}
exports.DocumentController = DocumentController;
//# sourceMappingURL=DocumentController.js.map