import { FastifyInstance } from "fastify";
import { DocumentController } from "src/app/controllers/DocumentController";
import {
    createDocumentSchema,
    patchDocumentSchema,
    updateDocumentSchema,
    documentIdParamSchema,
    queryValidatorSchema
} from "../contracts/validators/document.schema";

export async function documentRoutes(
    server: FastifyInstance,
    controller: DocumentController
) {

    server.post("/documents", {
        schema: { body: createDocumentSchema },
    }, controller.create);

    server.get("/documents/:id", {
        schema: { params: documentIdParamSchema },
    }, controller.getById);

    server.get("/documents", {
        schema: { querystring: queryValidatorSchema },
    }, controller.search);

    server.put("/documents/:id", {
        schema: { params: documentIdParamSchema, body: updateDocumentSchema },
    }, controller.update);

    server.patch("/documents/:id", {
        schema: { params: documentIdParamSchema, body: patchDocumentSchema },
    }, controller.update);

    server.delete("/documents/:id", {
        schema: { params: documentIdParamSchema },
    }, controller.delete);
}