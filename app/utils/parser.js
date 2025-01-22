const parseDiagram = (diagram) => {
    const lines = diagram.split('\n');
    const root = {};
    const stack = [{ level: 0, node: root }];

    for (const line of lines) {
        const match = line.match(/(├──|└──)?\s*([\w.\[\]()/]+)/);
        if (!match) continue;

        const [_, prefix, name] = match;
        const level = line.search(/\S/) / 4; // Each indent level is 4 spaces
        const parent = stack.find(item => item.level === level - 1)?.node;

        if (parent) {
            if (name.endsWith('/')) {
                const folder = {};
                parent[name.slice(0, -1)] = folder;
                stack.push({ level, node: folder });
            } else {
                parent[name] = '';
            }
        }
    }

    return root;
};

module.exports = { parseDiagram };
