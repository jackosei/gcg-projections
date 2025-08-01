# Goldcoast Farms Financial Management Tools

A comprehensive suite of password-protected financial management tools designed specifically for poultry farming operations. This project provides secure access to two distinct tools to help you make informed financial decisions.

## 🔒 Security Features

- **Password Protection**: Secure access with hash-based authentication
- **Session Management**: 8-hour automatic logout
- **Protected Files**: All financial tools require authentication
- **Hash Security**: 16-character enhanced hash for password storage

## 🚀 Quick Start

1. **Open `login.html`** in your web browser
2. **Enter your password** to access the secure portal
3. **Choose between the two available tools**:
   - **Enhanced Financial Dashboard** - For real-time analytics and data visualization
   - **Financial Projection Tool** - For future planning and ROI analysis

## 📊 Available Tools

### 1. Enhanced Financial Dashboard (`actuals.html`)
**Purpose**: Real-time analytics and data visualization for existing financial data

**Features**:
- 📁 **CSV File Upload**: Import your Egg Sales Tracker and Transactions data
- 📈 **Interactive Charts**: Visualize revenue, expenses, and profit trends
- 🔍 **Advanced Filtering**: Filter by date range, customer, payment status, and method
- 📋 **Data Export**: Export filtered data and charts as CSV/PNG
- 📊 **Executive Summary**: Key metrics at a glance
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 📄 **Tabbed Data Explorer**: Sales and expenses data in organized tabs
- 🔢 **Pagination & Sorting**: Advanced table controls for large datasets

**Use Case**: When you want to analyze your current financial performance and make data-driven decisions based on historical data.

### 2. Financial Projection Tool (`projections.html`)
**Purpose**: Future planning and ROI analysis for poultry farming operations

**Features**:
- 🐔 **Multi-Flock Modeling**: Project financials for multiple poultry flocks
- 📊 **Excel Configuration**: Upload custom parameters or use defaults
- 💰 **ROI Analysis**: Calculate breakeven points and return on investment
- 📅 **28-Month Projections**: Long-term financial planning and forecasting
- 📈 **Interactive Charts**: Visualize projected financial performance
- 📋 **Detailed Reports**: Comprehensive monthly and yearly summaries

**Use Case**: When you want to plan future investments, understand potential returns, and make strategic decisions about flock management.

## 🏗️ Project Structure

```
gcg-projections/
├── login.html              # Secure entry point (password required)
├── index.html              # Landing page with tool selection
├── actuals.html           # Enhanced Financial Dashboard
├── projections.html       # Financial Projection Tool
├── password-hash.html     # Password hash generator tool
├── SECURITY.md            # Security documentation
├── js/
│   └── auth.js           # Authentication script
├── src/
│   ├── styles/
│   │   └── main.css      # Dashboard styles
│   ├── utils/
│   │   ├── dataProcessor.js    # Data processing utilities
│   │   ├── chartManager.js     # Chart creation and management
│   │   ├── tableManager.js     # Table rendering and pagination
│   │   └── exportManager.js    # Data export functionality
│   ├── components/
│   │   ├── fileUpload.js       # File upload handling
│   │   ├── filters.js          # Advanced filtering logic
│   │   ├── summary.js          # Executive summary calculations
│   │   ├── charts.js           # Chart component management
│   │   └── tables.js           # Table component management
│   └── main.js                 # Main application entry point
├── public/
│   ├── assets/                 # Static assets
│   └── images/                 # Image files
├── docs/                       # Documentation
├── sample/                     # Sample CSV files
└── README.md                   # This file
```

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **Charts**: Chart.js
- **Data Processing**: PapaParse (CSV parsing)
- **File Handling**: Native JavaScript File API
- **Security**: Hash-based authentication with session management

## 🔐 Security Implementation

### Password Protection
- **Entry Point**: `login.html` - Secure authentication portal
- **Hash Security**: 16-character enhanced hash for password storage
- **Session Management**: 8-hour automatic logout
- **Protected Files**: All financial tools require authentication

