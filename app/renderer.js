const { ipcRenderer } = require('electron');

const filePathElement = document.getElementById('file-path');
const directoryPathElement = document.getElementById('directory-path');
const statusElement = document.getElementById('status');

let diagramPath = null;
let destinationPath = null;

// Select diagram file
document.getElementById('select-file').addEventListener('click', async () => {
    diagramPath = await ipcRenderer.invoke('select-file');
    filePathElement.textContent = diagramPath || 'No file selected';
});

// Select destination directory
document.getElementById('select-directory').addEventListener('click', async () => {
    destinationPath = await ipcRenderer.invoke('select-directory');
    directoryPathElement.textContent = destinationPath || 'No directory selected';
});

// Create file structure
document.getElementById('create-structure').addEventListener('click', async () => {
    if (!diagramPath || !destinationPath) {
        statusElement.textContent = 'Please select a file and a destination directory.';
        statusElement.className = 'status error';
        return;
    }

    const result = await ipcRenderer.invoke('create-structure', {
        diagramPath,
        destination: destinationPath,
    });

    if (result.success) {
        statusElement.textContent = 'File structure created successfully!';
        statusElement.className = 'status success';
    } else {
        statusElement.textContent = `Error: ${result.message}`;
        statusElement.className = 'status error';
    }
});
