// JobTracker Pro - Main Application JavaScript

class JobTracker {
    constructor() {
        this.applications = [];
        this.contacts = [];
        this.currentEditingId = null;
        this.currentEditingType = null;
        
        // Initialize the application
        this.init();
    }

    init() {
        this.loadDataFromStorage();
        this.bindEvents();
        this.updateDashboard();
        this.renderApplications();
        this.renderContacts();
        this.updateAnalytics();
        this.showSection('dashboard');
    }

    // Data Management
    loadDataFromStorage() {
        try {
            const savedApplications = localStorage.getItem('jobTracker_applications');
            const savedContacts = localStorage.getItem('jobTracker_contacts');
            
            if (savedApplications) {
                this.applications = JSON.parse(savedApplications);
            }
            
            if (savedContacts) {
                this.contacts = JSON.parse(savedContacts);
            }
        } catch (error) {
            console.error('Error loading data from storage:', error);
            this.showNotification('Error loading saved data', 'error');
        }
    }

    saveDataToStorage() {
        try {
            localStorage.setItem('jobTracker_applications', JSON.stringify(this.applications));
            localStorage.setItem('jobTracker_contacts', JSON.stringify(this.contacts));
            this.showNotification('Data saved successfully', 'success');
        } catch (error) {
            console.error('Error saving data:', error);
            this.showNotification('Error saving data', 'error');
        }
    }

