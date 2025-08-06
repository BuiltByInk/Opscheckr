# Log File Viewer

A modern Node.js application with Tailwind CSS that allows users to upload and view .log files in a structured, searchable format.

## Features

- 📁 **File Upload**: Drag and drop or click to upload .log files
- 🔍 **Search & Filter**: Search through log content and filter by log levels
- 📊 **Structured View**: Automatically parses common log formats and displays in a table
- 📥 **Export**: Export filtered results to CSV format
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- ⚡ **Real-time**: Instant search and filtering without page reloads

## Installation

1. Navigate to the project directory:
   ```bash
   cd log-viewer-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

1. Start the server:
   ```bash
   npm start
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

3. Upload a .log file by either:
   - Dragging and dropping the file onto the upload area
   - Clicking "Choose File" and selecting a .log file

4. Once uploaded, you can:
   - View the parsed log entries in a structured table
   - Search through the log content using the search box
   - Filter by log levels (ERROR, WARN, INFO, DEBUG, SUCCESS)
   - Export the filtered results to CSV

## Supported Log Formats

The application automatically detects and parses common log formats:

- ISO timestamps: `2023-12-27T10:30:45.123Z [INFO] Message`
- Simple timestamps: `2023-12-27 10:30:45 [INFO] Message`
- Unix timestamps: `1703679045 [INFO] Message`
- Level-only: `[INFO] Message`

## File Size Limits

- Maximum file size: 10MB
- Supported file types: .log files and text files

## Project Structure

```
log-viewer-app/
├── server.js          # Express server with file upload handling
├── public/
│   ├── index.html     # Main application interface
│   └── script.js      # Frontend JavaScript functionality
├── uploads/           # Directory for uploaded files
├── package.json       # Project dependencies and scripts
└── README.md         # This file
```

## Development

To run in development mode with auto-restart:

```bash
npm install -g nodemon  # Install nodemon globally if not already installed
npm run dev
```

## Technologies Used

- **Backend**: Node.js, Express.js, Multer
- **Frontend**: HTML5, JavaScript (ES6+), Tailwind CSS
- **File Handling**: Multer for file uploads
- **Styling**: Tailwind CSS for responsive design

## License

ISC License 