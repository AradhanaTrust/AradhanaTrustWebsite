/**
 * Optimized Hostinger Startup File
 * This file limits the Node.js thread pool to prevent 503 errors
 * related to 'uv_thread_create' failures on restricted hosting.
 */

// 1. Force the thread pool to minimum size (Crucial for Hostinger)
process.env.UV_THREADPOOL_SIZE = '1';

// 2. Ensure we are in production
process.env.NODE_ENV = 'production';

console.log('--- Starting Optimized Server ---');
console.log('Thread Pool Size:', process.env.UV_THREADPOOL_SIZE);

// 3. Start the Next.js standalone server
// Note: This expects you have run 'npm run build' which creates the .next/standalone folder
const path = require('path');
const serverPath = path.join(__dirname, '.next', 'standalone', 'server.js');

if (require('fs').existsSync(serverPath)) {
    require(serverPath);
} else {
    console.error('CRITICAL: .next/standalone/server.js not found!');
    console.error('Please run "npm run build" before starting the server.');
    process.exit(1);
}
