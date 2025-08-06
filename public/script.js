// Global variables
let currentLogData = [];
let filteredLogData = [];
let currentFile = null;

// DOM elements
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

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
});

function setupEventListeners() {
    // File input change
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('drop', handleDrop);
    uploadArea.addEventListener('dragenter', handleDragEnter);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    
    // Search and filter
    searchInput.addEventListener('input', filterLogs);
    levelFilter.addEventListener('change', filterLogs);
}

// File handling
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        uploadFile(file);
    }
}

function handleDragOver(event) {
    event.preventDefault();
    uploadArea.classList.add('border-blue-400', 'bg-blue-50');
}

function handleDragEnter(event) {
    event.preventDefault();
    uploadArea.classList.add('border-blue-400', 'bg-blue-50');
}

function handleDragLeave(event) {
    event.preventDefault();
    uploadArea.classList.remove('border-blue-400', 'bg-blue-50');
}

function handleDrop(event) {
    event.preventDefault();
    uploadArea.classList.remove('border-blue-400', 'bg-blue-50');
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.name.toLowerCase().endsWith('.log') || file.type === 'text/plain') {
            uploadFile(file);
        } else {
            showError('Please select a .log file');
        }
    }
}

function uploadFile(file) {
    showLoading(true);
    
    const formData = new FormData();
    formData.append('logFile', file);
    
    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        showLoading(false);
        if (data.success) {
            handleUploadSuccess(data, file);
        } else {
            showError(data.error || 'Upload failed');
        }
    })
    .catch(error => {
        showLoading(false);
        showError('Upload failed: ' + error.message);
    });
}

function handleUploadSuccess(data, file) {
    currentFile = file;
    currentLogData = data.logLines;
    filteredLogData = [...currentLogData];
    
    // Update file info
    fileName.textContent = data.fileName;
    fileSize.textContent = formatFileSize(data.fileSize);
    fileInfo.style.display = 'block';
    
    // Show log viewer
    logViewer.style.display = 'block';
    
    // Display logs
    displayLogs();
    
    // Reset filters
    searchInput.value = '';
    levelFilter.value = '';
}

function displayLogs() {
    const tbody = logTableBody;
    tbody.innerHTML = '';
    
    filteredLogData.forEach(log => {
        const row = document.createElement('tr');
        const isError = log.level === 'ERROR';
        row.className = isError ? 'hover:bg-gray-50 error-row' : 'hover:bg-gray-50';
        
        const levelClass = `log-level-${log.level}`;
        const messageClass = isError ? 'px-4 py-3 text-sm error-message break-all' : 'px-4 py-3 text-sm text-gray-900 break-all';
        
        row.innerHTML = `
            <td class="px-4 py-3 text-sm text-gray-900 font-mono">${log.lineNumber}</td>
            <td class="px-4 py-3 text-sm">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${levelClass}">
                    ${log.level}
                </span>
            </td>
            <td class="${messageClass}">${escapeHtml(log.message)}</td>
            <td class="px-4 py-3 text-sm text-gray-600">${escapeHtml(log.source)}</td>
        `;
        
        tbody.appendChild(row);
    });
    
    updatePaginationInfo();
}

function filterLogs() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedLevel = levelFilter.value;
    
    filteredLogData = currentLogData.filter(log => {
        const matchesSearch = !searchTerm || 
            log.message.toLowerCase().includes(searchTerm) ||
            log.source.toLowerCase().includes(searchTerm);
        
        const matchesLevel = !selectedLevel || log.level === selectedLevel;
        
        return matchesSearch && matchesLevel;
    });
    
    displayLogs();
}

function updatePaginationInfo() {
    const total = currentLogData.length;
    const filtered = filteredLogData.length;
    
    if (total === filtered) {
        paginationInfo.textContent = `Showing ${total} entries`;
    } else {
        paginationInfo.textContent = `Showing ${filtered} of ${total} entries`;
    }
}

function clearFile() {
    currentLogData = [];
    filteredLogData = [];
    currentFile = null;
    
    fileInfo.style.display = 'none';
    logViewer.style.display = 'none';
    fileInput.value = '';
    
    // Reset filters
    searchInput.value = '';
    levelFilter.value = '';
}

function exportToCSV() {
    if (filteredLogData.length === 0) {
        showError('No data to export');
        return;
    }
    
    const headers = ['Line #', 'Level', 'Message', 'Source'];
    const csvContent = [
        headers.join(','),
        ...filteredLogData.map(log => [
            log.lineNumber,
            log.level,
            `"${log.message.replace(/"/g, '""')}"`,
            `"${log.source}"`
        ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentFile.name.replace('.log', '')}_export.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Utility functions
function showLoading(show) {
    if (show) {
        loadingSpinner.classList.remove('hidden');
    } else {
        loadingSpinner.classList.add('hidden');
    }
}

function showError(message) {
    // Create a simple error notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
} 