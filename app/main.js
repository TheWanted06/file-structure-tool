const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { parseDiagram } = require('./utils/parser');
const { createFileStructure } = require('./utils/file-creator');

let mainWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false,
        },
        resizable: false,
        title: 'File Structure Creator',
    });

    mainWindow.loadFile(path.join(__dirname, 'gui', 'index.html'));

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// App Events
app.whenReady().then(() => {
    createMainWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// IPC Handlers
ipcMain.handle('select-diagram', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [{ name: 'Text Files', extensions: ['txt'] }],
    });

    return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle('select-destination', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory'],
    });

    return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle('process-diagram', async (_, diagramPath, destinationPath) => {
    try {
        const structure = parseDiagram(diagramPath);
        createFileStructure(structure, destinationPath);
        return { success: true };
    } catch (error) {
        console.error('Error processing diagram:', error);
        return { success: false, error: error.message };
    }
});
