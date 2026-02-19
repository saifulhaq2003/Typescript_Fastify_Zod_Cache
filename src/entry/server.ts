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
import { KafkaPublisher } from "../infrastructure/messaging/KafkaPublisher";
import { startKafkaListener } from "./kafkaListener";
import { KafkaProducer } from "../infrastructure/messaging/KafkaProducer";
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

    const kafkaProducer = new KafkaProducer(
        process.env.KAFKA_BROKERS?.split(",") ?? ["localhost:9092"]
    );
    await kafkaProducer.connect();

    const kafkaPublisher = new KafkaPublisher(kafkaProducer);

    const repo = new DocumentRepository();
    const service = new DocumentServices(repo, redisClient, kafkaPublisher);
    const controller = new DocumentController(service);

    await documentRoutes(server, controller);

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

    const PORT = Number(process.env.PORT || 3000);

    await startKafkaListener();

    await server.listen({ port: PORT, host: "0.0.0.0" });

    console.log(`Server running at http://localhost:${PORT}`);
}

bootstrap();
