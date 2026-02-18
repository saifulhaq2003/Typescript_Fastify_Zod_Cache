"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentEventHandler = void 0;
class DocumentEventHandler {
    async handle(event) {
        console.log("Processing document:", event.payload.documentId);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log("Document Processed:", event.payload.title);
    }
}
exports.DocumentEventHandler = DocumentEventHandler;
//# sourceMappingURL=DocumentEventHandler.js.map