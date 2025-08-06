// Test script to verify log parsing
const fs = require('fs');

// Copy the parsing functions from server.js
function parseLogContent(content) {
  const lines = content.split('\n').filter(line => line.trim() !== '');
  
  return lines.map((line, index) => {
    const logEntry = parseLogLine(line, index + 1);
    return logEntry;
  });
}

function parseLogLine(line, lineNumber) {
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

// Test the parsing
const testLogs = [
  '2023-12-27T10:30:45.123Z [INFO] Application started successfully',
  '2023-12-27 10:31:15 [INFO] Processing request from client 192.168.1.100',
  '1703679045 [INFO] System health check passed',
  '[INFO] Simple log message without timestamp',
  '[ERROR] Error occurred in application',
  '2023-12-27T10:30:49.345Z [INFO] User authentication successful [UserService]'
];

console.log('Testing log parsing...\n');

testLogs.forEach((logLine, index) => {
  const result = parseLogLine(logLine, index + 1);
  console.log(`Test ${index + 1}:`);
  console.log(`  Original: ${logLine}`);
  console.log(`  Timestamp: "${result.timestamp}"`);
  console.log(`  Level: "${result.level}"`);
  console.log(`  Message: "${result.message}"`);
  console.log(`  Source: "${result.source}"`);
  console.log('');
}); 