import "reflect-metadata";
import { DataSource } from "typeorm";
import { DocumentEntity } from "./src/app/database/entities/DocumentEntity";

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