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
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDocumentCommand {
  title: string;
  type: DocType;
  url: string;
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
  url?: string;
  updatedAt?: Date;
}