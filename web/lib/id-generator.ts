
export function generateStandardId(prefix: 'REG' | 'RCT'): string {
    const date = new Date();
    const dateStr = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
    const randomStr = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

    return `${prefix}-${dateStr}-${randomStr}`;
}
