console.log('Renderer script loaded');
console.log('electronAPI available:', !!window.electronAPI);

const modeSwitch = document.getElementById('modeSwitch');
const modeLabel = document.getElementById('modeLabel');
const fileStructureForm = document.getElementById('fileStructureForm');
const diagramForm = document.getElementById('diagramForm');

console.log('Elements found:', {
  modeSwitch: !!modeSwitch,
  modeLabel: !!modeLabel,
  fileStructureForm: !!fileStructureForm,
  diagramForm: !!diagramForm
});

// Function to toggle form visibility
function toggleForms(showDiagramForm) {
  if (showDiagramForm) {
    // Switch to Diagram Creation mode
    modeLabel.textContent = 'Diagram Creation';

    fileStructureForm.classList.remove('visible');
    fileStructureForm.classList.add('hidden');

    diagramForm.classList.remove('hidden');
    diagramForm.classList.add('visible');
  } else {
    // Switch to File Structure Creation mode
    modeLabel.textContent = 'File Structure Creation';

    diagramForm.classList.remove('visible');
    diagramForm.classList.add('hidden');

    fileStructureForm.classList.remove('hidden');
    fileStructureForm.classList.add('visible');
  }
}

// Add switch event listener
modeSwitch.addEventListener('change', (e) => {
  console.log('Switch changed:', e.target.checked);
  toggleForms(e.target.checked);
});

document.getElementById('selectDiagramFolder').addEventListener('click', async () => {
  const dirPath = await window.electronAPI.selectRepositery();
  if (dirPath) {
    document.getElementById('diagramFolderPath').value = dirPath;
    await updatePreview(dirPath, false);
  }
});
document.getElementById('selectDestination').addEventListener('click', async () => {
  const dirPath = await window.electronAPI.selectDestination();
  if (dirPath) {
    document.getElementById('destinationPath').value = dirPath;
  }
});

// Add preview functionality
const previewPanel = document.querySelector('.preview-panel');
const previewContent = document.getElementById('previewContent');

async function updatePreview(path, isStructure = true) {
  if (!path) {
    previewContent.textContent = '';
    return;
  }

  try {
    if (isStructure) {
      // When creating structure, show diagram preview
      const result = await window.electronAPI.previewStructure(path);
      if (result.success) {
        previewContent.textContent = result.content;
      }
    } else {
      // When creating diagram, show folder structure
      const result = await window.electronAPI.previewFolder(path);
      if (result.success) {
        previewContent.textContent = result.content;
      }
    }
  } catch (error) {
    console.error('Preview error:', error);
    previewContent.textContent = 'Error loading preview';
  }
}

// Update the diagram selection handler
document.getElementById('selectDiagram').addEventListener('click', async () => {
  console.log('Select diagram clicked');
  try {
    const filePath = await window.electronAPI.selectDiagram();
    console.log('Selected file:', filePath);
    if (filePath) {
      document.getElementById('diagramPath').value = filePath;
      await updatePreview(filePath);  // Add preview update
    }
  } catch (error) {
    console.error('Error selecting diagram:', error);
    showToast(`Error: ${error.message}`, 'error');
  }
});

document.getElementById('selectDiagramDestination').addEventListener('click', async () => {
  const dirPath = await window.electronAPI.selectDestination();
  if (dirPath) {
    document.getElementById('diagramDestination').value = dirPath;
  }
});

// Add these helper functions at the top
function showLoader(formId) {
  const form = document.getElementById(formId);
  const loader = form.querySelector('.loader');
  const button = form.querySelector('button:last-of-type');
  button.disabled = true;
  loader.classList.remove('hidden');
}

function hideLoader(formId) {
  const form = document.getElementById(formId);
  const loader = form.querySelector('.loader');
  const button = form.querySelector('button:last-of-type');
  button.disabled = false;
  loader.classList.add('hidden');
}

