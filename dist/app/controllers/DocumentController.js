"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentController = void 0;
class DocumentController {
    constructor(service) {
        this.service = service;
        this.create = async (req, reply) => {
            const doc = await this.service.createDocument(req.body);
            reply.code(201);
            return doc;
        };
        this.getById = async (req) => {
            return this.service.getDocument(req.params);
        };
        this.search = async (req) => {
            return this.service.searchDocument(req.query);
        };
        this.update = async (req) => {
            const { id } = req.params;
            return this.service.updateDocument({
                id,
                ...req.body,
            });
        };
        this.delete = async (req, reply) => {
            await this.service.deleteDocument(req.params);
            reply.code(204);
        };
    }
}
exports.DocumentController = DocumentController;
//# sourceMappingURL=DocumentController.js.map