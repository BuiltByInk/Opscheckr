const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Keep original filename but add timestamp to avoid conflicts
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Only allow .log files
    if (file.mimetype === 'text/plain' || path.extname(file.originalname).toLowerCase() === '.log') {
      cb(null, true);
    } else {
      cb(new Error('Only .log files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Upload endpoint
app.post('/upload', upload.single('logFile'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;
    const fileSize = req.file.size;

    // Read the log file content
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Error reading file' });
      }

      // Parse log content into structured format
      const logLines = parseLogContent(data);
      
      res.json({
        success: true,
        fileName: fileName,
        fileSize: fileSize,
        filePath: filePath,
        logLines: logLines,
        totalLines: logLines.length
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get log content endpoint
app.get('/log/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading file' });
    }

    const logLines = parseLogContent(data);
    res.json({
      success: true,
      logLines: logLines,
      totalLines: logLines.length
    });
  });
});

// Parse log content into structured format
function parseLogContent(content) {
  const lines = content.split('\n').filter(line => line.trim() !== '');
  
  return lines.map((line, index) => {
    // Try to parse common log formats
    const logEntry = parseLogLine(line, index + 1);
    return logEntry;
  });
}

// Parse individual log line
function parseLogLine(line, lineNumber) {
  // Common log patterns
  const patterns = [
    // ISO timestamp with level: 2023-12-27T10:30:45.123Z [INFO] Message
    /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z?)\s*\[?(\w+)\]?\s*(.+)$/,
    // Simple timestamp: 2023-12-27 10:30:45 [INFO] Message
    /^(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}(?:\.\d{3})?)\s*\[?(\w+)\]?\s*(.+)$/,
    // Unix timestamp: 1703679045 [INFO] Message
    /^(\d{10,13})\s*\[?(\w+)\]?\s*(.+)$/,
    // Just level and message: [INFO] Message
    /^\[?(\w+)\]?\s*(.+)$/
  ];

  for (let i = 0; i < patterns.length; i++) {
    const pattern = patterns[i];
    const match = line.match(pattern);
    if (match) {
      let timestamp = '';
      let level = '';
      let message = '';

      // Handle different pattern types
      if (i === 3) {
        // Level-only pattern: [INFO] Message
        level = match[1];
        message = match[2];
      } else {
        // Timestamp patterns
        timestamp = match[1];
        level = match[2];
        message = match[3];
      }

      return {
        lineNumber: lineNumber,
        timestamp: timestamp || '',
        level: level || 'INFO',
        message: message || line,
        source: extractSource(line),
        raw: line
      };
    }
  }

  // Default fallback
  return {
    lineNumber: lineNumber,
    timestamp: '',
    level: 'INFO',
    message: line,
    source: extractSource(line),
    raw: line
  };
}

// Extract source/component from log line
function extractSource(line) {
  const sourcePatterns = [
    /\[([^\]]+)\]/g,
    /\(([^)]+)\)/g,
    /from\s+([^\s]+)/i,
    /at\s+([^\s]+)/i
  ];

  for (const pattern of sourcePatterns) {
    const matches = line.match(pattern);
    if (matches && matches.length > 1) {
      return matches[1];
    }
  }

  return '';
}

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
  }
  
  if (error.message === 'Only .log files are allowed!') {
    return res.status(400).json({ error: error.message });
  }
  
  console.error(error);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 