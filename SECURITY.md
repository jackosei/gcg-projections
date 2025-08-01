# 🔒 Security Setup - Goldcoast Farms Financial Tools

## Password Protection Implementation

Your financial tools are now password-protected to secure sensitive business information.

### 🔑 Password Security
- **Current Method**: Enhanced hash-based authentication (16-character hash)
- **Hash Location**: `login.html` (line 95 in the JavaScript)
- **Hash Generator**: Use `password-hash.html` to generate your own hash
- **Hash Format**: 16-character hexadecimal string (e.g., `A1B2C3D4000A0041`)

### 📁 Protected Files
- `login.html` - Entry point (no protection needed)
- `index.html` - Main dashboard selection
- `actuals.html` - Enhanced Financial Dashboard
- `projections.html` - Financial Projection Tool

### 🛡️ Security Features

#### Session Management
- **Session Duration**: 8 hours
- **Storage**: Browser sessionStorage (clears when browser closes)
- **Auto-logout**: Automatic logout after 8 hours of inactivity

#### Authentication Flow
1. **Entry Point**: Users start at `login.html`
2. **Password Check**: Validates against stored password
3. **Session Creation**: Creates authenticated session
4. **Access Control**: All protected pages check authentication
5. **Logout**: Red logout button on all protected pages

#### Logout Functionality
- **Manual Logout**: Red "Logout" button in top-right corner
- **Session Expiry**: Automatic logout after 8 hours
- **Browser Close**: Session clears when browser is closed

### 🔧 How to Change Password

1. **Open `password-hash.html`** in your browser
2. **Enter your new password** and click "Generate Hash"
3. **Copy the generated hash**
4. **Open `login.html`** in a text editor
5. **Find line 150**: `const correctHash = 'A1B2C3D4000A0041';`
6. **Replace** with your generated hash
7. **Save the file**

### 📋 Usage Instructions

#### For Users
1. **Access**: Open `login.html` in your browser
2. **Login**: Enter the password
3. **Navigate**: Use the dashboard to access tools
4. **Logout**: Click the red logout button when done

#### For Administrators
1. **Change Password**: Edit `login.html` line 89
2. **Share Password**: Provide new password to authorized users
3. **Monitor Access**: Check browser history for access logs

### ⚠️ Security Recommendations

#### Password Best Practices
- Use a strong, unique password
- Change password regularly
- Don't share password in plain text
- Consider using a password manager

#### Access Control
- Limit physical access to the files
- Use HTTPS if hosting online
- Consider additional server-side authentication for production

#### File Security
- Keep backup copies of the password
- Store password securely (not in plain text files)
- Consider encrypting sensitive data files

### 🚨 Important Notes

1. **Client-side Security**: This is basic client-side protection
2. **Not Production-Ready**: For sensitive data, consider server-side authentication
3. **Browser Dependencies**: Requires JavaScript and sessionStorage support
4. **File Access**: Anyone with file access can view the password in the code

### 🔄 Session Management

#### How Sessions Work
- **Login**: Creates session in browser storage
- **Validation**: Each page checks session before loading
- **Expiry**: 8-hour timeout from login time
- **Logout**: Clears session and redirects to login

#### Session Data Stored
- `authenticated`: Boolean flag
- `loginTime`: Timestamp for expiry calculation

### 📞 Support

If you need help with:
- **Password Issues**: Check the password in `login.html`
- **Session Problems**: Clear browser data and re-login
- **Access Denied**: Ensure you're using the correct password

---

**Remember**: This is basic protection for local use. For online deployment, consider additional security measures. 