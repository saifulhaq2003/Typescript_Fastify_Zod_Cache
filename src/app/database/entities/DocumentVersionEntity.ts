import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DocumentEntity } from "./DocumentEntity";

@Entity("document_versions")
export class DocumentVersionEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    documentId!: string;

    @ManyToOne(() => DocumentEntity, { onDelete: "CASCADE" })
    @JoinColumn({ name: "documentId" })
    document!: DocumentEntity

    @Column()
    version!: number;

    @Column()
    title!: string;

    @CreateDateColumn()
    createdAt!: Date;
}