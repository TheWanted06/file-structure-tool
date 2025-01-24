const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

// Create a log file
const logFile = path.join(app.getPath('userData'), 'app.log');
const log = (message) => {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp}: ${message}\n`;
    fs.appendFileSync(logFile, logMessage);
    console.log(message);
};

// Log uncaught exceptions
process.on('uncaughtException', (error) => {
    log(`Uncaught Exception: ${error.message}`);
    log(error.stack);
});

process.on('unhandledRejection', (error) => {
    log(`Unhandled Rejection: ${error.message}`);
    log(error.stack);
});

// Get the correct app path whether in development or production
const getAppPath = () => {
    if (app.isPackaged) {
        if (process.env.PORTABLE_EXECUTABLE_DIR) {
            const portablePath = path.join(process.env.PORTABLE_EXECUTABLE_DIR, 'resources', 'app');
            log(`Using portable path: ${portablePath}`);
            return portablePath;
        }
        const resourcePath = path.join(process.resourcesPath, 'app');
        log(`Using resource path: ${resourcePath}`);
        return resourcePath;
    }
    log(`Using development path: ${__dirname}`);
    return __dirname;
};

// Get the correct path for utils
const getUtilsPath = () => {
    const basePath = getAppPath();
    const utilsPath = app.isPackaged ?
        path.join(basePath, '..', 'app.asar.unpacked', 'app', 'utils') :
        path.join(basePath, 'utils');
    log(`Utils path: ${utilsPath}`);
    return utilsPath;
};

try {
    log('Starting application...');
    log(`App version: ${app.getVersion()}`);
    log(`Electron version: ${process.versions.electron}`);
    log(`Chrome version: ${process.versions.chrome}`);
    log(`Node version: ${process.versions.node}`);
    log(`Is packaged: ${app.isPackaged}`);
    log(`Current directory: ${__dirname}`);
    log(`Resource path: ${process.resourcesPath}`);
    log(`Portable dir: ${process.env.PORTABLE_EXECUTABLE_DIR}`);

    // Dynamically import modules with correct paths
    const utilsPath = getUtilsPath();
    log(`Loading modules from: ${utilsPath}`);
    const parser = require(path.join(utilsPath, 'parser.js'));
    const fileCreator = require(path.join(utilsPath, 'file-creator.js'));

    let mainWindow;

    function createWindow() {
        log('Creating main window...');
        mainWindow = new BrowserWindow({
            width: 500,
            height: 400,
            resizable: false,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                preload: path.join(getAppPath(), 'preload.js'),
                sandbox: false
            },
        });

        const indexPath = path.join(getAppPath(), 'gui', 'index.html');
        log(`Loading index from: ${indexPath}`);

        mainWindow.loadFile(indexPath).catch(err => {
            log(`Error loading index.html: ${err.message}`);
            log(err.stack);
        });

        if (!app.isPackaged) {
            mainWindow.webContents.openDevTools();
        }

        mainWindow.on('closed', () => {
            mainWindow = null;
        });
    }

    // Handle file diagram selection
    ipcMain.handle('select-diagram', async () => {
        log('Selecting diagram file...');
        const result = await dialog.showOpenDialog(mainWindow, {
            title: 'Select File Diagram',
            filters: [{ name: 'Text Files', extensions: ['txt'] }],
            properties: ['openFile'],
        });
        log(`Dialog result: ${JSON.stringify(result)}`);
        return result.canceled ? null : result.filePaths[0];
    });

    // Handle destination directory selection
    ipcMain.handle('select-destination', async () => {
        log('Selecting destination directory...');
        const result = await dialog.showOpenDialog(mainWindow, {
            title: 'Select Destination Directory',
            properties: ['openDirectory'],
        });
        log(`Dialog result: ${JSON.stringify(result)}`);
        return result.canceled ? null : result.filePaths[0];
    });

    // Process the file diagram and create the structure
    ipcMain.handle('process-diagram', async (event, diagramPath, destinationPath) => {
        try {
            log(`Processing diagram: ${diagramPath}`);
            log(`Destination: ${destinationPath}`);

            if (!fs.existsSync(diagramPath)) {
                throw new Error('Diagram file does not exist');
            }
            if (!fs.existsSync(destinationPath)) {
                throw new Error('Destination directory does not exist');
            }

            const structure = parser.parseDiagram(diagramPath);
            log(`Parsed structure: ${JSON.stringify(structure, null, 2)}`);

            fileCreator.createStructure(structure, destinationPath);
            log('Structure created successfully');

            return { success: true };
        } catch (error) {
            log(`Error processing diagram: ${error.message}`);
            log(error.stack);
            return { success: false, error: error.message };
        }
    });

    app.whenReady().then(() => {
        log('App is ready, creating window...');
        createWindow();
    });

    app.on('window-all-closed', () => {
        log('All windows closed');
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('activate', () => {
        log('App activated');
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

} catch (error) {
    log(`Fatal error during startup: ${error.message}`);
    log(error.stack);
}
