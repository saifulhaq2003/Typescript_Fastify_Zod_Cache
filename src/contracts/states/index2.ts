// import "reflect-metadata"
// import { AppDataSource } from "../../app/database/data-source"
// import { DocumentRepository } from "../../app/repositories/DocumentRepository"
// import { DocumentServices } from "../../app/services/DocumentServices"
// import { DocStatusType, DocType } from "./document"
// import { DocumentVersionRepository } from "../../app/repositories/DocumentVersionRepository"
// import { InMemoryDocumentService } from "../../app/services/InMemoryDocumentService"

// async function main() {
//     await AppDataSource.initialize();

//     const repo = new DocumentRepository();
//     // const versionRepo = new DocumentVersionRepository
//     const service = new DocumentServices(repo);

//     const inMemService = new InMemoryDocumentService();

//     const doc = await service.createDocument({
//         title: "This is doc 1",
//         type: DocType.PDF,
//     });


//     console.log("Created document:", doc);

//     // const fetched = await service.getDocument({
//     //     id: doc.id,
//     // });

//     // console.log("Fetched by Id: ", fetched);

//     // const searchResults = await service.searchDocument({
//     //     title: "Search",
//     // });

//     // console.log("Search results:", searchResults);

//     // const allDocs = await service.searchDocument({});
//     // console.log("All documents: ", allDocs);

//     // const deleteResult = await service.deleteDocument({
//     //     id: doc.id,
//     // });

//     // console.log("Delete result:", deleteResult);

//     // const afterDelete = await service.getDocument({
//     //     id: doc.id,
//     // });

//     // console.log("Fetch after delete: ", afterDelete)

//     // const updated = await service.updateDocument({
//     //     id: doc.id,
//     //     title: "Updated title",
//     //     status: DocStatusType.PUBLISHED,
//     // });

//     // console.log("Updated document: ", updated);

//     // await service.addVersion({
//     //     documentId: doc.id,
//     //     title: "Draft Architecture",
//     // });

//     // await service.addVersion({
//     //     documentId: doc.id,
//     //     title: "Architecture Diagram",
//     // });

//     // await service.addVersion({
//     //     documentId: doc.id,
//     //     title: "Final Architecture",
//     // });

//     // const versions = await service.getVersions({ documentId: '30008007-d3ed-40f1-9e60-69dda5b633dc' });

//     // console.log("Versions of document: ", versions);
// }

// main();






// ----------------------




// import "reflect-metadata";
// import { AppDataSource } from "./app/database/data-source";
// import { DocumentRepository } from "./app/repositories/DocumentRepository";
// import { DocumentVersionRepository } from "./app/repositories/DocumentVersionRepository";
// import { InMemoryDocumentService } from "./app/services/InMemoryDocumentService";
// import { DocStatusType } from "./contracts/states/document";

// import {
//     CreateDocumentCommand,
//     DeleteDocumentCommand,

//     DocType,
//     SearchDocumentCommand,
//     UpdateDocumentCommand,
// } from "./contracts/states/document";
// import { DocumentServices } from "./app/services/DocumentServices";

// async function main() {


//     // const docService = new InMemoryDocumentService();


//     // ------------------------------------ //

//     await AppDataSource.initialize();
//     const repo = new DocumentRepository();
//     // const versionRepo = new DocumentVersionRepository();
//     const docService = new DocumentServices(repo);


//     const docs: CreateDocumentCommand[] = [
//         { title: "Project Plan", type: DocType.PDF },
//         { title: "Meeting Notes", type: DocType.TXT },
//         { title: "Architecture Diagram", type: DocType.PNG },
//         { title: "Team Photo", type: DocType.JPG },
//     ];

//     const createdDocs = [];

//     for (const doc of docs) {
//         const created = await docService.createDocument(doc);
//         createdDocs.push(created);
//     }

//     console.log("\nAll documents created:\n", createdDocs);

//     const fetched = await docService.getDocument({ id: createdDocs[1]!.id });
//     console.log("\nFetched document by id:");
//     console.log(fetched);

//     const searchResults = await docService.searchDocument({ title: "Proj" });
//     console.log("\nSearch results:");
//     console.log(searchResults);

//     const deleted = await docService.deleteDocument({ id: createdDocs[0]!.id });
//     console.log("\nDeleted first doc:", deleted);

//     const updated = await docService.updateDocument({
//         id: createdDocs[1]!.id,
//         title: "Updated meeting notes",
//         status: DocStatusType.PUBLISHED,
//     });

//     console.log("\nUpdated doc:");
//     console.log(updated);

//     const finalDocs = await docService.searchDocument({});
//     console.log("\nFinal docs:");
//     console.log(finalDocs);
// }

// main();





// taking inputs using cli
// ---------------------------
// import "reflect-metadata";
// import { InMemoryDocumentService } from "./app/services/InMemoryDocumentService";
// import { AppDataSource } from "./app/database/data-source";
// import { DocumentRepository } from "./app/repositories/DocumentRepository";
// import { DocumentVersionRepository } from "./app/repositories/DocumentVersionRepository";
// import { DocStatusType, DocType } from "./contracts/states/document";

// async function main() {
//     const args = process.argv.slice(2);
//     const command = args[0];

