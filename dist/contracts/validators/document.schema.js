"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryValidatorSchema = exports.documentIdParamSchema = exports.patchDocumentSchema = exports.updateDocumentSchema = exports.createDocumentSchema = void 0;
const zod_1 = require("zod");
const document_1 = require("../states/document");
exports.createDocumentSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required").max(100),
    type: zod_1.z.enum(document_1.DocType),
});
exports.updateDocumentSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(100),
    type: zod_1.z.enum(document_1.DocType),
    status: zod_1.z.enum(document_1.DocStatusType).optional(),
    active: zod_1.z.boolean().optional(),
});
exports.patchDocumentSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(100).optional(),
    type: zod_1.z.enum(document_1.DocType).optional(),
    status: zod_1.z.enum(document_1.DocStatusType).optional(),
    active: zod_1.z.boolean().optional(),
});
exports.documentIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid("Invalid doc id")
});
exports.queryValidatorSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
});
//# sourceMappingURL=document.schema.js.map