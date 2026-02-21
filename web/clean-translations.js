const fs = require('fs');
let code = fs.readFileSync('lib/translations.ts', 'utf8');

function removeKey(str, keyStr) {
    let startIdx = str.indexOf(keyStr);
    if (startIdx === -1) return str;
    let braceCount = 0;
    let i = startIdx + keyStr.length;
    let inString = false;
    let escape = false;

    // find first {
    while (i < str.length && str[i] !== '{') i++;
    braceCount = 1;
    i++;

    while (i < str.length && braceCount > 0) {
        if (escape) {
            escape = false;
        } else if (str[i] === '\\') {
            escape = true;
        } else if (str[i] === '"' || str[i] === "'") {
            if (!inString) inString = str[i];
            else if (inString === str[i]) inString = false;
        } else if (!inString) {
            if (str[i] === '{') braceCount++;
            if (str[i] === '}') braceCount--;
        }
        i++;
    }

    // include trailing comma if any
    let endIdx = i;
    while (endIdx < str.length && /\s/.test(str[endIdx])) endIdx++;
    if (str[endIdx] === ',') endIdx++;

    // Remove preceding whitespace, but keep it clean
    let s = startIdx - 1;
    while (s >= 0 && (str[s] === ' ' || str[s] === '\t')) s--;

    return str.substring(0, s + 1) + str.substring(endIdx);
}

// First, reset the file using git checkout because the previous regex messed it up slightly
require('child_process').execSync('git checkout -- lib/translations.ts');

// Read fresh file
code = fs.readFileSync('lib/translations.ts', 'utf8');

// Remove both instances
code = removeKey(code, 'eventContent:');
code = removeKey(code, 'eventContent:');

fs.writeFileSync('lib/translations.ts', code, 'utf8');
console.log("Cleanup complete");
