const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Add request logging for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - FRESH DEPLOYMENT`);
  next();
});

// Test route to verify API is working
app.get('/test', (req, res) => {
  res.json({ 
    message: 'API is working!', 
    timestamp: new Date().toISOString(),
    deployment: 'FRESH_DEPLOYMENT'
  });
});

// Simple landing page
app.get('/', (req, res) => {
  try {
    console.log('Serving fresh landing page');
    res.setHeader('Content-Type', 'text/html');
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OpsCheckr - DevOps Tools</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 min-h-screen">
    <div class="container mx-auto px-4 py-8">
        <div class="text-center">
            <h1 class="text-4xl font-bold text-gray-800 mb-4">
                🚀 OpsCheckr
            </h1>
            <p class="text-xl text-gray-600 mb-8">
                DevOps Tools & Utilities Platform
            </p>
            <div class="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
                <h2 class="text-2xl font-semibold text-gray-800 mb-4">
                    ✅ Fresh Deployment Successful!
                </h2>
                <p class="text-gray-600 mb-6">
                    This is a completely fresh deployment to bypass any caching issues.
                </p>
                <div class="space-y-4">
                    <a href="/test" class="block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                        Test API Endpoint
                    </a>
                    <p class="text-sm text-gray-500">
                        Click above to test the API functionality
                    </p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
    `);
  } catch (error) {
    console.error('Error serving fresh page:', error);
    res.status(500).json({ error: 'Error serving page: ' + error.message });
  }
});

// Export for Vercel
module.exports = app; 