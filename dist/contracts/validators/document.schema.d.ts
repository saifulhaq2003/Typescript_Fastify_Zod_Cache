import { z } from "zod";
import { DocType, DocStatusType } from "../states/document";
export declare const createDocumentSchema: z.ZodObject<{
    title: z.ZodString;
    type: z.ZodEnum<typeof DocType>;
}, z.core.$strip>;
export declare const updateDocumentSchema: z.ZodObject<{
    title: z.ZodString;
    type: z.ZodEnum<typeof DocType>;
    status: z.ZodOptional<z.ZodEnum<typeof DocStatusType>>;
    active: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const patchDocumentSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<typeof DocType>>;
    status: z.ZodOptional<z.ZodEnum<typeof DocStatusType>>;
    active: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const documentIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const queryValidatorSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=document.schema.d.ts.map