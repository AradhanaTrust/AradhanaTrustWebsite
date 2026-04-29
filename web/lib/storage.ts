import { writeFile, unlink, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Resolve absolute path dynamically based on hosting environment
// We use process.env.HOME on Linux (Hostinger) to ensure we write to the user's home directory, not the server's root /home
const homeDir = process.env.HOME || join(process.cwd(), '..');
const EXTERNAL_UPLOAD_DIR = join(homeDir, 'node_uploads');
const DEFAULT_UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');

/**
 * Minimal replacement for @vercel/blob's put
 * Stores files in public/uploads/
 */
export async function put(filename: string, file: File | Buffer | string, options?: any) {
    const isGallery = options?.category === 'gallery';
    const TARGET_DIR = isGallery ? EXTERNAL_UPLOAD_DIR : DEFAULT_UPLOAD_DIR;

    if (!existsSync(TARGET_DIR)) {
        await mkdir(TARGET_DIR, { recursive: true });
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

    const filePath = join(TARGET_DIR, finalFilename);
    const buffer = file instanceof File
        ? Buffer.from(await file.arrayBuffer())
        : Buffer.from(file as any);

    await writeFile(filePath, buffer);

    // Return the relative URL for public access
    if (isGallery) {
        return {
            url: `/api/uploads/gallery/${finalFilename}`,
            pathname: `api/uploads/gallery/${finalFilename}`,
            size: buffer.length,
            uploadedAt: new Date()
        };
    }

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
            if (u.startsWith('/api/uploads/gallery/')) {
                // Handle external gallery path deletion
                const filename = u.split('/').pop();
                if (filename) {
                    const filePath = join(EXTERNAL_UPLOAD_DIR, filename);
                    if (existsSync(filePath)) {
                        await unlink(filePath);
                    }
                }
            } else if (u.startsWith('/uploads/')) {
                // Handle default public path deletion
                const filename = u.split('/').pop();
                if (filename) {
                    const filePath = join(DEFAULT_UPLOAD_DIR, filename);
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
