const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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
    res.setHeader('Content-Type', 'text/html');
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OpsCheckr - DevOps Tools & Utilities</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        .gradient-bg {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .tool-card {
            transition: all 0.3s ease;
        }
        .tool-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .coming-soon {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
    </style>
</head>
<body class="bg-gray-50 min-h-screen">
    <!-- Navigation -->
    <nav class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <div class="flex-shrink-0 flex items-center">
                        <i class="fas fa-tools text-2xl text-blue-600 mr-2"></i>
                        <span class="text-xl font-bold text-gray-900">OpsCheckr</span>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <a href="#tools" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Tools</a>
                    <a href="#about" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">About</a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <div class="gradient-bg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div class="text-center">
                <h1 class="text-4xl md:text-6xl font-bold text-white mb-6">
                    DevOps Tools & Utilities
                </h1>
                <p class="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                    Streamline your operations with our collection of powerful DevOps tools. 
                    From log analysis to system monitoring, we've got you covered.
                </p>
                <a href="#tools" class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Explore Tools
                </a>
            </div>
        </div>
    </div>

    <!-- Tools Section -->
    <div id="tools" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Our Tools</h2>
            <p class="text-gray-600 max-w-2xl mx-auto">
                Professional-grade utilities designed to make your DevOps workflow more efficient and productive.
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Log Visualizer Tool -->
            <div class="tool-card bg-white rounded-lg shadow-lg overflow-hidden">
                <div class="p-6">
                    <div class="flex items-center mb-4">
                        <div class="bg-blue-100 p-3 rounded-lg">
                            <i class="fas fa-file-alt text-blue-600 text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <h3 class="text-lg font-semibold text-gray-900">Log Visualizer</h3>
                            <span class="text-sm text-green-600 font-medium">Available</span>
                        </div>
                    </div>
                    <p class="text-gray-600 mb-4">
                        Upload and analyze log files with advanced filtering, search capabilities, and error highlighting. 
                        Export results to CSV for further analysis.
                    </p>
                    <div class="flex flex-wrap gap-2 mb-4">
                        <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Log Analysis</span>
                        <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Error Detection</span>
                        <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">CSV Export</span>
                    </div>
                    <a href="/log-viewer" class="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                        Launch Tool
                    </a>
                </div>
            </div>

            <!-- System Monitor Tool (Coming Soon) -->
            <div class="tool-card bg-white rounded-lg shadow-lg overflow-hidden">
                <div class="p-6">
                    <div class="flex items-center mb-4">
                        <div class="bg-purple-100 p-3 rounded-lg">
                            <i class="fas fa-server text-purple-600 text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <h3 class="text-lg font-semibold text-gray-900">System Monitor</h3>
                            <span class="text-sm text-purple-600 font-medium">Coming Soon</span>
                        </div>
                    </div>
                    <p class="text-gray-600 mb-4">
                        Real-time system monitoring with performance metrics, resource usage tracking, and alert notifications.
                    </p>
                    <div class="flex flex-wrap gap-2 mb-4">
                        <span class="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Real-time</span>
                        <span class="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Metrics</span>
                        <span class="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Alerts</span>
                    </div>
                    <button class="block w-full bg-gray-300 text-gray-600 text-center py-2 px-4 rounded-lg cursor-not-allowed">
                        Coming Soon
                    </button>
                </div>
            </div>

            <!-- Network Monitor Tool (Coming Soon) -->
            <div class="tool-card bg-white rounded-lg shadow-lg overflow-hidden">
                <div class="p-6">
                    <div class="flex items-center mb-4">
                        <div class="bg-green-100 p-3 rounded-lg">
                            <i class="fas fa-network-wired text-green-600 text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <h3 class="text-lg font-semibold text-gray-900">Network Monitor</h3>
                            <span class="text-sm text-green-600 font-medium">Coming Soon</span>
                        </div>
                    </div>
                    <p class="text-gray-600 mb-4">
                        Monitor network performance, bandwidth usage, and connection status across your infrastructure.
                    </p>
                    <div class="flex flex-wrap gap-2 mb-4">
                        <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Network</span>
                        <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Bandwidth</span>
                        <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Performance</span>
                    </div>
                    <button class="block w-full bg-gray-300 text-gray-600 text-center py-2 px-4 rounded-lg cursor-not-allowed">
                        Coming Soon
                    </button>
                </div>
            </div>

            <!-- Config Validator Tool (Coming Soon) -->
            <div class="tool-card bg-white rounded-lg shadow-lg overflow-hidden">
                <div class="p-6">
                    <div class="flex items-center mb-4">
                        <div class="bg-yellow-100 p-3 rounded-lg">
                            <i class="fas fa-cog text-yellow-600 text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <h3 class="text-lg font-semibold text-gray-900">Config Validator</h3>
                            <span class="text-sm text-yellow-600 font-medium">Coming Soon</span>
                        </div>
                    </div>
                    <p class="text-gray-600 mb-4">
                        Validate configuration files for syntax errors, security issues, and best practice compliance.
                    </p>
                    <div class="flex flex-wrap gap-2 mb-4">
                        <span class="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Validation</span>
                        <span class="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Security</span>
                        <span class="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Compliance</span>
                    </div>
                    <button class="block w-full bg-gray-300 text-gray-600 text-center py-2 px-4 rounded-lg cursor-not-allowed">
                        Coming Soon
                    </button>
                </div>
            </div>

            <!-- Deployment Tracker Tool (Coming Soon) -->
            <div class="tool-card bg-white rounded-lg shadow-lg overflow-hidden">
                <div class="p-6">
                    <div class="flex items-center mb-4">
                        <div class="bg-red-100 p-3 rounded-lg">
                            <i class="fas fa-rocket text-red-600 text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <h3 class="text-lg font-semibold text-gray-900">Deployment Tracker</h3>
                            <span class="text-sm text-red-600 font-medium">Coming Soon</span>
                        </div>
                    </div>
                    <p class="text-gray-600 mb-4">
                        Track deployment status, rollback capabilities, and deployment history across environments.
                    </p>
                    <div class="flex flex-wrap gap-2 mb-4">
                        <span class="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Tracking</span>
                        <span class="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Rollback</span>
                        <span class="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">History</span>
                    </div>
                    <button class="block w-full bg-gray-300 text-gray-600 text-center py-2 px-4 rounded-lg cursor-not-allowed">
                        Coming Soon
                    </button>
                </div>
            </div>

            <!-- Resource Monitor Tool (Coming Soon) -->
            <div class="tool-card bg-white rounded-lg shadow-lg overflow-hidden">
                <div class="p-6">
                    <div class="flex items-center mb-4">
                        <div class="bg-indigo-100 p-3 rounded-lg">
                            <i class="fas fa-chart-line text-indigo-600 text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <h3 class="text-lg font-semibold text-gray-900">Resource Monitor</h3>
                            <span class="text-sm text-indigo-600 font-medium">Coming Soon</span>
                        </div>
                    </div>
                    <p class="text-gray-600 mb-4">
                        Monitor CPU, memory, disk usage, and other system resources with detailed analytics.
                    </p>
                    <div class="flex flex-wrap gap-2 mb-4">
                        <span class="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">CPU</span>
                        <span class="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">Memory</span>
                        <span class="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">Disk</span>
                    </div>
                    <button class="block w-full bg-gray-300 text-gray-600 text-center py-2 px-4 rounded-lg cursor-not-allowed">
                        Coming Soon
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- About Section -->
    <div id="about" class="bg-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <h2 class="text-3xl font-bold text-gray-900 mb-8">About OpsCheckr</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="text-center">
                        <div class="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                            <i class="fas fa-bolt text-blue-600 text-xl"></i>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Fast & Efficient</h3>
                        <p class="text-gray-600">Optimized tools that deliver results quickly without compromising on quality.</p>
                    </div>
                    <div class="text-center">
                        <div class="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                            <i class="fas fa-shield-alt text-green-600 text-xl"></i>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Secure & Reliable</h3>
                        <p class="text-gray-600">Built with security in mind, ensuring your data and operations remain protected.</p>
                    </div>
                    <div class="text-center">
                        <div class="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                            <i class="fas fa-users text-purple-600 text-xl"></i>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Team Friendly</h3>
                        <p class="text-gray-600">Designed for collaboration with intuitive interfaces and comprehensive documentation.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <div class="flex items-center justify-center mb-4">
                    <i class="fas fa-tools text-2xl text-blue-400 mr-2"></i>
                    <span class="text-xl font-bold">OpsCheckr</span>
                </div>
                <p class="text-gray-300 mb-4">
                    Empowering DevOps teams with professional-grade tools and utilities.
                </p>
                <div class="flex justify-center space-x-6">
                    <a href="#" class="text-gray-300 hover:text-white">
                        <i class="fab fa-github text-xl"></i>
                    </a>
                    <a href="#" class="text-gray-300 hover:text-white">
                        <i class="fab fa-twitter text-xl"></i>
                    </a>
                    <a href="#" class="text-gray-300 hover:text-white">
                        <i class="fab fa-linkedin text-xl"></i>
                    </a>
                </div>
            </div>
        </div>
    </footer>
</body>
</html>
    `);
  } catch (error) {
    console.error('Error serving index.html:', error);
    res.status(500).json({ error: 'Error serving index page: ' + error.message });
  }
});

app.get('/log-viewer', (req, res) => {
  try {
    console.log('Serving log-viewer.html');
    res.setHeader('Content-Type', 'text/html');
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Log Visualizer - OpsCheckr</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        .log-level-ERROR { @apply bg-red-100 text-red-800 border-red-200; }
        .log-level-WARN { @apply bg-yellow-100 text-yellow-800 border-yellow-200; }
        .log-level-INFO { @apply bg-blue-100 text-blue-800 border-blue-200; }
        .log-level-DEBUG { @apply bg-gray-100 text-gray-800 border-gray-200; }
        .log-level-SUCCESS { @apply bg-green-100 text-green-800 border-green-200; }
        
        /* Highlight error messages in red */
        .error-message { @apply text-red-700 font-semibold; }
        .error-row { @apply bg-red-50 border-l-4 border-red-400; }
    </style>
</head>
<body class="bg-gray-50 min-h-screen">
    <!-- Navigation -->
    <nav class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <div class="flex-shrink-0 flex items-center">
                        <a href="/" class="flex items-center">
                            <i class="fas fa-tools text-2xl text-blue-600 mr-2"></i>
                            <span class="text-xl font-bold text-gray-900">OpsCheckr</span>
                        </a>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <a href="/" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                        <i class="fas fa-arrow-left mr-1"></i> Back to Tools
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <div class="container mx-auto px-4 py-8">
        <!-- Header -->
        <header class="text-center mb-8">
            <h1 class="text-4xl font-bold text-gray-800 mb-2">
                <i class="fas fa-file-alt text-blue-600"></i> Log Visualizer
            </h1>
            <p class="text-gray-600">Upload your .log file to view its contents in a structured format with advanced filtering and error highlighting</p>
        </header>

        <!-- Upload Section -->
        <div class="max-w-2xl mx-auto mb-8">
            <div class="bg-white rounded-lg shadow-lg p-8 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors" 
                 id="uploadArea">
                <div class="text-center">
                    <i class="fas fa-cloud-upload-alt text-6xl text-gray-400 mb-4"></i>
                    <h3 class="text-xl font-semibold text-gray-700 mb-2">Upload Log File</h3>
                    <p class="text-gray-500 mb-6">Drag and drop your .log file here or click to browse</p>
                    <input type="file" id="fileInput" accept=".log" class="hidden">
                    <button class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors" 
                            onclick="document.getElementById('fileInput').click()">
                        <i class="fas fa-folder-open mr-2"></i> Choose File
                    </button>
                </div>
            </div>
        </div>

        <!-- File Info -->
        <div class="max-w-4xl mx-auto mb-6" id="fileInfo" style="display: none;">
            <div class="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <i class="fas fa-file-alt text-blue-600 text-xl"></i>
                    <div>
                        <span id="fileName" class="font-semibold text-gray-800"></span>
                        <span id="fileSize" class="text-gray-500 ml-2"></span>
                    </div>
                </div>
                <button class="text-red-600 hover:text-red-800 font-semibold" onclick="clearFile()">
                    <i class="fas fa-times mr-1"></i> Clear
                </button>
            </div>
        </div>

        <!-- Log Viewer -->
        <div class="max-w-6xl mx-auto" id="logViewer" style="display: none;">
            <!-- Controls -->
            <div class="bg-white rounded-lg shadow-md p-4 mb-4">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    <h2 class="text-xl font-semibold text-gray-800">Log Contents</h2>
                    <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                        <div class="relative">
                            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <input type="text" id="searchInput" placeholder="Search in logs..." 
                                   class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                        <select id="levelFilter" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="">All Levels</option>
                            <option value="ERROR">ERROR</option>
                            <option value="WARN">WARN</option>
                            <option value="INFO">INFO</option>
                            <option value="DEBUG">DEBUG</option>
                            <option value="SUCCESS">SUCCESS</option>
                        </select>
                        <button onclick="exportToCSV()" class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                            <i class="fas fa-download mr-2"></i> Export CSV
                        </button>
                    </div>
                </div>
            </div>

            <!-- Log Table -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Line #</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                            </tr>
                        </thead>
                        <tbody id="logTableBody" class="bg-white divide-y divide-gray-200">
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Pagination Info -->
            <div class="mt-4 text-center text-gray-600">
                <span id="paginationInfo">Showing 0 of 0 entries</span>
            </div>
        </div>

        <!-- Loading Spinner -->
        <div id="loadingSpinner" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-6 flex items-center space-x-3">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span class="text-gray-700">Processing log file...</span>
            </div>
        </div>
    </div>

    <script>
        // JavaScript functionality will be added here
        let logData = [];
        let filteredLogData = [];

        // File upload handling
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const fileInfo = document.getElementById('fileInfo');
        const fileName = document.getElementById('fileName');
        const fileSize = document.getElementById('fileSize');
        const logViewer = document.getElementById('logViewer');
        const logTableBody = document.getElementById('logTableBody');
        const searchInput = document.getElementById('searchInput');
        const levelFilter = document.getElementById('levelFilter');
        const paginationInfo = document.getElementById('paginationInfo');
        const loadingSpinner = document.getElementById('loadingSpinner');

        // Drag and drop functionality
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('border-blue-400', 'bg-blue-50');
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('border-blue-400', 'bg-blue-50');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('border-blue-400', 'bg-blue-50');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFile(files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFile(e.target.files[0]);
            }
        });

        function handleFile(file) {
            if (!file.name.toLowerCase().endsWith('.log')) {
                alert('Please select a .log file');
                return;
            }

            showLoading();
            
            const formData = new FormData();
            formData.append('logFile', file);

            fetch('/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                hideLoading();
                if (data.success) {
                    logData = data.logLines;
                    filteredLogData = [...logData];
                    
                    fileName.textContent = data.fileName;
                    fileSize.textContent = formatFileSize(data.fileSize);
                    fileInfo.style.display = 'block';
                    logViewer.style.display = 'block';
                    
                    displayLogs();
                } else {
                    alert('Error: ' + data.error);
                }
            })
            .catch(error => {
                hideLoading();
                alert('Error uploading file: ' + error.message);
            });
        }

        function showLoading() {
            loadingSpinner.classList.remove('hidden');
        }

        function hideLoading() {
            loadingSpinner.classList.add('hidden');
        }

        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        function clearFile() {
            logData = [];
            filteredLogData = [];
            fileInput.value = '';
            fileInfo.style.display = 'none';
            logViewer.style.display = 'none';
            logTableBody.innerHTML = '';
            searchInput.value = '';
            levelFilter.value = '';
        }

        function displayLogs() {
            logTableBody.innerHTML = '';
            
            filteredLogData.forEach(log => {
                const row = document.createElement('tr');
                const isError = log.level === 'ERROR';
                
                if (isError) {
                    row.className = 'error-row';
                }
                
                const levelClass = \`log-level-\${log.level}\`;
                
                row.innerHTML = \`
                    <td class="px-4 py-3 text-sm text-gray-900 font-mono">\${log.lineNumber}</td>
                    <td class="px-4 py-3 text-sm">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium \${levelClass}">
                            \${log.level}
                        </span>
                    </td>
                    <td class="px-4 py-3 text-sm \${isError ? 'error-message' : 'text-gray-900'} break-all">\${escapeHtml(log.message)}</td>
                    <td class="px-4 py-3 text-sm text-gray-600">\${escapeHtml(log.source)}</td>
                \`;
                
                logTableBody.appendChild(row);
            });
            
            paginationInfo.textContent = \`Showing \${filteredLogData.length} of \${logData.length} entries\`;
        }

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        // Search and filter functionality
        searchInput.addEventListener('input', filterLogs);
        levelFilter.addEventListener('change', filterLogs);

        function filterLogs() {
            const searchTerm = searchInput.value.toLowerCase();
            const selectedLevel = levelFilter.value;
            
            filteredLogData = logData.filter(log => {
                const matchesLevel = !selectedLevel || log.level === selectedLevel;
                const matchesSearch = !searchTerm || 
                    log.message.toLowerCase().includes(searchTerm) ||
                    log.source.toLowerCase().includes(searchTerm);
                
                return matchesLevel && matchesSearch;
            });
            
            displayLogs();
        }

        function exportToCSV() {
            if (filteredLogData.length === 0) {
                alert('No data to export');
                return;
            }
            
            const headers = ['Line #', 'Level', 'Message', 'Source'];
            const csvContent = [
                headers.join(','),
                ...filteredLogData.map(log => [
                    log.lineNumber,
                    log.level,
                    \`"\${log.message.replace(/"/g, '""')}"\`,
                    \`"\${log.source}"\`
                ].join(','))
            ].join('\\n');
            
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'log_export.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }
    </script>
</body>
</html>
    `);
  } catch (error) {
    console.error('Error serving log-viewer.html:', error);
    res.status(500).json({ error: 'Error serving log viewer page: ' + error.message });
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

// Catch-all route for debugging
app.get('*', (req, res) => {
  console.log('404 - Route not found:', req.url);
  res.status(404).json({ error: 'Route not found', path: req.url });
});

// Export for Vercel
module.exports = app; 