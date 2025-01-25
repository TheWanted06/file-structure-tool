# File Structure Tool

A desktop application that simplifies the creation of file structures from diagrams and vice versa. Perfect for developers who want to quickly scaffold project structures or document existing ones.

## Features

- **Dual-Mode Operation**: 
  - Create file structures from diagrams
  - Generate diagrams from existing file structures
- **Modern Interface**:
  - Intuitive GUI with dark/light theme support
  - Live preview functionality
  - System theme integration
- **Cross-Platform Support**:
  - Windows (portable & installer)
  - macOS
  - Linux
- **CLI Support**: Terminal-based operations for automation
- **File Format Support**: 
  - Reads and creates standard tree-style diagrams
  - Handles nested structures with proper indentation

## Installation

### Download

Download the latest release for your platform from the [releases page](https://github.com/TheWanted06/file-structure-tool/releases).

### Build from Source

1. Clone the repository:

```bash
git clone https://github.com/TheWanted06/file-structure-tool.git
```

2. Install dependencies:

```bash
npm install
```

3. Run the application:

```bash
npm start
```

## Usage

### GUI Mode

1. Launch the application
2. Choose between:
   - **Create Structure**: Convert a diagram to actual files/folders
   - **Create Diagram**: Generate a diagram from existing files/folders
3. Select source and destination paths
4. Click Create

### CLI Mode

Generate structure from diagram:

```bash
npm run cli
```

## Example Diagram Format

```bash
Project/
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── pages/
│   │   ├── index.tsx
│   │   └── about.tsx
│   └── styles/
│       └── main.css
└── README.md
```

## Development

### Scripts

- `npm start` - Run the application
- `npm run cli` - Run CLI version
- `npm run build` - Build for current platform
- `npm run dist` - Create distributables
- `npm test` - Run tests

### Building

Create distributables for all platforms:

```bash
npm run dist
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

ISC License - See [LICENSE](LICENSE) for details

## Author

Daniel Tshipuk

---

For bugs, questions, and discussions please use the [GitHub Issues](https://github.com/TheWanted06/file-structure-tool/issues).
