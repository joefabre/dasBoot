# JobTracker Pro - Your Career Journey Manager

![JobTracker Pro](https://img.shields.io/badge/Version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)
![Platform](https://img.shields.io/badge/Platform-Web-orange.svg)

A comprehensive job search management application to track applications, manage contacts, and analyze your career journey progress.

## 🚀 Features

### 📋 Application Management
- **Track Job Applications**: Add, edit, and organize your job applications
- **Status Tracking**: Monitor application status (Interested, Applied, Interview, Offer, Rejected, Accepted)
- **Application Details**: Store job title, company, location, salary range, job URLs, and notes
- **Contact Integration**: Link contacts to applications automatically
- **Interview Scheduling**: Full interview management with date, time, type, duration, and location
- **Smart Interview Cards**: Enhanced display for scheduled interviews with special styling
- **Filtering & Search**: Filter applications by status and date

### 👥 Contact Management
- **Professional Network**: Build and maintain your professional contact database
- **Automatic Contact Creation**: Contacts are automatically created from job applications
- **Contact Information**: Store names, titles, companies, emails, phone numbers, and LinkedIn profiles
- **Alphabetical Organization**: Contacts are automatically sorted alphabetically
- **Contact Linking**: See which applications are connected to specific contacts

### 📊 Analytics & Insights
- **Dashboard Overview**: Real-time statistics and metrics
- **Status Distribution**: Visual representation of application statuses
- **Timeline Charts**: Track application trends over time
- **Response Rate Tracking**: Monitor your job search effectiveness
- **Personalized Insights**: AI-driven recommendations and observations

### 🗺 Interview Scheduling System
- **Complete Interview Management**: Schedule interviews with date, time, type, and duration
- **Interview Types**: Phone, Video, In-Person, Panel, and Technical interviews
- **Smart Timing Alerts**: Visual clock alerts for upcoming and active interviews
- **Interview Notes**: Dedicated space for preparation notes and questions
- **Location/Link Tracking**: Store meeting locations or video call links
- **Contact Integration**: Link interviews to specific contacts automatically
- **Enhanced Cards**: Special styling and information display for scheduled interviews

### 🔔 Smart Clock Features
- **Pre-Interview Alert**: Clock flashes red 1 hour before any scheduled interview
- **Active Interview Indicator**: Clock flashes green during interview time
- **Duration Aware**: Automatically calculates interview end time based on set duration
- **Multiple Interview Support**: Handles multiple interviews and shows appropriate alerts
- **Real-time Monitoring**: Updates every second for precise timing

### 🖨️ Professional Reporting & Print System
- **Comprehensive Print Reports**: Generate professional reports in multiple formats
- **Selective Printing**: Choose specific categories (Applications, Contacts, Analytics)
- **Multiple Formats**: Spreadsheet tables or detailed card layouts
- **Print Optimization**: Specially formatted for clean, readable printed output
- **Report Headers**: Professional headers with generation date and statistics
- **Page Management**: Automatic page breaks and print-friendly styling

### 🔧 Additional Features
- **Data Persistence**: Automatic local storage of all data
- **Data Export/Import**: Backup and restore your data
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations
- **Keyboard Shortcuts**: Efficient navigation and quick actions
- **Sticky Footer**: Always-visible footer with version and live clock
- **Professional Formatting**: Automatic capitalization of names and titles

## 🛠️ Installation

### Option 1: Direct Usage
1. Download or clone this repository
2. Open `index.html` in your web browser
3. Start tracking your job applications!

### Option 2: Local Web Server
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (with http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000` in your browser.

## 📖 Quick Start Guide

### Adding Your First Application
1. Click the **Applications** tab in the navigation
2. Click **"Add Application"** button
3. Fill in the job details:
   - Job Title (required)
   - Company (required)
   - Location, salary range, and job URL (optional)
   - Current status
   - Notes about the position
4. **For Interviews**: If status is "Interview", fill in interview details:
   - Interview date and time
   - Interview type (Phone, Video, In-Person, Panel, Technical)
   - Duration and location/meeting link
   - Interview preparation notes
5. **Optional**: Add contact information for the hiring manager or recruiter
6. Click **"Save Application"**

### Scheduling Interviews
1. Set application status to "Interview"
2. Interview fields will automatically appear
3. Fill in:
   - **Date & Time**: When the interview is scheduled
   - **Type**: Phone, Video, In-Person, Panel, or Technical
   - **Duration**: How long the interview will last (in minutes)
   - **Location/Link**: Office address or video call URL
   - **Notes**: Preparation notes, questions to ask, etc.
4. Save the application
5. The interview card will display with special styling
6. Watch for clock alerts: Red (1 hour before) and Green (during interview)

### Managing Contacts
1. Navigate to the **Contacts** tab
2. View automatically created contacts from applications
3. Click **"Add Contact"** to manually add new contacts
4. Edit or delete contacts as needed

### Viewing Analytics
1. Go to the **Analytics** tab
2. Review your application status distribution
3. Check application trends over time
4. Read personalized insights and recommendations

## 🎯 Best Practices

### Effective Application Tracking
- **Update Status Regularly**: Keep application statuses current
- **Add Detailed Notes**: Include interview dates, feedback, and next steps
- **Track Contact Information**: Always include recruiter or hiring manager details
- **Set Reminders**: Use the insights to follow up on pending applications

### Contact Management
- **Complete Profiles**: Fill in as much contact information as possible
- **Regular Updates**: Keep contact information current
- **LinkedIn Integration**: Include LinkedIn profiles for easy networking

### Data Management
- **Regular Backups**: Export your data regularly using the settings menu
- **Clean Data Entry**: Use consistent formatting for better analytics
- **Review Analytics**: Check insights weekly to improve your job search strategy

## 🔧 Technical Details

### Browser Compatibility
- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

### Data Storage
- Uses HTML5 LocalStorage for data persistence
- No server required - runs entirely in your browser
- Data remains private and secure on your device

### Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS Grid, Flexbox, CSS Animations
- **Icons**: Font Awesome 6.0
- **Charts**: Custom CSS-based visualizations

## 📁 File Structure

```
jobsearch/
├── index.html          # Main application file
├── styles.css          # Application styles
├── script.js           # Application logic
├── README.md           # This file
└── help.html           # Help documentation
```

## 🚀 Version History

### Version 1.0.0 (Current)
- Initial release with comprehensive job search management
- Complete application and contact management
- **Interview scheduling system** with date, time, type, and duration tracking
- **Smart clock alerts** - red flash 1 hour before, green during interviews
- Enhanced application cards with interview details and special styling
- Analytics and insights dashboard with real-time metrics
- Data export/import functionality for backup and restore
- Responsive design optimized for all devices
- Contact integration with automatic creation from applications
- Professional formatting with automatic name/title capitalization
- Sticky footer with live clock and version information
- Comprehensive help documentation and README

## 🤝 Contributing

This is currently a personal project, but suggestions and feedback are welcome! 

### Reporting Issues
If you encounter any bugs or have feature requests:
1. Check existing issues first
2. Provide detailed reproduction steps
3. Include browser and version information

### Feature Requests
We welcome ideas for new features! Consider:
- Enhanced analytics and reporting
- Integration with job boards
- Email integration
- Calendar integration
- Advanced filtering options

## 📄 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2025 JobTracker Pro

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 📞 Support

For support, questions, or feedback:
- Check the help documentation (`help.html`)
- Review this README for common questions
- Submit issues through the project repository

---

**Happy Job Hunting! 🎯**

*JobTracker Pro - Making your career journey organized and insightful.*

