"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const data_source_1 = require("./app/database/data-source");
const DocumentRepository_1 = require("./app/repositories/DocumentRepository");
const DocumentServices_1 = require("./app/services/DocumentServices");
const document_1 = require("./contracts/states/document");
const InMemoryDocumentService_1 = require("./app/services/InMemoryDocumentService");
async function main() {
    await data_source_1.AppDataSource.initialize();
    const repo = new DocumentRepository_1.DocumentRepository();
    const service = new DocumentServices_1.DocumentServices(repo);
    const inMemService = new InMemoryDocumentService_1.InMemoryDocumentService();
    const doc = await service.createDocument({
        title: "This is doc 1",
        type: document_1.DocType.PDF,
    });
    console.log("Created document:", doc);
}
main();
//# sourceMappingURL=index2.js.map