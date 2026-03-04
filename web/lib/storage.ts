import { writeFile, unlink, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');

/**
 * Minimal replacement for @vercel/blob's put
 * Stores files in public/uploads/
 */
export async function put(filename: string, file: File | Buffer | string, options?: any) {
    if (!existsSync(UPLOAD_DIR)) {
        await mkdir(UPLOAD_DIR, { recursive: true });
    }

    // Add random suffix to filename if requested (matching Vercel Blob behavior)
    let finalFilename = filename;
    if (options?.addRandomSuffix) {
        const parts = filename.split('.');
        const ext = parts.pop();
        const name = parts.join('.');
        const suffix = Math.random().toString(36).substring(2, 10);
        finalFilename = `${name}-${suffix}.${ext}`;
    }

    const filePath = join(UPLOAD_DIR, finalFilename);
    const buffer = file instanceof File
        ? Buffer.from(await file.arrayBuffer())
        : Buffer.from(file as any);

    await writeFile(filePath, buffer);

    // Return the relative URL for public access
    return {
        url: `/uploads/${finalFilename}`,
        pathname: `uploads/${finalFilename}`,
        size: buffer.length,
        uploadedAt: new Date()
    };
}

/**
 * Minimal replacement for @vercel/blob's del
 * Deletes files from public/uploads/
 */
export async function del(url: string | string[]) {
    const urls = Array.isArray(url) ? url : [url];

    for (const u of urls) {
        try {
            // Only attempt to delete if it's a local path
            if (u.startsWith('/uploads/')) {
                const filename = u.split('/').pop();
                if (filename) {
                    const filePath = join(UPLOAD_DIR, filename);
                    if (existsSync(filePath)) {
                        await unlink(filePath);
                    }
                }
            }
        } catch (error) {
            console.error(`Failed to delete local file ${u}:`, error);
        }
    }
}
