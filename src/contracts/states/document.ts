export enum DocType {
  PDF = "PDF",
  TXT = "TXT",
  PNG = "PNG",
  JPG = "JPG"
}

export enum DocStatusType {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED"
}

export interface Document {
  id: string;
  title: string;
  type: DocType;
  status: DocStatusType;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDocumentCommand {
  title: string;
  type: DocType;
}

export interface GetDocumentCommand {
  id: string;
}

export interface SearchDocumentCommand {
  title?: string;
}

export interface DeleteDocumentCommand {
  id: string;
}

export interface UpdateDocumentCommand {
  id: string;
  title?: string;
  status?: DocStatusType;
  type?: DocType;
  active?: boolean;
  updatedAt?: Date;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  title: string;
  createdAt: Date;
}

export interface AddVersionCommand {
  documentId: string;
  title: string;
}

export interface GetVersionsCommand {
  documentId: string;
}