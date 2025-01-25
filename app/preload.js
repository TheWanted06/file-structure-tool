const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    selectDiagram: () => ipcRenderer.invoke('select-diagram'),
    selectDestination: () => ipcRenderer.invoke('select-destination'),
    selectRepositery: () => ipcRenderer.invoke('select-repositery'),
    createFileStructure: (diagramPath, destinationPath) =>
        ipcRenderer.invoke('createFileStructure', diagramPath, destinationPath),
    createDiagram: (sourcePath, destinationPath, name) =>
        ipcRenderer.invoke('createDiagram', sourcePath, destinationPath, name),
    previewStructure: (diagramPath) =>
        ipcRenderer.invoke('preview-structure', diagramPath),
    getTheme: () => ipcRenderer.invoke('get-theme'),
    setTheme: (theme) => ipcRenderer.invoke('set-theme', theme),
    onThemeChanged: (callback) => ipcRenderer.on('theme-changed', callback),
    previewFolder: (folderPath) => ipcRenderer.invoke('previewFolder', folderPath),
    getSystemTheme: () => ipcRenderer.invoke('getSystemTheme'),
});
