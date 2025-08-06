const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Add request logging for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Configure multer for memory storage (serverless-friendly)
const upload = multer({ 
  storage: multer.memoryStorage(),
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
  try {
    console.log('Serving index.html');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } catch (error) {
    console.error('Error serving index.html:', error);
    res.status(500).json({ error: 'Error serving index page' });
  }
});

app.get('/log-viewer', (req, res) => {
  try {
    console.log('Serving log-viewer.html');
    res.sendFile(path.join(__dirname, 'public', 'log-viewer.html'));
  } catch (error) {
    console.error('Error serving log-viewer.html:', error);
    res.status(500).json({ error: 'Error serving log viewer page' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Catch-all route for debugging
app.get('*', (req, res) => {
  console.log('404 - Route not found:', req.url);
  res.status(404).json({ error: 'Route not found', path: req.url });
});

// Upload endpoint
app.post('/upload', upload.single('logFile'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileName = req.file.originalname;
    const fileSize = req.file.size;
    const fileContent = req.file.buffer.toString('utf8');

    // Parse log content into structured format
    const logLines = parseLogContent(fileContent);
    
    res.json({
      success: true,
      fileName: fileName,
      fileSize: fileSize,
      logLines: logLines,
      totalLines: logLines.length
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Error processing file: ' + error.message });
  }
});

// Get log content endpoint (for serverless, we'll return a simple response)
app.get('/log/:filename', (req, res) => {
  res.status(404).json({ error: 'File not found - serverless environment does not support file persistence' });
});

// Parse log content into structured format
function parseLogContent(content) {
  try {
    const lines = content.split('\n').filter(line => line.trim() !== '');
    
    return lines.map((line, index) => {
      try {
        // Try to parse common log formats
        const logEntry = parseLogLine(line, index + 1);
        return logEntry;
      } catch (lineError) {
        // Fallback for any line parsing errors
        return {
          lineNumber: index + 1,
          timestamp: '',
          level: 'INFO',
          message: line,
          source: '',
          raw: line
        };
      }
    });
  } catch (error) {
    console.error('Parse content error:', error);
    return [];
  }
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
  console.error('Error details:', {
    message: error.message,
    stack: error.stack,
    name: error.name,
    url: req.url,
    method: req.method
  });

  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
  }
  
  if (error.message === 'Only .log files are allowed!') {
    return res.status(400).json({ error: error.message });
  }
  
  // Send more detailed error in development
  if (process.env.NODE_ENV !== 'production') {
    res.status(500).json({ 
      error: 'Something went wrong!',
      details: error.message,
      stack: error.stack
    });
  } else {
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// For Vercel serverless deployment
module.exports = app; 