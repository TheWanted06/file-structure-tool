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
                const level = (line.match(/^\s*/)[0].length) / 2;
                const name = line.replace(/^[│├└─\s]+/, '').trim();

                if (!name) continue;

                while (stack.length > 1 && stack[stack.length - 1].level >= level) {
                    stack.pop();
                }

                const parent = stack[stack.length - 1].node;

                if (name.endsWith('/')) {
                    const dirName = name.slice(0, -1);
                    parent[dirName] = {};
                    stack.push({ level, node: parent[dirName] });
                } else {
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
