import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateDocumentsTable1707654000000 implements MigrationInterface {
    name = 'CreateDocumentsTable1707654000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "documents",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "title",
                        type: "varchar",
                    },
                    {
                        name: "type",
                        type: "enum",
                        enum: ["PDF", "TXT", "PNG", "JPG"],
                    },
                    {
                        name: "status",
                        type: "enum",
                        enum: ["DRAFT", "PUBLISHED"],
                    },
                    {
                        name: "active",
                        type: "boolean",
                        default: true,
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("documents");
    }
}