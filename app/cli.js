#!/usr/bin/env node

const { parseDiagram } = require('./utils/parser');
const { createStructure } = require('./utils/file-creator');
const { generateDiagram } = require('./utils/directory-to-diagram');
const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');
const ora = require('ora');

(async () => {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Choose an action:',
      choices: ['Create structure from diagram', 'Generate diagram from directory'],
    },
  ]);

  if (action === 'Create structure from diagram') {
    const { diagramPath, destination } = await inquirer.prompt([
      { type: 'input', name: 'diagramPath', message: 'Path to file diagram:' },
      { type: 'input', name: 'destination', message: 'Destination directory:' },
    ]);

    const spinner = ora('Creating file structure...').start();

    try {
      const diagram = parseDiagram(diagramPath);
      await createStructure(diagram, destination);

      // Add minimum delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      spinner.succeed('Structure created successfully!');
    } catch (error) {
      spinner.fail(`Error: ${error.message}`);
    }
  } else {
    const { sourceDir, destination, name } = await inquirer.prompt([
      { type: 'input', name: 'sourceDir', message: 'Source directory to create diagram from:' },
      { type: 'input', name: 'destination', message: 'Destination directory for the diagram:' },
      { type: 'input', name: 'name', message: 'Name for the diagram file (without .txt):' }
    ]);

    const spinner = ora('Generating diagram...').start();

    try {
      const diagram = generateDiagram(sourceDir);
      const outputFile = path.join(destination, `${name}.txt`);
      fs.writeFileSync(outputFile, diagram, 'utf8');

      // Add minimum delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      spinner.succeed('Diagram generated successfully!');
    } catch (error) {
      spinner.fail(`Error: ${error.message}`);
    }
  }
})();
