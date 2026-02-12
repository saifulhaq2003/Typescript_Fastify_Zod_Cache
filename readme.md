# Swagger

import Fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

const server = Fastify({ logger: true });

async function bootstrap() {
await server.register(swagger, {
swagger: {
info: {
title: "My API",
description: "Learning Fastify APIs",
version: "1.0.0",
},
},
});

    await server.register(swaggerUI, {
        routePrefix: "/docs",
    });

    server.get("/hello", async () => {
        return { message: "Hello" };
    });

    server.get(
        "/documents/:id",
        {
            schema: {
                params: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                    },
                    required: ["id"],
                },
            },
        },
        async (request) => {
            const params = request.params as { id: string };

            return {
                message: "You asked for",
                documentId: params.id,
            };
        }
    );

    server.get(
        "/search",
        {
            schema: {
                querystring: {
                    type: "object",
                    properties: {
                        title: { type: "string" },
                    },
                },
            },
        },
        async (request) => {
            const query = request.query as { title?: string };

            return {
                message: "Searching Documents",
                title: query.title ?? "no title provided",
            };
        }
    );

    server.post(
        "/documents",
        {
            schema: {
                body: {
                    type: "object",
                    required: ["title", "type"],
                    properties: {
                        title: { type: "string" },
                        type: { type: "string" },
                    },
                },
            },
        },
        async (request) => {
            const body = request.body as { title: string; type: string };

            return {
                message: "Document received",
                received: body,
            };
        }
    );

    server.delete(
        "/documents/:id",
        {
            schema: {
                params: {
                    type: "object",
                    required: ["id"],
                    properties: {
                        id: { type: "string" },
                    },
                },
            },
        },
        async (request) => {
            const { id } = request.params as { id: string };
            return {
                message: "Document deleted",
                id,
            };
        }
    );



    server.listen({ port: 3000 }, () => {
        console.log("Server running at http://localhost:3000");
        console.log("📘 Swagger UI at http://localhost:3000/docs");
    });

}

bootstrap();

# difference in time of db and cache hit

{"level":30,"time":1770782007841,"pid":16525,"hostname":"Saifuls-MacBook-Pro.local","reqId":"req-2","res":{"statusCode":200},`"responseTime":50.52895903587341`,"msg":"request completed"}
{"level":30,"time":1770782013326,"pid":16525,"hostname":"Saifuls-MacBook-Pro.local","reqId":"req-3","req":{"method":"GET","url":"/documents/82997f90-8b65-428a-bc94-c7b0f9718402","host":"localhost:3000","remoteAddress":"::1","remotePort":55082},"msg":"incoming request"}
{"level":30,"time":1770782013329,"pid":16525,"hostname":"Saifuls-MacBook-Pro.local","reqId":"req-3","res":{"statusCode":200},`"responseTime":2.1818339824676514`,"msg":"request completed"}

# To run migrations

## `in typeormconfig.ts`

export default new DataSource({
type: "postgres",
host: "localhost",
port: 5432,
username: "postgres",
password: "postgres",
database: "typeorm",
synchronize: false,
logging: true,
entities: [DocumentEntity],
migrations: ["src/app/database/migrations/**/*.ts"],
subscribers: [],
});

## `in package.json`

"typeorm": "ts-node ./node_modules/typeorm/cli.js",
"typeorm:create-migration": "npm run typeorm -- migration:create ./migrations/$npm_config_name",

`Create` folder in db as migrations and then run the below in cli
`npm run typeorm:create-migration --name=Document`

Then do `generate`
npm run migration:generate --name=InitDocuments

Then `run`
`npm run migration:run`
