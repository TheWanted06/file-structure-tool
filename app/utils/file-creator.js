const fs = require('fs');
const path = require('path');

const createStructure = async (structure, parentPath, progressCallback) => {
    const total = countItems(structure);
    let current = 0;

    const processWithProgress = async (item) => {
        current++;
        progressCallback?.(current / total * 100);
        // ... existing creation logic
    };

    try {
        console.log('Creating structure at:', parentPath);

        // Ensure parent directory exists
        if (!fs.existsSync(parentPath)) {
            console.log('Creating parent directory:', parentPath);
            fs.mkdirSync(parentPath, { recursive: true });
        }

        const processStructure = (struct, currentPath, depth = 0) => {
            for (const key in struct) {
                const itemPath = path.join(currentPath, key);

                if (struct[key] === null) {
                    // It's a file
                    console.log(`Creating file: ${itemPath}`);
                    fs.writeFileSync(itemPath, '', 'utf8');
                } else {
                    // It's a directory
                    console.log(`Creating directory: ${itemPath}`);
                    fs.mkdirSync(itemPath, { recursive: true });
                    processStructure(struct[key], itemPath, depth + 1);
                }
            }
        };

        processStructure(structure, parentPath);
    } catch (error) {
        console.error('Structure creation error:', error);
        throw new Error(`Failed to create structure: ${error.message}`);
    }
};

module.exports = { createStructure };
