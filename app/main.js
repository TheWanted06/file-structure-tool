const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const process = require('process');

let mainWindow;

app.on('ready', () => {
  const args = process.argv.slice(2);

  if (args.includes('--gui')) {
    // Start in GUI mode
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    mainWindow.loadFile('index.html');
  } else if (args.length === 2) {
    // Start in CLI mode
    const [diagramPath, destinationPath] = args;

    try {
      const diagram = fs.readFileSync(diagramPath, 'utf8');
      const structure = parseDiagram(diagram);
      createFilesAndFolders(structure, destinationPath);
      console.log(`File structure created successfully at ${destinationPath}`);
      app.quit();
    } catch (error) {
      console.error(`Error: ${error.message}`);
      app.quit();
    }
  } else {
    console.log(
      `Usage: \n` +
        `  file-structure-creator --gui              Launch GUI mode\n` +
        `  file-structure-creator <diagramPath> <destinationPath>  Run in CLI mode`
    );
    app.quit();
  }
});

// Helper functions (same as before)
function parseDiagram(diagram) {
  const lines = diagram.split('\n');
  const root = {};
  const stack = [{ level: 0, node: root }];

  for (const line of lines) {
    const match = line.match(/(├──|└──)?\s*([\w.\[\]()]+)/);
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
}

function createFilesAndFolders(structure, parentPath) {
  for (const key in structure) {
    const currentPath = path.join(parentPath, key);

    if (typeof structure[key] === 'object') {
      if (!fs.existsSync(currentPath)) {
        fs.mkdirSync(currentPath);
      }
      createFilesAndFolders(structure[key], currentPath);
    } else {
      fs.writeFileSync(currentPath, '', 'utf8');
    }
  }
}
