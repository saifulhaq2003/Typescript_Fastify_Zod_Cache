"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const DocumentEntity_1 = require("./entities/DocumentEntity");
const DocumentVersionEntity_1 = require("./entities/DocumentVersionEntity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "typeorm",
    synchronize: false,
    migrationsRun: true,
    entities: [DocumentEntity_1.DocumentEntity, DocumentVersionEntity_1.DocumentVersionEntity],
    migrations: ["dist/app/database/migrations/*.js"],
});
//# sourceMappingURL=data-source.js.map