    // Cloud sync simulation (would integrate with real backend)
    syncData() {
        const syncBtn = document.getElementById('syncBtn');
        const originalText = syncBtn.innerHTML;
        
        syncBtn.innerHTML = '<i class="fas fa-sync-alt loading"></i> Syncing...';
        syncBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            syncBtn.innerHTML = originalText;
            syncBtn.disabled = false;
            this.showNotification('Data synced successfully', 'success');
        }, 2000);
    }

    exportData() {
        const data = {
            applications: this.applications,
            contacts: this.contacts,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `jobtracker_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Data exported successfully', 'success');
    }

    // Event Binding
    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.showSection(section);
            });
        });

        // Modal controls
        document.getElementById('addApplicationBtn').addEventListener('click', () => {
            this.openApplicationModal();
        });

        document.getElementById('addContactBtn').addEventListener('click', () => {
            this.openContactModal();
        });

        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeApplicationModal();
        });

        document.getElementById('closeContactModal').addEventListener('click', () => {
            this.closeContactModal();
        });

        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.closeApplicationModal();
        });

        document.getElementById('cancelContactBtn').addEventListener('click', () => {
            this.closeContactModal();
        });

        // Form submissions
        document.getElementById('applicationForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveApplication();
        });

        document.getElementById('contactForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveContact();
        });

        // Application filters
        document.getElementById('statusFilter').addEventListener('change', () => {
            this.filterApplications();
        });

        document.getElementById('dateFilter').addEventListener('change', () => {
            this.filterApplications();
        });

        // Sync button
        document.getElementById('syncBtn').addEventListener('click', () => {
            this.syncData();
        });

        // Settings button
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.showSettingsMenu();
        });

        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeApplicationModal();
                this.closeContactModal();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeApplicationModal();
                this.closeContactModal();
            }
        });

    }

    // Navigation
    showSection(sectionName) {
        // Update navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Show/hide sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionName).classList.add('active');

        // Refresh analytics when switching to analytics section
        if (sectionName === 'analytics') {
            console.log('Switching to analytics, refreshing charts...');
            setTimeout(() => {
                this.updateAnalytics();
            }, 100);
        }

        // Add fade-in animation
        document.getElementById(sectionName).classList.add('fade-in');
    }

    // Dashboard Management
    updateDashboard() {
        const stats = this.calculateStats();
        
        document.getElementById('totalApplications').textContent = stats.totalApplications;
        document.getElementById('interviewsScheduled').textContent = stats.interviewsScheduled;
        document.getElementById('offersReceived').textContent = stats.offersReceived;
        document.getElementById('responseRate').textContent = stats.responseRate + '%';

        this.updateRecentActivity();
        this.updateUpcomingTasks();
    }

    calculateStats() {
        const total = this.applications.length;
        const interviews = this.applications.filter(app => app.status === 'interview').length;
        const offers = this.applications.filter(app => app.status === 'offer' || app.status === 'accepted').length;
        const responses = this.applications.filter(app => app.status !== 'applied' && app.status !== 'interested').length;
        const responseRate = total > 0 ? Math.round((responses / total) * 100) : 0;

        return {
            totalApplications: total,
            interviewsScheduled: interviews,
            offersReceived: offers,
            responseRate: responseRate
        };
    }

    updateRecentActivity() {
        const activityList = document.getElementById('recentActivity');
        const recentApps = this.applications
            .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
            .slice(0, 5);

        if (recentApps.length === 0) {
            activityList.innerHTML = `
                <div class="activity-item">
                    <i class="fas fa-info-circle"></i>
                    <p>No recent activity. Start by adding your first application!</p>
                </div>
            `;
            return;
        }

        activityList.innerHTML = recentApps.map(app => `
            <div class="activity-item">
                <i class="fas fa-${this.getStatusIcon(app.status)}"></i>
                <p><strong>${app.jobTitle}</strong> at ${app.company} - ${this.formatDate(app.dateAdded)}</p>
            </div>
        `).join('');
    }

    updateUpcomingTasks() {
        const taskList = document.getElementById('upcomingTasks');
        const upcomingInterviews = this.applications.filter(app => app.status === 'interview');
        
        if (upcomingInterviews.length === 0) {
            taskList.innerHTML = `
                <div class="task-item">
                    <i class="fas fa-calendar"></i>
                    <p>No upcoming interviews scheduled</p>
                </div>
            `;
            return;
        }

        taskList.innerHTML = upcomingInterviews.map(app => `
            <div class="task-item">
                <i class="fas fa-calendar"></i>
                <p>Interview: <strong>${app.jobTitle}</strong> at ${app.company}</p>
            </div>
        `).join('');
    }

    // Application Management
    openApplicationModal(applicationId = null) {
        const modal = document.getElementById('applicationModal');
        const form = document.getElementById('applicationForm');
        const title = document.getElementById('modalTitle');

        if (applicationId) {
            // Edit mode
            const app = this.applications.find(a => a.id === applicationId);
            if (app) {
                title.textContent = 'Edit Application';
                this.populateApplicationForm(app);
                this.currentEditingId = applicationId;
            }
        } else {
            // Add mode
            title.textContent = 'Add New Application';
            form.reset();
            this.currentEditingId = null;
        }

        modal.classList.add('active');
    }

    closeApplicationModal() {
        const modal = document.getElementById('applicationModal');
        modal.classList.remove('active');
        document.getElementById('applicationForm').reset();
        this.currentEditingId = null;
    }

    populateApplicationForm(application) {
        document.getElementById('jobTitle').value = application.jobTitle;
        document.getElementById('company').value = application.company;
        document.getElementById('location').value = application.location || '';
        document.getElementById('salary').value = application.salary || '';
        document.getElementById('status').value = application.status;
        document.getElementById('jobUrl').value = application.jobUrl || '';
        document.getElementById('notes').value = application.notes || '';
    }

    saveApplication() {
        const formData = {
            jobTitle: document.getElementById('jobTitle').value,
            company: document.getElementById('company').value,
            location: document.getElementById('location').value,
            salary: document.getElementById('salary').value,
            status: document.getElementById('status').value,
            jobUrl: document.getElementById('jobUrl').value,
            notes: document.getElementById('notes').value
        };

        if (this.currentEditingId) {
            // Update existing application
            const index = this.applications.findIndex(app => app.id === this.currentEditingId);
            if (index !== -1) {
                this.applications[index] = {
                    ...this.applications[index],
                    ...formData,
                    dateModified: new Date().toISOString()
                };
                this.showNotification('Application updated successfully', 'success');
            }
        } else {
            // Add new application
            const newApplication = {
                id: this.generateId(),
                ...formData,
                dateAdded: new Date().toISOString(),
                dateModified: new Date().toISOString()
            };
            this.applications.push(newApplication);
            this.showNotification('Application added successfully', 'success');
        }

        this.saveDataToStorage();
        this.updateDashboard();
        this.renderApplications();
        this.updateAnalytics();
        this.closeApplicationModal();
    }

    deleteApplication(applicationId) {
        if (confirm('Are you sure you want to delete this application?')) {
            this.applications = this.applications.filter(app => app.id !== applicationId);
        this.saveDataToStorage();
        this.updateDashboard();
        this.renderApplications();
        this.updateAnalytics();
        this.showNotification('Application deleted successfully', 'success');
        }
    }

    renderApplications() {
        const grid = document.getElementById('applicationsGrid');
        
        if (this.applications.length === 0) {
            grid.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-briefcase" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                    <p>No applications yet. Click "Add Application" to get started!</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.applications.map(app => `
            <div class="application-card slide-up">
                <div class="application-status status-${app.status}">${app.status}</div>
                <div class="application-header">
                    <h3>${app.jobTitle}</h3>
                </div>
                <div class="application-company">${app.company}</div>
                <div class="application-details">
                    ${app.location ? `<span><i class="fas fa-map-marker-alt"></i> ${app.location}</span>` : ''}
                    ${app.salary ? `<span><i class="fas fa-dollar-sign"></i> ${app.salary}</span>` : ''}
                    <span><i class="fas fa-calendar"></i> Added ${this.formatDate(app.dateAdded)}</span>
                </div>
                ${app.notes ? `<p class="application-notes">${app.notes}</p>` : ''}
                <div class="application-actions">
                    <button class="edit-btn" onclick="jobTracker.openApplicationModal('${app.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="delete-btn" onclick="jobTracker.deleteApplication('${app.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                    ${app.jobUrl ? `<a href="${app.jobUrl}" target="_blank" class="btn-secondary">
                        <i class="fas fa-external-link-alt"></i> View Job
                    </a>` : ''}
                </div>
            </div>
        `).join('');
    }

    filterApplications() {
        const statusFilter = document.getElementById('statusFilter').value;
        const dateFilter = document.getElementById('dateFilter').value;
        
        let filteredApps = [...this.applications];

        if (statusFilter) {
            filteredApps = filteredApps.filter(app => app.status === statusFilter);
        }

        if (dateFilter) {
            const filterDate = new Date(dateFilter);
            filteredApps = filteredApps.filter(app => {
                const appDate = new Date(app.dateAdded);
                return appDate >= filterDate;
            });
        }

        // Re-render with filtered data
        const grid = document.getElementById('applicationsGrid');
        grid.innerHTML = filteredApps.map(app => `
            <div class="application-card slide-up">
                <div class="application-status status-${app.status}">${app.status}</div>
                <div class="application-header">
                    <h3>${app.jobTitle}</h3>
                </div>
                <div class="application-company">${app.company}</div>
                <div class="application-details">
                    ${app.location ? `<span><i class="fas fa-map-marker-alt"></i> ${app.location}</span>` : ''}
                    ${app.salary ? `<span><i class="fas fa-dollar-sign"></i> ${app.salary}</span>` : ''}
                    <span><i class="fas fa-calendar"></i> Added ${this.formatDate(app.dateAdded)}</span>
                </div>
                ${app.notes ? `<p class="application-notes">${app.notes}</p>` : ''}
                <div class="application-actions">
                    <button class="edit-btn" onclick="jobTracker.openApplicationModal('${app.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="delete-btn" onclick="jobTracker.deleteApplication('${app.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                    ${app.jobUrl ? `<a href="${app.jobUrl}" target="_blank" class="btn-secondary">
                        <i class="fas fa-external-link-alt"></i> View Job
                    </a>` : ''}
                </div>
            </div>
        `).join('');
    }

    // Contact Management
    openContactModal(contactId = null) {
        const modal = document.getElementById('contactModal');
        const form = document.getElementById('contactForm');

        if (contactId) {
            const contact = this.contacts.find(c => c.id === contactId);
            if (contact) {
                this.populateContactForm(contact);
                this.currentEditingId = contactId;
                this.currentEditingType = 'contact';
            }
        } else {
            form.reset();
            this.currentEditingId = null;
            this.currentEditingType = 'contact';
        }

        modal.classList.add('active');
    }

    closeContactModal() {
        const modal = document.getElementById('contactModal');
        modal.classList.remove('active');
        document.getElementById('contactForm').reset();
        this.currentEditingId = null;
        this.currentEditingType = null;
    }

    populateContactForm(contact) {
        document.getElementById('contactName').value = contact.name;
        document.getElementById('contactTitle').value = contact.title || '';
        document.getElementById('contactCompany').value = contact.company || '';
        document.getElementById('contactEmail').value = contact.email || '';
        document.getElementById('contactPhone').value = contact.phone || '';
        document.getElementById('contactLinkedIn').value = contact.linkedIn || '';
        document.getElementById('contactNotes').value = contact.notes || '';
    }

    saveContact() {
        const formData = {
            name: document.getElementById('contactName').value,
            title: document.getElementById('contactTitle').value,
            company: document.getElementById('contactCompany').value,
            email: document.getElementById('contactEmail').value,
            phone: document.getElementById('contactPhone').value,
            linkedIn: document.getElementById('contactLinkedIn').value,
            notes: document.getElementById('contactNotes').value
        };

        if (this.currentEditingId && this.currentEditingType === 'contact') {
            // Update existing contact
            const index = this.contacts.findIndex(contact => contact.id === this.currentEditingId);
            if (index !== -1) {
                this.contacts[index] = {
                    ...this.contacts[index],
                    ...formData,
                    dateModified: new Date().toISOString()
                };
                this.showNotification('Contact updated successfully', 'success');
            }
        } else {
            // Add new contact
            const newContact = {
                id: this.generateId(),
                ...formData,
                dateAdded: new Date().toISOString(),
                dateModified: new Date().toISOString()
            };
            this.contacts.push(newContact);
            this.showNotification('Contact added successfully', 'success');
        }

        this.saveDataToStorage();
        this.renderContacts();
        this.closeContactModal();
    }

    deleteContact(contactId) {
        if (confirm('Are you sure you want to delete this contact?')) {
            this.contacts = this.contacts.filter(contact => contact.id !== contactId);
            this.saveDataToStorage();
            this.renderContacts();
            this.showNotification('Contact deleted successfully', 'success');
        }
    }

    renderContacts() {
        const grid = document.getElementById('contactsGrid');
        
        if (this.contacts.length === 0) {
            grid.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-users" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                    <p>No contacts yet. Click "Add Contact" to start building your network!</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.contacts.map(contact => `
            <div class="contact-card slide-up">
                <div class="contact-header">
                    <div class="contact-avatar">
                        ${contact.name.charAt(0).toUpperCase()}
                    </div>
                    <div class="contact-info">
                        <h3>${contact.name}</h3>
                        ${contact.title ? `<div class="contact-title">${contact.title}</div>` : ''}
                    </div>
                </div>
                <div class="contact-details">
                    ${contact.company ? `<p><i class="fas fa-building"></i> ${contact.company}</p>` : ''}
                    ${contact.email ? `<p><i class="fas fa-envelope"></i> <a href="mailto:${contact.email}">${contact.email}</a></p>` : ''}
                    ${contact.phone ? `<p><i class="fas fa-phone"></i> <a href="tel:${contact.phone}">${contact.phone}</a></p>` : ''}
                    ${contact.linkedIn ? `<p><i class="fab fa-linkedin"></i> <a href="${contact.linkedIn}" target="_blank">LinkedIn</a></p>` : ''}
                </div>
                ${contact.notes ? `<p class="contact-notes">${contact.notes}</p>` : ''}
                <div class="contact-actions">
                    <button class="edit-btn" onclick="jobTracker.openContactModal('${contact.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="delete-btn" onclick="jobTracker.deleteContact('${contact.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Analytics and Insights
    updateAnalytics() {
        this.renderStatusChart();
        this.renderTimelineChart();
        this.generateInsights();
    }

    renderStatusChart() {
        const statusChart = document.getElementById('statusChart');
        if (!statusChart) {
            console.log('Status chart element not found');
            return;
        }

        const statusCounts = this.getStatusCounts();
        console.log('Status counts:', statusCounts);
        
        if (this.applications.length === 0) {
            statusChart.innerHTML = `
                <div class="no-data-chart">
                    <i class="fas fa-chart-pie" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                    <p>Add applications to see status distribution</p>
                    <p style="font-size: 0.8rem; color: #999;">Go to Applications → Add Application to get started</p>
                </div>
            `;
            return;
        }

        // Create a simple visual chart using CSS
        const total = this.applications.length;
        const chartHtml = Object.entries(statusCounts)
            .filter(([status, count]) => count > 0)
            .map(([status, count]) => {
                const percentage = Math.round((count / total) * 100);
                const color = this.getStatusColor(status);
                return `
                    <div class="chart-bar">
                        <div class="chart-label">
                            <span class="status-dot" style="background: ${color};"></span>
                            <span class="status-name">${status.charAt(0).toUpperCase() + status.slice(1)}</span>
                            <span class="status-count">${count} (${percentage}%)</span>
                        </div>
                        <div class="chart-progress">
                            <div class="chart-fill" style="width: ${percentage}%; background: ${color};"></div>
                        </div>
                    </div>
                `;
            }).join('');

        statusChart.innerHTML = `
            <div class="chart-content">
                ${chartHtml}
            </div>
        `;
    }

    renderTimelineChart() {
        const timelineChart = document.getElementById('timelineChart');
        if (!timelineChart) return;

        if (this.applications.length === 0) {
            timelineChart.innerHTML = `
                <div class="no-data-chart">
                    <i class="fas fa-chart-line" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                    <p>Add applications to see timeline</p>
                </div>
            `;
            return;
        }

        const timelineData = this.getTimelineData();
        const maxCount = Math.max(...timelineData.map(d => d.count));
        
        const timelineHtml = timelineData.map(data => {
            const height = maxCount > 0 ? (data.count / maxCount) * 100 : 0;
            return `
                <div class="timeline-bar">
                    <div class="timeline-fill" style="height: ${height}%;"></div>
                    <div class="timeline-label">${data.label}</div>
                    <div class="timeline-count">${data.count}</div>
                </div>
            `;
        }).join('');

        timelineChart.innerHTML = `
            <div class="timeline-chart">
                ${timelineHtml}
            </div>
        `;
    }

    generateInsights() {
        const insightsList = document.getElementById('insightsList');
        if (!insightsList) return;

        if (this.applications.length === 0) {
            insightsList.innerHTML = `
                <div class="insight-item">
                    <i class="fas fa-lightbulb"></i>
                    <p>Start tracking applications to see personalized insights</p>
                </div>
            `;
            return;
        }

        const insights = this.calculateInsights();
        
        insightsList.innerHTML = insights.map(insight => `
            <div class="insight-item">
                <i class="fas fa-${insight.icon}"></i>
                <p><strong>${insight.title}:</strong> ${insight.message}</p>
            </div>
        `).join('');
    }

    getStatusCounts() {
        const counts = {
            interested: 0,
            applied: 0,
            interview: 0,
            offer: 0,
            rejected: 0,
            accepted: 0
        };

        this.applications.forEach(app => {
            if (counts.hasOwnProperty(app.status)) {
                counts[app.status]++;
            }
        });

        return counts;
    }

    getStatusColor(status) {
        const colors = {
            interested: '#2196f3',
            applied: '#9c27b0',
            interview: '#ff9800',
            offer: '#4caf50',
            rejected: '#f44336',
            accepted: '#2e7d32'
        };
        return colors[status] || '#666';
    }

    getTimelineData() {
        const last7Days = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            
            const count = this.applications.filter(app => {
                const appDate = new Date(app.dateAdded).toISOString().split('T')[0];
                return appDate === dateString;
            }).length;
            
            last7Days.push({
                label: i === 0 ? 'Today' : i === 1 ? 'Yesterday' : date.toLocaleDateString('en-US', { weekday: 'short' }),
                count: count,
                date: dateString
            });
        }
        
        return last7Days;
    }

    calculateInsights() {
        const insights = [];
        const statusCounts = this.getStatusCounts();
        const total = this.applications.length;
        
        // Response rate insight
        const responses = statusCounts.interview + statusCounts.offer + statusCounts.rejected + statusCounts.accepted;
        const responseRate = total > 0 ? Math.round((responses / total) * 100) : 0;
        
        if (responseRate > 0) {
            insights.push({
                icon: 'chart-line',
                title: 'Response Rate',
                message: `${responseRate}% of your applications received responses`
            });
        }
        
        // Interview conversion
        const interviews = statusCounts.interview + statusCounts.offer + statusCounts.accepted;
        if (interviews > 0) {
            const interviewRate = Math.round((interviews / total) * 100);
            insights.push({
                icon: 'handshake',
                title: 'Interview Rate',
                message: `${interviewRate}% of applications led to interviews`
            });
        }
        
        // Most active status
        const maxStatus = Object.entries(statusCounts).reduce((a, b) => statusCounts[a[0]] > statusCounts[b[0]] ? a : b);
        if (maxStatus[1] > 0) {
            insights.push({
                icon: 'star',
                title: 'Most Common Status',
                message: `Most applications are in "${maxStatus[0]}" stage (${maxStatus[1]} applications)`
            });
        }
        
        // Recent activity
        const recentApps = this.applications.filter(app => {
            const appDate = new Date(app.dateAdded);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return appDate > weekAgo;
        }).length;
        
        if (recentApps > 0) {
            insights.push({
                icon: 'calendar-check',
                title: 'Recent Activity',
                message: `You added ${recentApps} application${recentApps > 1 ? 's' : ''} in the last 7 days`
            });
        }
        
        // Success rate
        const successful = statusCounts.offer + statusCounts.accepted;
        if (successful > 0) {
            const successRate = Math.round((successful / total) * 100);
            insights.push({
                icon: 'trophy',
                title: 'Success Rate',
                message: `${successRate}% of applications resulted in offers`
            });
        }
        
        // Recommendations
        if (statusCounts.applied > statusCounts.interview && total > 5) {
            insights.push({
                icon: 'lightbulb',
                title: 'Recommendation',
                message: 'Consider following up on pending applications or improving your application strategy'
            });
        }
        
        if (insights.length === 0) {
            insights.push({
                icon: 'info-circle',
                title: 'Getting Started',
                message: 'Keep adding applications to unlock detailed insights about your job search'
            });
        }
        
        return insights;
    }

    // Settings and Utilities
    showSettingsMenu() {
        const settingsHtml = `
            <div class="modal active" id="settingsModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Settings</h3>
                        <button class="close-btn" onclick="document.getElementById('settingsModal').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div style="padding: 1.5rem;">
                        <div class="form-group">
                            <button class="btn-primary" onclick="jobTracker.exportData()" style="width: 100%; margin-bottom: 1rem;">
                                <i class="fas fa-download"></i> Export Data
                            </button>
                        </div>
                        <div class="form-group">
                            <label for="importFile">Import Data</label>
                            <input type="file" id="importFile" accept=".json" onchange="jobTracker.importData(event)">
                        </div>
                        <div class="form-group">
                            <button class="btn-secondary" onclick="jobTracker.clearAllData()" style="width: 100%;">
                                <i class="fas fa-trash"></i> Clear All Data
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', settingsHtml);
    }

    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.applications && data.contacts) {
                    this.applications = data.applications;
                    this.contacts = data.contacts;
                    this.saveDataToStorage();
                    this.updateDashboard();
                    this.renderApplications();
                    this.renderContacts();
                    this.showNotification('Data imported successfully', 'success');
                    document.getElementById('settingsModal').remove();
                } else {
                    this.showNotification('Invalid file format', 'error');
                }
            } catch (error) {
                this.showNotification('Error importing data', 'error');
            }
        };
        reader.readAsText(file);
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            this.applications = [];
            this.contacts = [];
            localStorage.removeItem('jobTracker_applications');
            localStorage.removeItem('jobTracker_contacts');
            this.updateDashboard();
            this.renderApplications();
            this.renderContacts();
            this.showNotification('All data cleared', 'success');
            document.getElementById('settingsModal').remove();
        }
    }

    // Utility Functions
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Today';
        if (diffDays === 2) return 'Yesterday';
        if (diffDays <= 7) return `${diffDays - 1} days ago`;
        
        return date.toLocaleDateString();
    }

    getStatusIcon(status) {
        const icons = {
            interested: 'eye',
            applied: 'paper-plane',
            interview: 'handshake',
            offer: 'gift',
            rejected: 'times-circle',
            accepted: 'check-circle'
        };
        return icons[status] || 'circle';
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    showNotification(message, type = 'info') {
        // Remove existing notification if any
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.jobTracker = new JobTracker();
});

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .no-data {
        text-align: center;
        padding: 3rem 1rem;
        color: #666;
        grid-column: 1 / -1;
    }
    
    .application-notes,
    .contact-notes {
        color: #666;
        font-style: italic;
        margin: 0.5rem 0;
        padding: 0.5rem;
        background: #f8f9fa;
        border-radius: 4px;
        border-left: 3px solid #667eea;
    }
`;
document.head.appendChild(style);

