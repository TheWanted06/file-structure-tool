const fs = require('fs');
const path = require('path');

const createFilesAndFolders = (structure, parentPath) => {
  for (const key in structure) {
    const currentPath = path.join(parentPath, key);

    if (typeof structure[key] === 'object') {
      if (!fs.existsSync(currentPath)) {
        fs.mkdirSync(currentPath, { recursive: true });
      }
      createFilesAndFolders(structure[key], currentPath);
    } else {
      fs.writeFileSync(currentPath, '', 'utf8');
    }
  }
};

module.exports = { createFilesAndFolders };
