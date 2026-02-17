"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitDocuments1770789309839 = void 0;
class InitDocuments1770789309839 {
    constructor() {
        this.name = 'InitDocuments1770789309839';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "documents" ("id" uuid NOT NULL, "title" character varying NOT NULL, "type" "public"."documents_type_enum" NOT NULL, "status" "public"."documents_status_enum" NOT NULL, "active" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "documents"`);
    }
}
exports.InitDocuments1770789309839 = InitDocuments1770789309839;
//# sourceMappingURL=1770789309839-InitDocuments.js.map