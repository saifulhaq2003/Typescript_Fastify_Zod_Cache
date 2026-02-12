import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDocuments1770789309839 implements MigrationInterface {
    name = 'InitDocuments1770789309839'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "documents" ("id" uuid NOT NULL, "title" character varying NOT NULL, "type" "public"."documents_type_enum" NOT NULL, "status" "public"."documents_status_enum" NOT NULL, "active" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "documents"`);
    }

}
