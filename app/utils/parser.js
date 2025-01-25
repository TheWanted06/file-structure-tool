const fs = require('fs');

const parseDiagram = (filePath) => {
    try {
        // Read and validate file content
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }

        const content = fs.readFileSync(filePath, 'utf8');
        if (!content.trim()) {
            throw new Error('Diagram file is empty');
        }

        const lines = content.split('\n')
            .map(line => line.trim())
            .filter(line => line);

        const root = {};
        const stack = [{ level: -1, node: root }];

        for (const line of lines) {
            try {
                // Calculate depth based on tree characters
                const indent = line.match(/^[│ ├└─\s]*/)[0];
                const level = (indent.length) / 2;

                // Clean the name from tree characters
                const name = line.replace(/^[│├└─\s]+/, '').trim();

                if (!name) continue;

                // Adjust the stack to the current level
                while (stack.length > 1 && stack[stack.length - 1].level >= level) {
                    stack.pop();
                }

                const parent = stack[stack.length - 1].node;

                if (!name.includes('.')) {
                    // It's a directory
                    parent[name] = {};
                    stack.push({ level, node: parent[name] });
                } else {
                    // It's a file
                    parent[name] = null;
                }
            } catch (lineError) {
                console.error(`Error processing line: "${line}"`, lineError);
                continue;
            }
        }

        return root;
    } catch (error) {
        console.error('Parser error:', error);
        throw new Error(`Failed to parse diagram: ${error.message}`);
    }
};

module.exports = { parseDiagram };
