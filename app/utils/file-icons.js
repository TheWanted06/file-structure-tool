const getFileIcon = (filename) => {
    const ext = path.extname(filename).toLowerCase();
    const icons = {
        '.js': '📄 ',
        '.jsx': '⚛️ ',
        '.ts': '📘 ',
        '.tsx': '⚛️ ',
        '.css': '🎨 ',
        '.html': '🌐 ',
        '.json': '📋 ',
        // Add more file types
    };
    return icons[ext] || '📄 ';
}; 