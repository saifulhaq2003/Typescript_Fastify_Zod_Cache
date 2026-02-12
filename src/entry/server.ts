import "dotenv/config";
import Fastify from "fastify";
import { DocumentRepository } from "../app/repositories/DocumentRepository";
import { DocumentServices } from "../app/services/DocumentServices";
import { DocStatusType, DocType } from "src/contracts/states/document";
import { AppDataSource } from "../app/database/data-source";
import { connectRedis, redisClient } from "./redis";
import { createDocumentSchema, patchDocumentSchema, updateDocumentSchema, documentIdParamSchema } from "../contracts/validators/document.schema";

async function bootstrap() {

    await AppDataSource.initialize();
    console.log("DB connected");

    await connectRedis();

    const server = Fastify({ logger: true });

    const repo = new DocumentRepository();

    const documentService = new DocumentServices(repo, redisClient);

    server.get("/redis-health", async () => {
        await redisClient.set("health", "ok");
        const value = await redisClient.get("health");

        return {
            redis: value,
            status: "connected",
        };
    });

    server.get("/health", async () => {
        return { status: "ok" };
    });

    server.post("/documents", async (request, reply) => {
        try {
            const parsed = createDocumentSchema.parse(request.body);
            const body = request.body as { title: string, type: DocType }

            const doc = await documentService.createDocument({
                title: parsed.title,
                type: parsed.type as DocType,
            });

            reply.code(201);
            return doc;
        } catch (error: any) {
            reply.code(400);
            return {
                message: "Validation failed",
                errors: error.errors ?? error.message
            };
        }
    });

    server.get("/documents/:id", async (request, reply) => {
        const { id } = request.params as { id: string };
        try {
            return await documentService.getDocument({ id });
        } catch (err: any) {
            reply.code(404);
            return {
                message: err.message
            };
        }

    });

    // server.get("/documents/:id", async (request, reply) => {
    //     try {
    //         const params = request.params as { id: string };

    //         const doc = await documentService.getDocument({ id: params.id });
    //         return doc;
    //     } catch (error: any) {
    //         reply.code(404);
    //         return {
    //             message: error.message ?? "Document not found",
    //         };
    //     }
    // })

    server.get("/documents", async (request, reply) => {
        try {
            const { title } = request.query as { title?: string };

            return await documentService.searchDocument({ title: title });

        } catch (err: any) {
            reply.code(500);
            return {
                message: err.message,
            };
        }
    })

    server.put("/documents/:id", async (request, reply) => {
        try {
            const { id } = documentIdParamSchema.parse(request.params);
            const body = updateDocumentSchema.parse(request.body);

            const updated = await documentService.updateDocument({
                id: id,
                title: body.title,
                type: body.type as DocType,
                status: body.status as DocStatusType,
                active: body.active,
            });

            return updated;

        } catch (error: any) {
            reply.code(404);
            return {
                message: "Validation",
                errors: error.errors ?? error.message
            };
        }
    })

    server.patch("/documents/:id", async (request, reply) => {
        try {
            const { id } = documentIdParamSchema.parse(request.params);
            const body = patchDocumentSchema.parse(request.body);

            const updated = await documentService.updateDocument({
                id: id,
                title: body.title,
                type: body.type as DocType,
                status: body.status as DocStatusType,
                active: body.active,
            });

            return updated;

        } catch (error: any) {
            reply.code(404);
            return {
                message: "Validation failed",
                errors: error.errors ?? error.message
            };
        }
    });

    server.delete("/documents/:id", async (request, reply) => {
        try {
            const { id } = request.params as { id: string };

            await documentService.deleteDocument({ id });
            reply.code(204);
            return;
        } catch (error: any) {
            reply.code(404);
            return {
                message: error.message ?? "Document not found"
            };
        }

    })

    const PORT = Number(process.env.PORT || 3000);

    await server.listen({ port: PORT });
    console.log("Server running at http://localhost:3000");
}

bootstrap()