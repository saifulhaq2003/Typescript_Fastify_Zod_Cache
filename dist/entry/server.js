"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const fastify_1 = __importDefault(require("fastify"));
const DocumentRepository_1 = require("../app/repositories/DocumentRepository");
const DocumentServices_1 = require("../app/services/DocumentServices");
const data_source_1 = require("../app/database/data-source");
const redis_1 = require("./redis");
const document_schema_1 = require("../contracts/validators/document.schema");
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
const swagger_1 = require("@fastify/swagger");
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
async function bootstrap() {
    await data_source_1.AppDataSource.initialize();
    console.log("DB connected");
    await (0, redis_1.connectRedis)();
    const server = (0, fastify_1.default)({ logger: true }).withTypeProvider();
    server.setValidatorCompiler(fastify_type_provider_zod_1.validatorCompiler);
    server.setSerializerCompiler(fastify_type_provider_zod_1.serializerCompiler);
    await server.register(swagger_1.fastifySwagger, {
        openapi: {
            info: {
                title: "Document API",
                description: "Document Management API",
                version: "1.0.0",
            },
        },
        transform: fastify_type_provider_zod_1.jsonSchemaTransform,
    });
    await server.register(swagger_ui_1.default, {
        routePrefix: "/docs",
    });
    const repo = new DocumentRepository_1.DocumentRepository();
    const documentService = new DocumentServices_1.DocumentServices(repo, redis_1.redisClient);
    server.get("/redis-health", async () => {
        await redis_1.redisClient.set("health", "ok");
        const value = await redis_1.redisClient.get("health");
        return {
            redis: value,
            status: "connected",
        };
    });
    server.get("/health", async () => {
        return { status: "ok" };
    });
    server.post("/documents", {
        schema: {
            body: document_schema_1.createDocumentSchema,
        },
    }, async (request, reply) => {
        try {
            const { title, type } = request.body;
            const doc = await documentService.createDocument({
                title,
                type,
            });
            reply.code(201);
            return doc;
        }
        catch (error) {
            reply.code(400);
            return {
                message: "Validation failed",
                errors: error.errors ?? error.message
            };
        }
    });
    server.get("/documents/:id", {
        schema: {
            params: document_schema_1.documentIdParamSchema,
        },
    }, async (request, reply) => {
        const { id } = request.params;
        try {
            return await documentService.getDocument({ id });
        }
        catch (err) {
            reply.code(404);
            return {
                message: err.message
            };
        }
    });
    server.get("/documents", {
        schema: {
            querystring: document_schema_1.queryValidatorSchema,
        },
    }, async (request, reply) => {
        try {
            const { title } = request.query;
            return await documentService.searchDocument({ title: title });
        }
        catch (err) {
            reply.code(500);
            return {
                message: err.message,
            };
        }
    });
    server.put("/documents/:id", {
        schema: {
            params: document_schema_1.documentIdParamSchema,
            body: document_schema_1.updateDocumentSchema,
        },
    }, async (request, reply) => {
        try {
            const { id } = request.params;
            const body = request.body;
            const updated = await documentService.updateDocument({
                id,
                title: body.title,
                type: body.type,
                status: body.status,
                active: body.active,
            });
            return updated;
        }
        catch (error) {
            reply.code(404);
            return {
                message: "Validation",
                errors: error.errors ?? error.message
            };
        }
    });
    server.patch("/documents/:id", {
        schema: {
            params: document_schema_1.documentIdParamSchema,
            body: document_schema_1.patchDocumentSchema,
        },
    }, async (request, reply) => {
        try {
            const { id } = request.params;
            const body = request.body;
            const updated = await documentService.updateDocument({
                id,
                title: body.title,
                type: body.type,
                status: body.status,
                active: body.active,
            });
            return updated;
        }
        catch (error) {
            reply.code(404);
            return {
                message: "Validation failed",
                errors: error.errors ?? error.message
            };
        }
    });
    server.delete("/documents/:id", {
        schema: {
            params: document_schema_1.documentIdParamSchema,
        },
    }, async (request, reply) => {
        try {
            const { id } = request.params;
            await documentService.deleteDocument({ id });
            reply.code(204);
            return;
        }
        catch (error) {
            reply.code(404);
            return {
                message: error.message ?? "Document not found"
            };
        }
    });
    const PORT = Number(process.env.PORT || 3000);
    await server.listen({ port: PORT });
    console.log("Server running at http://localhost:3000");
}
bootstrap();
//# sourceMappingURL=server.js.map