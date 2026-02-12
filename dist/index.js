"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const data_source_1 = require("./app/database/data-source");
const DocumentRepository_1 = require("./app/repositories/DocumentRepository");
const document_1 = require("./contracts/states/document");
const DocumentServices_1 = require("./app/services/DocumentServices");
async function main() {
    await data_source_1.AppDataSource.initialize();
    const repo = new DocumentRepository_1.DocumentRepository();
    const docService = new DocumentServices_1.DocumentServices(repo);
    const docs = [
        {
            title: "Project Plan 1",
            type: document_1.DocType.PDF
        },
        {
            title: "Meeting Notes 2",
            type: document_1.DocType.TXT
        },
        {
            title: "Architecture Diagram 3",
            type: document_1.DocType.PNG
        },
        {
            title: "Team Photo 4",
            type: document_1.DocType.JPG
        },
    ];
    const createdDocs = [];
    for (const doc of docs) {
        const created = await docService.createDocument(doc);
        createdDocs.push(created);
    }
    console.log("\nAll documents created:\n", createdDocs);
    const fetched = await docService.getDocument({ id: createdDocs[1].id });
    console.log("\nFetched document by id:");
    console.log(fetched);
    const searchResults = await docService.searchDocument({ title: "" });
    console.log("\nSearch results:");
    console.log(searchResults);
    const deleted = await docService.deleteDocument({ id: createdDocs[0].id });
    console.log("\nDeleted first doc:", deleted);
    const updated = await docService.updateDocument({
        id: createdDocs[1].id,
        title: "Updated meeting notes 5",
        status: document_1.DocStatusType.PUBLISHED,
    });
    console.log("\nUpdated doc:");
    console.log(updated);
    const finalDocs = await docService.searchDocument({});
    console.log("\nFinal docs:");
    console.log(finalDocs);
}
main();
//# sourceMappingURL=index.js.map