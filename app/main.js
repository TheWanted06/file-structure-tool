const { app, BrowserWindow, ipcMain, dialog, globalShortcut, nativeTheme } = require('electron');
const path = require('path');
const fs = require('fs-extra');
const { generateDiagram } = require('./utils/directory-to-diagram');
const Store = require('electron-store');
const store = new Store();

let mainWindow;

// Add theme handling
function handleThemeChange() {
    const isDark = nativeTheme.shouldUseDarkColors;
    mainWindow?.webContents.send('theme-changed', isDark);

    // Update theme if using system theme
    const settings = store.get('settings', {});
    if (settings.useSystemTheme) {
        store.set('settings.darkMode', isDark);
    }
}

app.on('ready', () => {
    // Initialize with system theme
    const settings = store.get('settings', {
        useSystemTheme: true,
        darkMode: nativeTheme.shouldUseDarkColors
    });

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    mainWindow.loadFile(path.join(__dirname, 'gui', 'index.html'));

    // Listen for system theme changes
    nativeTheme.on('updated', handleThemeChange);

    // Add shortcuts
    globalShortcut.register('CommandOrControl+O', () => {
        mainWindow.webContents.send('trigger-open');
    });

    globalShortcut.register('CommandOrControl+S', () => {
        mainWindow.webContents.send('trigger-save');
    });
});

ipcMain.handle('select-diagram', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        title: 'Select File Diagram',
        properties: ['openFile'],
        filters: [{ name: 'Text Files', extensions: ['txt'] }],
    });

    return canceled ? null : filePaths[0];
});

ipcMain.handle('select-destination', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory'],
    });

    return canceled ? null : filePaths[0];
});

ipcMain.handle('select-repositery', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory'],
    });

    return canceled ? null : filePaths[0];
});

ipcMain.handle('createFileStructure', async (event, diagramPath, destinationPath) => {
    try {
        const structure = fs.readFileSync(diagramPath, 'utf8');
        const lines = structure.split('\n');

        // Keep track of the current path depth
        const pathStack = [destinationPath];

        for (const line of lines) {
            if (!line.trim()) continue;

            // Calculate depth based on the number of leading spaces/tree characters
            const depth = (line.match(/^[│ ├└─\s]*/)[0].length) / 2;

            // Clean the name from tree characters
            const name = line.replace(/^[│├└─\s]+/, '').trim();
            if (!name) continue;

            // Adjust the path stack to match current depth
            while (pathStack.length > depth + 1) {
                pathStack.pop();
            }

            const fullPath = path.join(pathStack[pathStack.length - 1], name);

            if (name.includes('.')) {
                // It's a file
                fs.ensureFileSync(fullPath);
            } else {
                // It's a directory
                fs.ensureDirSync(fullPath);
                pathStack.push(fullPath);
            }
        }

        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('createDiagram', async (event, sourcePath, destinationPath, Name) => {
    try {
        // Generate the structure starting from the source path
        const fileStructure = generateDiagram(sourcePath);  // This will now include the root folder name

        // Ensure the name has .txt extension
        const fileName = Name.endsWith('.txt') ? Name : `${Name}.txt`;
        const diagramPath = path.join(destinationPath, fileName);

        // Ensure destination directory exists
        fs.ensureDirSync(destinationPath);

        // Save the diagram
        fs.writeFileSync(diagramPath, fileStructure);

        return { success: true, diagramPath };
    } catch (error) {
        console.error(error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('preview-structure', async (event, diagramPath) => {
    try {
        const content = fs.readFileSync(diagramPath, 'utf8');
        return { success: true, content };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('get-recent', async () => {
    return store.get('recentFiles', []);
});

ipcMain.handle('add-recent', async (event, filePath) => {
    let recent = store.get('recentFiles', []);
    recent = [filePath, ...recent.filter(f => f !== filePath)].slice(0, 5);
    store.set('recentFiles', recent);
    return recent;
});

// Add settings handler
ipcMain.handle('get-settings', async () => {
    return store.get('settings', {
        darkMode: false,
        autoPreview: true,
        saveLocation: app.getPath('documents')
    });
});

ipcMain.handle('save-settings', async (event, settings) => {
    store.set('settings', settings);
    return { success: true };
});

// Add theme IPC handlers
ipcMain.handle('get-theme', () => {
    return {
        useSystemTheme: store.get('settings.useSystemTheme', true),
        darkMode: store.get('settings.darkMode', nativeTheme.shouldUseDarkColors)
    };
});

ipcMain.handle('set-theme', (event, { useSystemTheme, darkMode }) => {
    store.set('settings.useSystemTheme', useSystemTheme);
    store.set('settings.darkMode', darkMode);
    return { success: true };
});

// Add this handler
ipcMain.handle('previewFolder', async (event, folderPath) => {
    try {
        const structure = generateDiagram(folderPath);
        return { success: true, content: structure };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Add new IPC handler for system theme
ipcMain.handle('getSystemTheme', () => {
    return nativeTheme.shouldUseDarkColors;
});
