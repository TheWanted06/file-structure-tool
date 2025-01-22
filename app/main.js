const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const parser = require('./utils/parser');
const fileCreator = require('./utils/file-creator');

// Keep a reference to the window to prevent garbage collection
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Secure communication bridge
        },
    });

    // Load the GUI interface
    mainWindow.loadFile(path.join(__dirname, 'gui', 'index.html'));

    // Optional: Open dev tools in development
    if (!app.isPackaged) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Handle file diagram selection
ipcMain.handle('select-diagram', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        title: 'Select File Diagram',
        filters: [{ name: 'Text Files', extensions: ['txt'] }],
        properties: ['openFile'],
    });

    return result.canceled ? null : result.filePaths[0];
});

// Handle destination directory selection
ipcMain.handle('select-destination', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        title: 'Select Destination Directory',
        properties: ['openDirectory'],
    });

    return result.canceled ? null : result.filePaths[0];
});

// Process the file diagram and create the structure
ipcMain.handle('process-diagram', async (event, diagramPath, destinationPath) => {
    try {
        const structure = parser.parseDiagram(diagramPath);
        fileCreator.createStructure(structure, destinationPath);
        return { success: true };
    } catch (error) {
        console.error('Error processing diagram:', error);
        return { success: false, error: error.message };
    }
});

// Electron app lifecycle
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
