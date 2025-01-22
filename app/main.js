const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { parseDiagram } = require('./utils/parser');
const { createFilesAndFolders } = require('./utils/file-creator');

let mainWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile('app/index.html');
};

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// IPC Handlers
ipcMain.handle('select-diagram', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [{ name: 'Text Files', extensions: ['txt'] }],
    });
    return result.filePaths[0];
});

ipcMain.handle('select-destination', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory'],
    });
    return result.filePaths[0];
});

ipcMain.handle('process-diagram', async (_, diagramPath, destinationPath) => {
    try {
        const diagramContent = fs.readFileSync(diagramPath, 'utf8');
        const structure = parseDiagram(diagramContent);
        createFilesAndFolders(structure, destinationPath);
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: error.message };
    }
});