// Modify the create structure event listener
document.getElementById('createStructure').addEventListener('click', async () => {
  const diagramPath = document.getElementById('diagramPath').value;
  const destinationPath = document.getElementById('destinationPath').value;

  if (!diagramPath || !destinationPath) {
    alert('Please select both a diagram file and destination directory.');
    return;
  }

  showLoader('fileStructureForm');

  try {
    const result = await window.electronAPI.createFileStructure(diagramPath, destinationPath);

    // Add minimum delay of 1 second
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (result.success) {
      showToast('File structure created successfully!');
    } else {
      showToast(`Error: ${result.error}`, 'error');
    }
  } catch (error) {
    showToast(`Error: ${error.message}`, 'error');
  } finally {
    hideLoader('fileStructureForm');
  }
});

// Modify the create diagram event listener similarly
document.getElementById('createDiagram').addEventListener('click', async () => {
  const folderPath = document.getElementById('diagramFolderPath').value;
  const destinationPath = document.getElementById('diagramDestination').value;
  let name = document.getElementById('diagramName').value;

  if (!destinationPath) {
    alert('Please select a destination directory.');
    return;
  }

  showLoader('diagramForm');

  try {
    if (!name || name.trim() === "") {
      const base = path.basename(folderPath);
      name = base.replace(".txt", "");
    }

    const result = await window.electronAPI.createDiagram(folderPath, destinationPath, name);

    // Add minimum delay of 1 second
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (result.success) {
      showToast('Diagram created successfully!');
      await updatePreview(result.diagramPath);  // Add preview after creation
    } else {
      showToast(`Error: ${result.error}`, 'error');
    }
  } catch (error) {
    showToast(`Error: ${error.message}`, 'error');
  } finally {
    hideLoader('diagramForm');
  }
});

// Add a toast notification system instead of using alerts
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  // Animate in
  setTimeout(() => toast.classList.add('show'), 100);

  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Theme handling
const themeSlider = document.getElementById('themeSlider');

async function initializeTheme() {
  const theme = await window.electronAPI.getTheme();

  // Set initial slider position (System theme by default)
  themeSlider.value = theme.useSystemTheme ? "1" : (theme.darkMode ? "2" : "0");

  // Apply initial theme based on system preference if using system theme
  if (theme.useSystemTheme) {
    const systemTheme = await window.electronAPI.getSystemTheme();
    updateTheme(systemTheme);
  } else {
    updateTheme(theme.darkMode);
  }
}

function updateTheme(isDark) {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
}

themeSlider.addEventListener('input', async (e) => {
  const value = parseInt(e.target.value);
  let useSystemTheme = false;
  let darkMode = false;

  switch (value) {
    case 0: // Light
      useSystemTheme = false;
      darkMode = false;
      break;
    case 1: // System
      useSystemTheme = true;
      const systemTheme = await window.electronAPI.getSystemTheme();
      darkMode = systemTheme;
      break;
    case 2: // Dark
      useSystemTheme = false;
      darkMode = true;
      break;
  }

  updateTheme(darkMode);
  await window.electronAPI.setTheme({ useSystemTheme, darkMode });
});

// Listen for system theme changes
window.electronAPI.onThemeChanged((event, isDark) => {
  // Only update if system theme is selected (value === 1)
  if (themeSlider.value === "1") {
    updateTheme(isDark);
  }
});

// Initialize theme on load
initializeTheme();

// Add modal handling
const helpButton = document.getElementById('helpButton');
const helpModal = document.getElementById('helpModal');
const closeButton = helpModal.querySelector('.close');

function showModal() {
  helpModal.classList.add('show');
}

function hideModal() {
  helpModal.classList.remove('show');
}

helpButton.addEventListener('click', showModal);
closeButton.addEventListener('click', hideModal);

// Close modal when clicking outside
helpModal.addEventListener('click', (e) => {
  if (e.target === helpModal) {
    hideModal();
  }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && helpModal.classList.contains('show')) {
    hideModal();
  }
});
