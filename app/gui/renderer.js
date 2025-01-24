document.getElementById('selectDiagram').addEventListener('click', async () => {
  const filePath = await window.electronAPI.selectDiagram();
  if (filePath) {
    document.getElementById('diagramPath').value = filePath;
  }
});

document.getElementById('selectDestination').addEventListener('click', async () => {
  const dirPath = await window.electronAPI.selectDestination();
  if (dirPath) {
    document.getElementById('destinationPath').value = dirPath;
  }
});

document.getElementById('createStructure').addEventListener('click', async () => {
  const diagramPath = document.getElementById('diagramPath').value;
  const destinationPath = document.getElementById('destinationPath').value;

  if (!diagramPath || !destinationPath) {
    alert('Please select both a diagram file and destination directory.');
    return;
  }

  const result = await window.electronAPI.processDiagram(diagramPath, destinationPath);
  if (result.success) {
    alert('File structure created successfully!');
  } else {
    alert(`Error: ${result.error}`);
  }
});
