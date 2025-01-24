const fs = require('fs');
const path = require('path');

const createStructure = (structure, parentPath) => {
    try {
        console.log('Creating structure at:', parentPath);

        // Ensure parent directory exists
        if (!fs.existsSync(parentPath)) {
            console.log('Creating parent directory:', parentPath);
            fs.mkdirSync(parentPath, { recursive: true });
        }

        for (const key in structure) {
            const currentPath = path.join(parentPath, key);
            console.log('Processing:', currentPath);

            try {
                if (typeof structure[key] === 'object') {
                    // Create directory
                    if (!fs.existsSync(currentPath)) {
                        console.log('Creating directory:', currentPath);
                        fs.mkdirSync(currentPath, { recursive: true });
                    }
                    createStructure(structure[key], currentPath);
                } else {
                    // Create file
                    console.log('Creating file:', currentPath);
                    fs.writeFileSync(currentPath, '', 'utf8');
                }
            } catch (itemError) {
                console.error(`Error processing ${currentPath}:`, itemError);
                throw itemError;
            }
        }
    } catch (error) {
        console.error('Structure creation error:', error);
        throw new Error(`Failed to create structure: ${error.message}`);
    }
};

module.exports = { createStructure };
