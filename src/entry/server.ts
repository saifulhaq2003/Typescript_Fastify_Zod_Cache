import "dotenv/config";
import Fastify from "fastify";
import { DocumentRepository } from "../app/repositories/DocumentRepository";
import { DocumentServices } from "../app/services/DocumentServices";
import { DocStatusType, DocType } from "src/contracts/states/document";
import { AppDataSource } from "../app/database/data-source";
import { connectRedis, redisClient } from "./redis";
import { createDocumentSchema, patchDocumentSchema, updateDocumentSchema, documentIdParamSchema, queryValidatorSchema } from "../contracts/validators/document.schema";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, type ZodTypeProvider } from "fastify-type-provider-zod"
import swagger, { fastifySwagger } from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { InMemoryDocumentService } from "src/app/services/InMemoryDocumentService";

async function bootstrap() {

    await AppDataSource.initialize();
    console.log("DB connected");

    await connectRedis();

    const server = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

    server.setValidatorCompiler(validatorCompiler);
    server.setSerializerCompiler(serializerCompiler);

    await server.register(fastifySwagger, {
        openapi: {
            info: {
                title: "Document API",
                description: "Document Management API",
                version: "1.0.0",
            },
        },
        transform: jsonSchemaTransform,
    });

    await server.register(swaggerUI, {
        routePrefix: "/docs",

    });

    const repo = new DocumentRepository();
    // const inMemDocService = new InMemoryDocumentService();
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

    server.post("/documents", {
        schema: {
            body: createDocumentSchema,
        },
    },
        async (request, reply) => {
            try {
                const { title, type } = request.body;
                const doc = await documentService.createDocument({
                    title,
                    type,
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

    server.get("/documents/:id", {
        schema: {
            params: documentIdParamSchema,
        },
    },
        async (request, reply) => {
            const { id } = request.params;
            try {
                return await documentService.getDocument({ id });
            } catch (err: any) {
                reply.code(404);
                return {
                    message: err.message
                };
            }

        });

    server.get("/documents", {
        schema: {
            querystring: queryValidatorSchema,
        },
    }, async (request, reply) => {
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

    server.put("/documents/:id",
        {
            schema: {
                params: documentIdParamSchema,
                body: updateDocumentSchema,
            },
        },
        async (request, reply) => {
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

            } catch (error: any) {
                reply.code(404);
                return {
                    message: "Validation",
                    errors: error.errors ?? error.message
                };
            }
        })

    server.patch("/documents/:id",
        {
            schema: {
                params: documentIdParamSchema,
                body: patchDocumentSchema,
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

            } catch (error: any) {
                reply.code(404);
                return {
                    message: "Validation failed",
                    errors: error.errors ?? error.message
                };
            }
        });

    server.delete("/documents/:id",
        {
            schema: {
                params: documentIdParamSchema,
            },
        },
        async (request, reply) => {
            try {
                const { id } = request.params;

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