"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentRoutes = documentRoutes;
const document_schema_1 = require("../contracts/validators/document.schema");
async function documentRoutes(server, controller) {
    server.post("/documents", {
        schema: { body: document_schema_1.createDocumentSchema },
    }, controller.create);
    server.get("/documents/:id", {
        schema: { params: document_schema_1.documentIdParamSchema },
    }, controller.getById);
    server.get("/documents", {
        schema: { querystring: document_schema_1.queryValidatorSchema },
    }, controller.search);
    server.put("/documents/:id", {
        schema: { params: document_schema_1.documentIdParamSchema, body: document_schema_1.updateDocumentSchema },
    }, controller.update);
    server.patch("/documents/:id", {
        schema: { params: document_schema_1.documentIdParamSchema, body: document_schema_1.patchDocumentSchema },
    }, controller.update);
    server.delete("/documents/:id", {
        schema: { params: document_schema_1.documentIdParamSchema },
    }, controller.delete);
}
//# sourceMappingURL=routes.js.map