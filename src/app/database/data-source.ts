import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { DocumentEntity } from "./entities/DocumentEntity";

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
    migrations: ["dist/app/database/migrations/**/*.ts"],
});