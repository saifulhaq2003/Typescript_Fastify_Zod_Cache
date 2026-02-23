import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";
import sharp from "sharp";
import { DocumentEvent } from "../../contracts/events/document.event";
import { DocType } from "../../contracts/states/document";

const IMAGE_TYPES = [DocType.PNG, DocType.JPG];
const VARIANT_SIZES = [128, 256, 512] as const;
const MIN_DIMENSION = 1000;
const TMP_DIR = path.join(process.cwd(), "tmp/documents");


export class DocumentProcessingServices {
    async processEvent(event: DocumentEvent): Promise<void> {
        switch (event.event) {
            case "document.created":
                await this.handleCreated(event.payload);
                break;

            case "document.retrieved":
                await this.handleRetrieved(event.payload);
                break;

            case "document.searched":
                await this.handleSearched(event.payload);
                break;

            case "document.deleted":
                await this.handleDeleted(event.payload);
                break;

            case "document.updated":
                await this.handleUpdated(event.payload);
        }
    }

    private async handleCreated(payload: {
        documentId: string;
        title: string;
        type: string;
        createdAt: string;
        url: string;
    }): Promise<void> {
        console.log(`document.created`);
        console.log(`  ID:         ${payload.documentId}`);
        console.log(`  Title:      ${payload.title}`);
        console.log(`  Type:       ${payload.type}`);
        console.log(`  Created At: ${payload.createdAt}`);
        console.log(`Document processed successfully`);

        if (IMAGE_TYPES.includes(payload.type as DocType)) {
            await this.processImage(payload.documentId, payload.type as DocType, payload.url);
        }
    }

    private async processImage(documentId: string, type: DocType, url: string): Promise<void> {
        const docDir = path.join(TMP_DIR, documentId);
        fs.mkdirSync(docDir, { recursive: true });

        console.log(`[ImageProcessing] Downloading image from ${url}`);
        const imageBuffer = await this.downloadFile(url);
        const metadata = await sharp(imageBuffer).metadata();
        const width = metadata.width ?? 0;
        const height = metadata.height ?? 0;

        const extension = type === DocType.PNG ? "png" : "jpg";
        const originalPath = path.join(docDir, `original.${extension}`);

        await fs.promises.writeFile(originalPath, imageBuffer);
        console.log(`[ImageProcessing] Saved original (${width}x${height}) -> ${originalPath}`);

        if (width < MIN_DIMENSION || height < MIN_DIMENSION) {
            console.log(`[ImageProcessing] Image too small (${width}x${height}), skipping variants.`);
            return;
        }

        for (const size of VARIANT_SIZES) {
            const variantPath = path.join(docDir, `variant_${size}x${size}.${extension}`);
            await sharp(imageBuffer)
                .resize(size, size, { fit: "cover", position: "centre" })
                .toFile(variantPath);
            console.log(`[ImageProcessing] Saved variant ${size}x${size} → ${variantPath}`);
        }

        console.log(`[ImageProcessing] Done. Original + ${VARIANT_SIZES.length} variants saved to ${docDir}`);
    }

    private async downloadFile(url: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const protocol = url.startsWith("https") ? https : http;

            protocol.get(url, (response) => {
                if (
                    response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location
                ) {
                    this.downloadFile(response.headers.location).then(resolve).catch(reject);
                    return;
                }

                if (response.statusCode !== 200) {
                    reject(new Error(`Failed  to download. HTTP ${response.statusCode} URL: ${url}`));
                    return;
                }
                const chunks: Buffer[] = [];
                response.on("data", (chunk: Buffer) => chunks.push(chunk));
                response.on("end", () => resolve(Buffer.concat(chunks)));
                response.on("error", reject);
            }).on("error", reject);
        });
    }


    private async handleRetrieved(payload: {
        documentId: string;
        source: "db" | "cache";
        retrievedAt: string;
    }): Promise<void> {
        console.log(`document.retrieved`);
        console.log(`  ID:           ${payload.documentId}`);
        console.log(`  Source:       ${payload.source}`);
        console.log(`  Retrieved At: ${payload.retrievedAt}`);
        console.log(`document.retrieved logged`);
    }

    private async handleSearched(payload: {
        filters: { title?: string };
        resultCount: number;
        source: "cache" | "db";
        searchedAt: string;
    }): Promise<void> {
        console.log(`document.searched`);
        console.log(`  Title Filter: ${payload.filters.title ?? "(none)"}`);
        console.log(`  Results:      ${payload.resultCount}`);
        console.log(`  Source:       ${payload.source}`);
        console.log(`  Searched At:  ${payload.searchedAt}`);
        console.log(`document.searched analytics recorded`);
    }

    private async handleDeleted(payload: {
        documentId: string;
        deletedAt: string;
    }): Promise<void> {
        console.log(`document.deleted`);
        console.log(`  ID:         ${payload.documentId}`);
        console.log(`  Deleted At: ${payload.deletedAt}`);
        console.log(`document.deleted cleaned up successfully`);
    }

    private async handleUpdated(payload: {
        documentId: string,
        changes: Record<string, unknown>;
        updatedAt: string;
    }): Promise<void> {
        console.log(`document.updated`);
        console.log(`  ID:         ${payload.documentId}`);
        console.log(`  Changes:    ${JSON.stringify(payload.changes)}`);
        console.log(`  Updated At: ${payload.updatedAt}`);
        console.log(`document.updated processed successfully`);
    }
}