#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

const electronPath = require('electron'); // Ensure Electron is installed globally or locally
const appPath = path.resolve(__dirname);

const args = process.argv.slice(2); // Pass CLI arguments to the Electron app

if (args.includes('--gui')) {
    console.log('Launching GUI...');
}

const child = spawn(electronPath, [appPath, ...args], {
    stdio: 'inherit',
});

child.on('exit', code => {
    process.exit(code);
});