### How to Change Password
1. Open `password-hash.html` in your browser
2. Enter your new password and click "Generate Hash"
3. Copy the generated hash
4. Open `login.html` and replace the hash on line 150
5. Save the file

## 📁 File Organization

### Core Files
- `login.html` - Secure entry point (password required)
- `index.html` - Landing page with tool selection
- `actuals.html` - Enhanced Financial Dashboard
- `projections.html` - Financial Projection Tool

### Security Files
- `password-hash.html` - Password hash generator
- `js/auth.js` - Authentication script
- `SECURITY.md` - Security documentation

### Modular Architecture
The dashboard uses a modular architecture with separate concerns:

- **Utils** (`src/utils/`): Core business logic and data processing
- **Components** (`src/components/`): UI components and user interactions
- **Styles** (`src/styles/`): Centralized styling
- **Main** (`src/main.js`): Application orchestration

## 🚀 Usage Instructions

### Getting Started

1. **Access the Portal**:
   - Open `login.html` in your web browser
   - Enter your password to access the secure portal

2. **Choose Your Tool**:
   - **Enhanced Financial Dashboard**: For analyzing current financial data
   - **Financial Projection Tool**: For planning future investments

### Enhanced Financial Dashboard

1. **Upload Data**:
   - Click "Launch Dashboard" from the landing page
   - Upload your "Egg Sales Tracker" CSV file
   - Upload your "Transactions" CSV file

2. **View Analytics**:
   - Executive summary appears automatically
   - Interactive charts show financial trends
   - Use advanced filters to focus on specific data

3. **Export Results**:
   - Export filtered data as CSV
   - Export charts as PNG images
   - Download comprehensive reports

### Financial Projection Tool

1. **Configure Parameters**:
   - Use default configuration or upload custom Excel file
   - Modify flock parameters, financial assumptions, and pricing
   - Validate configuration before running projections

2. **Run Projections**:
   - View 28-month financial projections
   - Analyze ROI and breakeven points
   - Compare different scenarios

3. **Export Results**:
   - Download detailed monthly reports
   - Export projection charts
   - Save configuration for future use

## 📋 File Requirements

### Sales Data (Egg Sales Tracker CSV)
Required columns:
- `Date`: Transaction date
- `Customer`: Customer name
- `Total Amount`: Sale amount
- `Payment Status`: Paid/Pending/Partial
- `Payment Method`: Cash/Bank Deposit/etc.

### Transactions Data (Transactions CSV)
Required columns:
- `Date`: Transaction date
- `Name`: Expense description
- `Expense Amount`: Expense amount
- `Category`: Expense category
- `Payment Method`: Payment method used

## 🔧 Development

### Local Development
1. Clone or download the project files
2. Open `login.html` in a web browser
3. Use the password hash generator to set your password
4. Access the tools through the secure portal

### File Structure
- **Protected Files**: All financial tools require authentication
- **Public Files**: `login.html`, `password-hash.html`, documentation
- **Modular Code**: Organized into utils, components, and styles

## 📚 Documentation

- **README.md**: This file - Main project documentation
- **SECURITY.md**: Security setup and password management
- **README-Enhanced-Dashboard.md**: Detailed dashboard features
- **README-Enhancements.md**: Projection tool enhancement guide

## 🛡️ Security Notes

- **Client-side Protection**: Basic protection for local use
- **Hash-based Authentication**: More secure than plain text passwords
- **Session Management**: Automatic logout after 8 hours
- **Not Production-Ready**: For online deployment, consider server-side authentication

## 🤝 Support

For issues or questions:
1. Check the documentation files
2. Verify password hash configuration
3. Clear browser data if experiencing session issues
4. Ensure all required CSV columns are present

---

**Remember**: This is a secure financial management suite designed for Goldcoast Farms' specific needs. Keep your password secure and consider additional security measures for production deployment.