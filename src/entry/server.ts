import "dotenv/config";
import Fastify from "fastify";
import { AppDataSource } from "../app/database/data-source";
import { connectRedis, redisClient } from "./redis";

import { jsonSchemaTransform, serializerCompiler, validatorCompiler, type ZodTypeProvider } from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

import { DocumentRepository } from "../app/repositories/DocumentRepository";
import { DocumentServices } from "../app/services/DocumentServices";
import { DocumentController } from "../app/controllers/DocumentController";
import { documentRoutes } from "./routes";

async function bootstrap() {

    // ---------------- DATABASE ----------------
    await AppDataSource.initialize();
    console.log("DB connected");

    // ---------------- REDIS ----------------
    await connectRedis();

    // ---------------- SERVER ----------------
    const server = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

    server.setValidatorCompiler(validatorCompiler);
    server.setSerializerCompiler(serializerCompiler);

    // ---------------- SWAGGER ----------------
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

    // ---------------- DEPENDENCY INJECTION ----------------
    const repo = new DocumentRepository();
    const service = new DocumentServices(repo, redisClient);
    const controller = new DocumentController(service);

    // ---------------- ROUTES ----------------
    await documentRoutes(server, controller);

    // ---------------- HEALTH CHECKS ----------------
    server.get("/health", async () => ({ status: "ok" }));

    server.get("/redis-health", async () => {
        try {
            await redisClient.set("health", "ok");
            const value = await redisClient.get("health");

            return {
                redis: value,
                status: "connected",
            };
        } catch {
            return {
                redis: "down",
                status: "disconnected",
            };
        }
    });

    // ---------------- START ----------------
    const PORT = Number(process.env.PORT || 3000);
    await server.listen({ port: PORT, host: "0.0.0.0" });

    console.log(`Server running at http://localhost:${PORT}`);
}

bootstrap();
