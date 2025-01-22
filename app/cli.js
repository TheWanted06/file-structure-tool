#!/usr/bin/env node

const inquirer = require('inquirer');
const fs = require('fs');
const { parseDiagram } = require('../utils/parser');
const { createFilesAndFolders } = require('../utils/file-creator');

async function runCLI() {
  try {
    const { diagramPath } = await inquirer.prompt([
      {
        type: 'input',
        name: 'diagramPath',
        message: 'Enter the path to the file structure diagram:',
        validate: (input) => fs.existsSync(input) || 'File not found. Please enter a valid path.',
      },
    ]);

    const { destinationPath } = await inquirer.prompt([
      {
        type: 'input',
        name: 'destinationPath',
        message: 'Enter the destination directory:',
        validate: (input) => fs.existsSync(input) || 'Directory not found. Please enter a valid path.',
      },
    ]);

    const diagramContent = fs.readFileSync(diagramPath, 'utf8');
    const structure = parseDiagram(diagramContent);
    createFilesAndFolders(structure, destinationPath);

    console.log('File structure created successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

runCLI();
