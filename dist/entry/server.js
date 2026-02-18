"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const fastify_1 = __importDefault(require("fastify"));
const data_source_1 = require("../app/database/data-source");
const redis_1 = require("./redis");
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const DocumentRepository_1 = require("../app/repositories/DocumentRepository");
const DocumentServices_1 = require("../app/services/DocumentServices");
const DocumentController_1 = require("../app/controllers/DocumentController");
const routes_1 = require("./routes");
async function bootstrap() {
    await data_source_1.AppDataSource.initialize();
    console.log("DB connected");
    await (0, redis_1.connectRedis)();
    const server = (0, fastify_1.default)({ logger: true }).withTypeProvider();
    server.setValidatorCompiler(fastify_type_provider_zod_1.validatorCompiler);
    server.setSerializerCompiler(fastify_type_provider_zod_1.serializerCompiler);
    await server.register(swagger_1.default, {
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
    const service = new DocumentServices_1.DocumentServices(repo, redis_1.redisClient);
    const controller = new DocumentController_1.DocumentController(service);
    await (0, routes_1.documentRoutes)(server, controller);
    server.get("/health", async () => ({ status: "ok" }));
    server.get("/redis-health", async () => {
        try {
            await redis_1.redisClient.set("health", "ok");
            const value = await redis_1.redisClient.get("health");
            return {
                redis: value,
                status: "connected",
            };
        }
        catch {
            return {
                redis: "down",
                status: "disconnected",
            };
        }
    });
    const PORT = Number(process.env.PORT || 3000);
    await server.listen({ port: PORT, host: "0.0.0.0" });
    console.log(`Server running at http://localhost:${PORT}`);
}
bootstrap();
//# sourceMappingURL=server.js.map