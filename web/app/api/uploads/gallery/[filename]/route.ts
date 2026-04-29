import { NextRequest, NextResponse } from "next/server";
import { createReadStream, existsSync } from "fs";
import { stat } from "fs/promises";
import { join } from "path";

const isWindows = process.platform === 'win32';
const EXTERNAL_UPLOAD_DIR = isWindows ? join(process.cwd(), '..', 'node_uploads') : '/home/node_uploads/';

// Simple mime type map for standard images
const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml'
};

export async function GET(req: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
    try {
        const { filename } = await params;
        
        // Prevent directory traversal attacks
        if (filename.includes('/') || filename.includes('..')) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const filePath = join(EXTERNAL_UPLOAD_DIR, filename);

        if (!existsSync(filePath)) {
            return new NextResponse("File Not Found", { status: 404 });
        }

        const fileStat = await stat(filePath);
        
        // Determine content type
        const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
        const contentType = mimeTypes[ext] || 'application/octet-stream';

        // Use standard Web API Response streams compatible with Next.js App Router
        const fileStream = createReadStream(filePath);
        const webStream = new ReadableStream({
            start(controller) {
                fileStream.on("data", (chunk: any) => controller.enqueue(new Uint8Array(chunk)));
                fileStream.on("end", () => controller.close());
                fileStream.on("error", (err: Error) => controller.error(err));
            },
            cancel() {
                fileStream.destroy();
            }
        });

        return new NextResponse(webStream, {
            headers: {
                "Content-Type": contentType,
                "Content-Length": fileStat.size.toString(),
                "Cache-Control": "public, max-age=31536000, immutable" // Cache indefinitely
            }
        });
    } catch (error) {
        console.error("[GALLERY_PROXY_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
