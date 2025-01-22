const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    selectDiagram: () => ipcRenderer.invoke('select-diagram'),
    selectDestination: () => ipcRenderer.invoke('select-destination'),
    processDiagram: (diagramPath, destinationPath) =>
        ipcRenderer.invoke('process-diagram', diagramPath, destinationPath),
});
