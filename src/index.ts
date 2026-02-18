
import "reflect-metadata";
import { AppDataSource } from "./app/database/data-source";
import { DocumentRepository } from "./app/repositories/DocumentRepository";
// import { DocumentVersionRepository } from "./app/repositories/DocumentVersionRepository";
import { InMemoryDocumentService } from "./app/services/InMemoryDocumentService";
import { DocType, DocStatusType } from "./contracts/states/document";
import { redisClient } from "./entry/redis";
import type {
    CreateDocumentCommand,
    DeleteDocumentCommand,
    SearchDocumentCommand,
    UpdateDocumentCommand,
} from "./contracts/states/document";
import { DocumentServices } from "./app/services/DocumentServices";
import { KafkaPublisher } from "./infrastructure/messaging/KafkaPublisher";

async function main() {


    // const docService = new InMemoryDocumentService();


    // ------------------------------------ //

    await AppDataSource.initialize();
    const repo = new DocumentRepository();
    // const versionRepo = new DocumentVersionRepository();

    const kafkaPublisher = new KafkaPublisher(["localhost:9092"]);
    await kafkaPublisher.connect();
    const docService = new DocumentServices(repo, redisClient, kafkaPublisher);
    const docs: CreateDocumentCommand[] = [
        {
            title: "Project Plan 1",
            type: DocType.PDF
        },
        {
            title: "Meeting Notes 2",
            type: DocType.TXT
        },
        {
            title: "Architecture Diagram 3",
            type: DocType.PNG
        },
        {
            title: "Team Photo 4",
            type: DocType.JPG
        },
    ];

    const createdDocs = [];

    for (const doc of docs) {
        const created = await docService.createDocument(doc);
        createdDocs.push(created);
    }

    console.log("\nAll documents created:\n", createdDocs);

    const fetched = await docService.getDocument({ id: createdDocs[1]!.id });
    console.log("\nFetched document by id:");
    console.log(fetched);

    const searchResults = await docService.searchDocument({ title: "" });
    console.log("\nSearch results:");
    console.log(searchResults);

    const deleted = await docService.deleteDocument({ id: createdDocs[0]!.id });
    console.log("\nDeleted first doc:", deleted);

    const updated = await docService.updateDocument({
        id: createdDocs[1]!.id,
        title: "Updated meeting notes 5",
        status: DocStatusType.PUBLISHED,
    });

    console.log("\nUpdated doc:");
    console.log(updated);

    const finalDocs = await docService.searchDocument({});
    console.log("\nFinal docs:");
    console.log(finalDocs);
}

main();

