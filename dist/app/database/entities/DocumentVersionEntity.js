"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentVersionEntity = void 0;
const typeorm_1 = require("typeorm");
const DocumentEntity_1 = require("./DocumentEntity");
let DocumentVersionEntity = class DocumentVersionEntity {
};
exports.DocumentVersionEntity = DocumentVersionEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], DocumentVersionEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DocumentVersionEntity.prototype, "documentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => DocumentEntity_1.DocumentEntity, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "documentId" }),
    __metadata("design:type", DocumentEntity_1.DocumentEntity)
], DocumentVersionEntity.prototype, "document", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], DocumentVersionEntity.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DocumentVersionEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], DocumentVersionEntity.prototype, "createdAt", void 0);
exports.DocumentVersionEntity = DocumentVersionEntity = __decorate([
    (0, typeorm_1.Entity)("document_versions")
], DocumentVersionEntity);
//# sourceMappingURL=DocumentVersionEntity.js.map