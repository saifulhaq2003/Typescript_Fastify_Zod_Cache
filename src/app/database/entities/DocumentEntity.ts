import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { DocType, DocStatusType } from "../../../contracts/states/document"

@Entity("documents")
export class DocumentEntity {
    @PrimaryColumn("uuid")
    id!: string;

    @Column()
    title!: string;

    @Column({ type: "enum", enum: DocType })
    type!: DocType;

    @Column({ type: "enum", enum: DocStatusType })
    status!: DocStatusType;

    @Column()
    active!: boolean;

    @Column()
    url!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}