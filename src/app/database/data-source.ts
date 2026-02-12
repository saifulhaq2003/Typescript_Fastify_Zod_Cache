import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { DocumentEntity } from "./entities/DocumentEntity";
import { DocumentVersionEntity } from "./entities/DocumentVersionEntity";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: false,
    entities: [DocumentEntity],
    migrations: ["src/app/database/migrations/**/*.ts"],
    subscribers: [],
});