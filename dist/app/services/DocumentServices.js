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
exports.DocumentServices = void 0;
const performance_decorator_1 = require("../performance/performance.decorator");
const cache_decorators_1 = require("../cache/cache.decorators");
class DocumentServices {
    constructor(repo, redis) {
        this.repo = repo;
        this.redis = redis;
    }
    async createDocument(command) {
        const entity = await this.repo.create(command);
        await this.redis.del("documents:search:all");
        console.log("Search cache cleared after create");
        return {
            id: entity.id,
            title: entity.title,
            type: entity.type,
            status: entity.status,
            active: entity.active,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        };
    }
    async getDocument(command) {
        console.log("Executing getDocument (DB)");
        const entity = await this.repo.findById(command.id);
        return {
            id: entity.id,
            title: entity.title,
            type: entity.type,
            status: entity.status,
            active: entity.active,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        };
    }
    async searchDocument(command) {
        const cacheKey = `documents:search:title=${command.title ?? "all"}`;
        try {
            const cached = await this.redis.get(cacheKey);
            if (cached) {
                console.log("Returning search result from CACHE");
                return JSON.parse(cached);
            }
            console.log("Executing searchDocument (DB)");
            const entities = await this.repo.searchByTitle(command.title);
            const docs = entities.map((entity) => ({
                id: entity.id,
                title: entity.title,
                type: entity.type,
                status: entity.status,
                active: entity.active,
                createdAt: entity.createdAt,
                updatedAt: entity.updatedAt,
            }));
            await this.redis.set(cacheKey, JSON.stringify(docs), { EX: 60 });
            return docs;
        }
        catch (error) {
            throw new Error("Failed to fetch documents");
        }
    }
    async deleteDocument(command) {
        try {
            console.log("Executing deleteDocument (DB)");
            const deleted = await this.repo.deleteById(command.id);
            if (!deleted) {
                throw new Error("Document not found");
            }
            await this.redis.del(`documents:${command.id}`);
            await this.redis.del(`documents:search:all`);
            return true;
        }
        catch (err) {
            throw new Error("Document not found");
        }
    }
    async updateDocument(command) {
        try {
            console.log("Executing updateDocument (DB)");
            const entity = await this.repo.update(command);
            return {
                id: entity.id,
                title: entity.title,
                type: entity.type,
                status: entity.status,
                active: entity.active,
                createdAt: entity.createdAt,
                updatedAt: entity.updatedAt,
            };
        }
        catch (err) {
            throw new Error("Document not found");
        }
    }
}
exports.DocumentServices = DocumentServices;
__decorate([
    (0, performance_decorator_1.PerformanceTracker)("createDocument"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DocumentServices.prototype, "createDocument", null);
__decorate([
    (0, performance_decorator_1.PerformanceTracker)("getDocument"),
    (0, cache_decorators_1.CacheGet)("document", 60),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DocumentServices.prototype, "getDocument", null);
__decorate([
    (0, performance_decorator_1.PerformanceTracker)("searchDocument"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DocumentServices.prototype, "searchDocument", null);
__decorate([
    (0, performance_decorator_1.PerformanceTracker)("deleteDocument"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DocumentServices.prototype, "deleteDocument", null);
__decorate([
    (0, performance_decorator_1.PerformanceTracker)("updateDocument"),
    (0, cache_decorators_1.CachePurge)(["documents:search:*", "document:*"]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DocumentServices.prototype, "updateDocument", null);
//# sourceMappingURL=DocumentServices.js.map