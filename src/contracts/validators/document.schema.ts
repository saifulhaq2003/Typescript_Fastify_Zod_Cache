import { z } from "zod";
import { DocType, DocStatusType } from "../states/document";

export const createDocumentSchema = z.object({
    title: z.string().min(1, "Title is required").max(100),
    type: z.enum(DocType),
    url: z.string().url("Invalid URL"),
});

export const updateDocumentSchema = z.object({
    title: z.string().min(1).max(100),
    type: z.enum(DocType),
    status: z.enum(DocStatusType).optional(),
    active: z.boolean().optional(),
    url: z.string().url("Invalid URL").optional(),
});

export const patchDocumentSchema = z.object({
    title: z.string().min(1).max(100).optional(),
    type: z.enum(DocType).optional(),
    status: z.enum(DocStatusType).optional(),
    active: z.boolean().optional(),
    url: z.string().url("Invalid URL").optional(),
});

export const documentIdParamSchema = z.object({
    id: z.string().uuid("Invalid doc id")
});

export const queryValidatorSchema = z.object({
    title: z.string().optional(),
});