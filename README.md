# File Structure Creator

The File Structure Creator is a versatile application designed to generate files and folders based on a file structure diagram. It offers a GUI for easy use and a CLI for terminal-based operations, making it suitable for both casual and advanced users.

## Features

- **Parse File Structure Diagrams**: Reads diagrams to create complex file and folder structures.
- **GUI and CLI Support**: Runs as a standalone GUI application or via the terminal.
- **Custom Destination Selection**: Allows users to choose where the files and folders are created.
- **Cross-Platform**: Compatible with Windows, macOS, and Linux.

## File Structure

```plaintext
file-structure-creator/
├── app/
│   ├── main.js              # Electron GUI entry point
│   ├── cli.js               # Terminal-based entry point
│   ├── index.html           # GUI layout
│   ├── renderer.js          # GUI renderer process logic
│   ├── styles.css           # GUI styles
├── utils/
│   ├── parser.js            # Shared: Parses file structure diagrams
│   ├── file-creator.js      # Shared: Creates files and folders
├── dist/                    # Built Electron executables
├── package.json             # npm metadata
├── README.md                # App documentation
├── .gitignore               # Git ignore file
├── diagram-examples/        # Example diagrams
│   ├── example1.txt         
│   ├── example2.txt
├── node_modules/            # Dependencies
```

## Installation

1. Clone the repository:

```bash
   git clone (https://github.com/TheWanted/file-structure-creator.git)
```

2. Install dependencies:

```bash
    npm install
```

## Usage

### GUI Mode

Run the application with the GUI:

```bash
    npm start --gui
```

### CLI Mode

Provide a diagram file and destination directory

```bash
    npm start -- <diagram-file-path> <destination-path>
```

Example:

```bash
    npm start -- ~/diagram.txt ~/output
```

### Packaging the App

To create an executable:

```bash
    npm run package
```

## Example Diagram

```plaintext
Client/
├── app/
│   ├── index.html
│   ├── styles.css
│   ├── app.js
├── components/
│   ├── Header.js
│   ├── Footer.js
└── README.md
```

## License

MIT

---