//     // ===============================
//     // 👉 PICK ONE (comment the other)
//     // ===============================

//     const docService = new InMemoryDocumentService();

//     // await AppDataSource.initialize();
//     // const repo = new DocumentRepository();
//     // const versionRepo = new DocumentVersionRepository();
//     // const docService = new DBDocumentService(repo, versionRepo);

//     // ===============================

//     switch (command) {
//         case "create": {
//             const title = args[1];
//             const type = args[2] as DocType;

//             if (!title || !type) {
//                 console.log("Usage: create <title> <PDF|TXT|PNG|JPG>");
//                 break;
//             }

//             const doc = await docService.createDocument({ title, type });
//             console.log("✅ Created:", doc);
//             break;
//         }

//         case "get": {
//             const id = args[1];
//             if (!id) {
//                 console.log("Usage: get <documentId>");
//                 break;
//             }

//             const doc = await docService.getDocument({ id });
//             console.log(doc ? doc : "❌ Document not found");
//             break;
//         }

//         case "search": {
//             const title = args[1];
//             const docs = await docService.searchDocument({ title });
//             console.log("🔎 Results:", docs);
//             break;
//         }

//         case "delete": {
//             const id = args[1];
//             if (!id) {
//                 console.log("Usage: delete <documentId>");
//                 break;
//             }

//             const result = await docService.deleteDocument({ id });
//             console.log(result ? "🗑 Deleted" : "❌ Not found");
//             break;
//         }

//         case "update": {
//             const id = args[1];
//             const newTitle = args[2];
//             const status = args[3] as DocStatusType | undefined;

//             if (!id) {
//                 console.log("Usage: update <id> <newTitle?> <DRAFT|PUBLISHED?>");
//                 break;
//             }

//             const updated = await docService.updateDocument({
//                 id,
//                 title: newTitle,
//                 status,
//             });

//             console.log(updated ? "✏️ Updated:" : "❌ Not found", updated);
//             break;
//         }

//         default:
//             console.log(`
// Available commands:

// create <title> <PDF|TXT|PNG|JPG>
// get <documentId>
// search <title?>
// delete <documentId>
// update <id> <newTitle?> <DRAFT|PUBLISHED?>

// Examples:
// node dist/index.js create "My Doc" PDF
// node dist/index.js search Pro
// node dist/index.js update <id> "New Title" PUBLISHED
// `);
//     }
// }

// main().catch(err => {
//     console.error("❌ Error:", err);
//     process.exit(1);
// });















// Completely cli interactive working version
// ---------------------------
// import "reflect-metadata";
// import readline from "node:readline";
// import { InMemoryDocumentService } from "./app/services/InMemoryDocumentService";
// import { DocStatusType, DocType } from "./contracts/states/document";

// async function main() {
//     const docService = new InMemoryDocumentService();

//     const rl = readline.createInterface({
//         input: process.stdin,
//         output: process.stdout,
//     });

//     console.log("📄 Document CLI (in-memory)");
//     console.log("Commands:");
//     console.log("  create <title> <PDF|TXT|PNG|JPG>");
//     console.log("  get <id>");
//     console.log("  search <title?>");
//     console.log("  delete <id>");
//     console.log("  update <id> <newTitle?> <DRAFT|PUBLISHED?>");
//     console.log("  exit");
//     console.log("");

//     rl.on("line", async (line) => {
//         const [command, ...args] = line.trim().split(" ");

//         switch (command) {
//             case "create": {
//                 const title = args[0];
//                 const type = args[1] as DocType;

//                 if (!title || !type) {
//                     console.log("Usage: create <title> <PDF|TXT|PNG|JPG>");
//                     break;
//                 }

//                 const doc = await docService.createDocument({ title, type });
//                 console.log("✅ Created:", doc);
//                 break;
//             }

//             case "get": {
//                 const id = args[0];
//                 if (!id) {
//                     console.log("Usage: get <id>");
//                     break;
//                 }

//                 const doc = await docService.getDocument({ id });
//                 console.log(doc ? doc : "❌ Document not found");
//                 break;
//             }

//             case "search": {
//                 const title = args[0];
//                 const docs = await docService.searchDocument({ title });
//                 console.log("🔎 Results:", docs);
//                 break;
//             }

//             case "delete": {
//                 const id = args[0];
//                 if (!id) {
//                     console.log("Usage: delete <id>");
//                     break;
//                 }

//                 const result = await docService.deleteDocument({ id });
//                 console.log(result ? "🗑 Deleted" : "❌ Not found");
//                 break;
//             }

//             case "update": {
//                 const id = args[0];
//                 const newTitle = args[1];
//                 const status = args[2] as DocStatusType | undefined;

//                 if (!id) {
//                     console.log("Usage: update <id> <newTitle?> <DRAFT|PUBLISHED?>");
//                     break;
//                 }

//                 const updated = await docService.updateDocument({
//                     id,
//                     title: newTitle,
//                     status,
//                 });

//                 console.log(updated ? "✏️ Updated:" : "❌ Not found", updated);
//                 break;
//             }

//             case "exit": {
//                 console.log("👋 Bye!");
//                 rl.close();
//                 process.exit(0);
//             }

//             default:
//                 console.log("❓ Unknown command");
//         }
//     });
// }

// main();
