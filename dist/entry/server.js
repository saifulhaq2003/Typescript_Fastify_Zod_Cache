"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const DocumentRepository_1 = require("../app/repositories/DocumentRepository");
const DocumentServices_1 = require("../app/services/DocumentServices");
const data_source_1 = require("../app/database/data-source");
const redis_1 = require("./redis");
async function bootstrap() {
    await data_source_1.AppDataSource.initialize();
    console.log("DB connected");
    await (0, redis_1.connectRedis)();
    const server = (0, fastify_1.default)({ logger: true });
    const repo = new DocumentRepository_1.DocumentRepository();
    const documentService = new DocumentServices_1.DocumentServices(repo);
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
    server.post("/documents", async (request, reply) => {
        const body = request.body;
        const doc = await documentService.createDocument({
            title: body.title,
            type: body.type,
        });
        reply.code(201);
        return doc;
    });
    server.put("/documents/:id", async (request, reply) => {
        try {
            const params = request.params;
            const body = request.body;
            const updated = await documentService.updateDocument({
                id: params.id,
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
                message: error.message ?? "Document Not Found"
            };
        }
    });
    server.patch("/documents/:id", async (request, reply) => {
        try {
            const params = request.params;
            const body = request.body;
            const updated = await documentService.updateDocument({
                id: params.id,
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
                message: error.message ?? "Document not found"
            };
        }
    });
    server.delete("/documents/:id", async (request, reply) => {
        try {
            const params = request.params;
            await documentService.deleteDocument({ id: params.id });
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
    server.get("/documents/:id", async (request, reply) => {
        const { id } = request.params;
        const cacheKey = `document:${id}`;
        const cached = await redis_1.redisClient.get(cacheKey);
        if (cached) {
            return {
                source: "cache",
                data: JSON.parse(cached),
            };
        }
        try {
            const doc = await documentService.getDocument({ id });
            await redis_1.redisClient.set(cacheKey, JSON.stringify(doc), { EX: 60, });
            return {
                source: "db",
                data: doc,
            };
        }
        catch (err) {
            reply.code(404);
            return {
                message: err.message ?? "Document not found"
            };
        }
    });
    await server.listen({ port: 3000 });
    console.log("Server running at http://localhost:3000");
}
bootstrap();
//# sourceMappingURL=server.js.map