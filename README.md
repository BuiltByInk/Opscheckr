# OpsCheckr - DevOps Tools & Utilities

A collection of essential DevOps tools and utilities to streamline your operations workflow.

## 🚀 Live Demo

Visit [opscheckr.com](https://opscheckr.com) to access all tools.

## 🛠️ Available Tools

### 1. Log Visualizer
**Status: ✅ Available**

Upload and analyze log files with advanced filtering and error highlighting:
- **Drag & Drop Interface** - Easy file upload
- **Error Highlighting** - Errors displayed in red for quick identification
- **Advanced Filtering** - Filter by log level (ERROR, WARN, INFO, DEBUG, SUCCESS)
- **Search Functionality** - Search through log messages and sources
- **CSV Export** - Export filtered results to CSV
- **Responsive Design** - Works on desktop and mobile

### Coming Soon
- **Network Monitor** - Real-time network performance monitoring
- **System Health Check** - Comprehensive system diagnostics
- **Config Validator** - Validate configuration files
- **Deployment Tracker** - Track and monitor deployments
- **Resource Monitor** - Monitor system resources

## 🏗️ Architecture

- **Frontend**: HTML5, CSS3 (Tailwind CSS), JavaScript
- **Backend**: Node.js, Express.js
- **File Processing**: Multer for file uploads
- **Deployment**: Vercel

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/BuiltByInk/Opscheckr.git
   cd Opscheckr
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Deployment

This project is configured for deployment on Vercel:

1. **Connect your GitHub repository** to Vercel
2. **Deploy automatically** - Vercel will detect the configuration
3. **Custom domain** - Configure opscheckr.com in Vercel settings

## 📁 Project Structure

```
log-viewer-app/
├── server.js              # Express server
├── package.json           # Dependencies and scripts
├── vercel.json           # Vercel deployment config
├── public/
│   ├── index.html        # Landing page
│   ├── log-viewer.html   # Log viewer tool
│   └── script.js         # Frontend JavaScript
├── uploads/              # Uploaded log files (excluded from git)
└── README.md             # This file
```

## 🔧 Features

### Log Visualizer
- **File Upload**: Support for .log files
- **Real-time Parsing**: Instant log analysis
- **Error Detection**: Automatic error level identification
- **Responsive Table**: Sortable and searchable log entries
- **Export Functionality**: Download filtered results as CSV

### Landing Page
- **Professional Design**: Modern, clean interface
- **Tool Showcase**: Clear presentation of available tools
- **Future Planning**: Space for upcoming tools
- **Mobile Responsive**: Works on all devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:
- Create an issue on GitHub
- Contact the development team

---

**Built with ❤️ for the DevOps community** 