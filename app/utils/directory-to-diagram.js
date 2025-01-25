const fs = require('fs');
const path = require('path');

const generateDiagram = (dir, prefix = '') => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let diagram = '';

    // Sort entries: directories first, then files
    const sortedEntries = entries.sort((a, b) => {
        if (a.isDirectory() && !b.isDirectory()) return -1;
        if (!a.isDirectory() && b.isDirectory()) return 1;
        return a.name.localeCompare(b.name);
    });

    sortedEntries.forEach((entry, index) => {
        const isLast = index === sortedEntries.length - 1;
        const connector = isLast ? '└── ' : '├── ';
        const verticalLine = isLast ? '    ' : '│   ';
        const entryPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            diagram += `${prefix}${connector}${entry.name}/\n`;
            diagram += generateDiagram(entryPath, prefix + verticalLine);
        } else {
            diagram += `${prefix}${connector}${entry.name}\n`;
        }
    });

    return diagram;
};

const formatDiagram = (rootDir) => {
    const rootName = path.basename(rootDir);
    return `${rootName}/\n${generateDiagram(rootDir)}`;
};

module.exports = { generateDiagram: formatDiagram };