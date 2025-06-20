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

        // Print button
        document.getElementById('printBtn').addEventListener('click', () => {
            this.openPrintModal();
        });

        // Print modal controls
        document.getElementById('closePrintModal').addEventListener('click', () => {
            this.closePrintModal();
        });

        document.getElementById('cancelPrintBtn').addEventListener('click', () => {
            this.closePrintModal();
        });

        document.getElementById('generatePrintBtn').addEventListener('click', () => {
            this.generatePrintView();
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
        
        // Populate contact information if available
        document.getElementById('contactPersonName').value = application.contactName || '';
        document.getElementById('contactPersonTitle').value = application.contactTitle || '';
        document.getElementById('contactPersonEmail').value = application.contactEmail || '';
        document.getElementById('contactPersonPhone').value = application.contactPhone || '';
        document.getElementById('contactPersonLinkedIn').value = application.contactLinkedIn || '';
        
        // Populate interview information if available
        document.getElementById('interviewDate').value = application.interviewDate || '';
        document.getElementById('interviewTime').value = application.interviewTime || '';
        document.getElementById('interviewType').value = application.interviewType || 'phone';
        document.getElementById('interviewDuration').value = application.interviewDuration || 60;
        document.getElementById('interviewLocation').value = application.interviewLocation || '';
        document.getElementById('interviewNotes').value = application.interviewNotes || '';
        
        // Toggle interview fields based on status
        this.toggleInterviewFields();
    }

    toggleInterviewFields() {
        const status = document.getElementById('status').value;
        const interviewSection = document.getElementById('interviewSection');
        
        if (status === 'interview') {
            interviewSection.style.display = 'block';
        } else {
            interviewSection.style.display = 'none';
        }
    }

    saveApplication() {
        const formData = {
            jobTitle: document.getElementById('jobTitle').value,
            company: document.getElementById('company').value,
            location: document.getElementById('location').value,
            salary: document.getElementById('salary').value,
            status: document.getElementById('status').value,
            jobUrl: document.getElementById('jobUrl').value,
            notes: document.getElementById('notes').value,
            // Contact information from application form
            contactName: document.getElementById('contactPersonName').value,
            contactTitle: document.getElementById('contactPersonTitle').value,
            contactEmail: document.getElementById('contactPersonEmail').value,
            contactPhone: document.getElementById('contactPersonPhone').value,
            contactLinkedIn: document.getElementById('contactPersonLinkedIn').value,
            // Interview information from application form
            interviewDate: document.getElementById('interviewDate').value,
            interviewTime: document.getElementById('interviewTime').value,
            interviewType: document.getElementById('interviewType').value,
            interviewDuration: document.getElementById('interviewDuration').value,
            interviewLocation: document.getElementById('interviewLocation').value,
            interviewNotes: document.getElementById('interviewNotes').value
        };

        // If contact information is provided, add/update contact
        if (formData.contactName.trim()) {
            this.handleContactFromApplication(formData);
        }

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
        this.renderContacts();
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
            <div class="application-card slide-up ${app.status === 'interview' && app.interviewDate ? 'interview-scheduled' : ''}">
                <div class="application-status status-${app.status}">${app.status}</div>
                <div class="application-header">
                    <h3>${app.jobTitle}</h3>
                </div>
                <div class="application-company">${app.company}</div>
                <div class="application-details">
                    ${app.location ? `<span><i class="fas fa-map-marker-alt"></i> ${app.location}</span>` : ''}
                    ${app.salary ? `<span><i class="fas fa-dollar-sign"></i> ${app.salary}</span>` : ''}
                    <span><i class="fas fa-calendar"></i> Added ${this.formatDate(app.dateAdded)}</span>
                    ${app.contactName ? `<span><i class="fas fa-user"></i> Contact: ${this.capitalizeWords(app.contactName)}${app.contactTitle ? ` (${this.capitalizeWords(app.contactTitle)})` : ''}</span>` : ''}
                    ${this.getInterviewDetailsHtml(app)}
                </div>
                ${app.notes ? `<p class="application-notes">${app.notes}</p>` : ''}
                ${app.interviewNotes && app.status === 'interview' ? `<p class="interview-notes"><i class="fas fa-sticky-note"></i> <strong>Interview Notes:</strong> ${app.interviewNotes}</p>` : ''}
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
                    ${app.interviewLocation && app.status === 'interview' ? `<a href="${app.interviewLocation.includes('http') ? app.interviewLocation : '#'}" target="_blank" class="btn-secondary interview-link">
                        <i class="fas fa-${app.interviewType === 'video' ? 'video' : app.interviewType === 'phone' ? 'phone' : 'map-marker-alt'}"></i> ${app.interviewType === 'video' ? 'Join Call' : app.interviewType === 'phone' ? 'Call' : 'Location'}
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

        // Sort contacts alphabetically by name
        const sortedContacts = [...this.contacts].sort((a, b) => 
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );

        grid.innerHTML = sortedContacts.map(contact => `
            <div class="contact-card slide-up">
                <div class="contact-header">
                    <div class="contact-avatar">
                        ${this.capitalizeWords(contact.name).charAt(0).toUpperCase()}
                    </div>
                    <div class="contact-info">
                        <h3>${this.capitalizeWords(contact.name)}</h3>
                        ${contact.title ? `<div class="contact-title">${this.capitalizeWords(contact.title)}</div>` : ''}
                    </div>
                </div>
                <div class="contact-details">
                    ${contact.company ? `<p><i class="fas fa-building"></i> ${this.capitalizeWords(contact.company)}</p>` : ''}
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

    // Print functionality
    openPrintModal() {
        const modal = document.getElementById('printModal');
        this.updatePrintCounts();
        modal.classList.add('active');
    }

    closePrintModal() {
        const modal = document.getElementById('printModal');
        modal.classList.remove('active');
    }

    updatePrintCounts() {
        document.getElementById('appCount').textContent = `${this.applications.length} applications`;
        document.getElementById('contactCount').textContent = `${this.contacts.length} contacts`;
    }

    generatePrintView() {
        const includeApplications = document.getElementById('printApplications').checked;
        const includeContacts = document.getElementById('printContacts').checked;
        const includeAnalytics = document.getElementById('printAnalytics').checked;
        const format = document.querySelector('input[name="printFormat"]:checked').value;

        if (!includeApplications && !includeContacts && !includeAnalytics) {
            this.showNotification('Please select at least one category to print', 'error');
            return;
        }

        let printContent = this.generatePrintContent({
            includeApplications,
            includeContacts,
            includeAnalytics,
            format
        });

        // Create print window
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>JobTracker Pro - Report</title>
                <style>
                    ${this.getPrintStyles()}
                </style>
            </head>
            <body class="print-content">
                ${printContent}
            </body>
            </html>
        `);
        printWindow.document.close();
        
        // Wait for content to load then print
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);

        this.closePrintModal();
        this.showNotification('Print view generated successfully', 'success');
    }

    generatePrintContent(options) {
        const { includeApplications, includeContacts, includeAnalytics, format } = options;
        const now = new Date();
        const dateString = now.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        let content = `
            <div class="print-header">
                <h1>JobTracker Pro - Career Report</h1>
                <p>Generated on ${dateString}</p>
                <p>Total Applications: ${this.applications.length} | Total Contacts: ${this.contacts.length}</p>
            </div>
        `;

        if (includeApplications) {
            content += this.generateApplicationsPrintSection(format);
        }

        if (includeContacts) {
            content += this.generateContactsPrintSection(format);
        }

        if (includeAnalytics) {
            content += this.generateAnalyticsPrintSection();
        }

        return content;
    }

    generateApplicationsPrintSection(format) {
        if (this.applications.length === 0) {
            return `
                <div class="print-section">
                    <h2>Job Applications</h2>
                    <p>No applications found.</p>
                </div>
            `;
        }

        const sortedApps = [...this.applications].sort((a, b) => 
            new Date(b.dateAdded) - new Date(a.dateAdded)
        );

        if (format === 'table') {
            return `
                <div class="print-section">
                    <h2>Job Applications (${this.applications.length})</h2>
                    <table class="print-table">
                        <thead>
                            <tr>
                                <th>Job Title</th>
                                <th>Company</th>
                                <th>Status</th>
                                <th>Location</th>
                                <th>Salary</th>
                                <th>Date Added</th>
                                <th>Contact</th>
                                <th>Interview</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${sortedApps.map(app => `
                                <tr>
                                    <td><strong>${app.jobTitle}</strong></td>
                                    <td>${app.company}</td>
                                    <td class="status-${app.status}">${this.capitalizeWords(app.status)}</td>
                                    <td>${app.location || '-'}</td>
                                    <td>${app.salary || '-'}</td>
                                    <td>${new Date(app.dateAdded).toLocaleDateString()}</td>
                                    <td>${app.contactName ? `${this.capitalizeWords(app.contactName)}${app.contactTitle ? ` (${this.capitalizeWords(app.contactTitle)})` : ''}` : '-'}</td>
                                    <td>${app.status === 'interview' && app.interviewDate ? `${new Date(app.interviewDate).toLocaleDateString()}${app.interviewTime ? ` ${app.interviewTime}` : ''}` : '-'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        } else {
            return `
                <div class="print-section">
                    <h2>Job Applications (${this.applications.length})</h2>
                    ${sortedApps.map(app => `
                        <div class="print-card">
                            <h3>${app.jobTitle} - ${app.company}</h3>
                            <p><strong>Status:</strong> ${this.capitalizeWords(app.status)}</p>
                            ${app.location ? `<p><strong>Location:</strong> ${app.location}</p>` : ''}
                            ${app.salary ? `<p><strong>Salary:</strong> ${app.salary}</p>` : ''}
                            <p><strong>Date Added:</strong> ${new Date(app.dateAdded).toLocaleDateString()}</p>
                            ${app.contactName ? `<p><strong>Contact:</strong> ${this.capitalizeWords(app.contactName)}${app.contactTitle ? ` (${this.capitalizeWords(app.contactTitle)})` : ''}</p>` : ''}
                            ${app.status === 'interview' && app.interviewDate ? `<p><strong>Interview:</strong> ${new Date(app.interviewDate).toLocaleDateString()}${app.interviewTime ? ` at ${app.interviewTime}` : ''}${app.interviewType ? ` (${this.capitalizeWords(app.interviewType.replace('-', ' '))})` : ''}</p>` : ''}
                            ${app.notes ? `<p><strong>Notes:</strong> ${app.notes}</p>` : ''}
                            ${app.jobUrl ? `<p><strong>Job URL:</strong> ${app.jobUrl}</p>` : ''}
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }

    generateContactsPrintSection(format) {
        if (this.contacts.length === 0) {
            return `
                <div class="print-section">
                    <h2>Professional Contacts</h2>
                    <p>No contacts found.</p>
                </div>
            `;
        }

        const sortedContacts = [...this.contacts].sort((a, b) => 
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );

        if (format === 'table') {
            return `
                <div class="print-section page-break">
                    <h2>Professional Contacts (${this.contacts.length})</h2>
                    <table class="print-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Title</th>
                                <th>Company</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>LinkedIn</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${sortedContacts.map(contact => `
                                <tr>
                                    <td><strong>${this.capitalizeWords(contact.name)}</strong></td>
                                    <td>${contact.title ? this.capitalizeWords(contact.title) : '-'}</td>
                                    <td>${contact.company ? this.capitalizeWords(contact.company) : '-'}</td>
                                    <td>${contact.email || '-'}</td>
                                    <td>${contact.phone || '-'}</td>
                                    <td>${contact.linkedIn ? 'Yes' : '-'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        } else {
            return `
                <div class="print-section page-break">
                    <h2>Professional Contacts (${this.contacts.length})</h2>
                    ${sortedContacts.map(contact => `
                        <div class="print-card">
                            <h3>${this.capitalizeWords(contact.name)}</h3>
                            ${contact.title ? `<p><strong>Title:</strong> ${this.capitalizeWords(contact.title)}</p>` : ''}
                            ${contact.company ? `<p><strong>Company:</strong> ${this.capitalizeWords(contact.company)}</p>` : ''}
                            ${contact.email ? `<p><strong>Email:</strong> ${contact.email}</p>` : ''}
                            ${contact.phone ? `<p><strong>Phone:</strong> ${contact.phone}</p>` : ''}
                            ${contact.linkedIn ? `<p><strong>LinkedIn:</strong> ${contact.linkedIn}</p>` : ''}
                            ${contact.notes ? `<p><strong>Notes:</strong> ${contact.notes}</p>` : ''}
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }

    generateAnalyticsPrintSection() {
        const stats = this.calculateStats();
        const statusCounts = this.getStatusCounts();
        const insights = this.calculateInsights();

        return `
            <div class="print-section page-break">
                <h2>Analytics Summary</h2>
                <div class="analytics-summary">
                    <h3>Key Statistics</h3>
                    <ul>
                        <li>Total Applications: ${stats.totalApplications}</li>
                        <li>Interviews Scheduled: ${stats.interviewsScheduled}</li>
                        <li>Offers Received: ${stats.offersReceived}</li>
                        <li>Response Rate: ${stats.responseRate}%</li>
                    </ul>
                    
                    <h3>Status Breakdown</h3>
                    <ul>
                        ${Object.entries(statusCounts).filter(([status, count]) => count > 0).map(([status, count]) => 
                            `<li>${this.capitalizeWords(status)}: ${count}</li>`
                        ).join('')}
                    </ul>
                    
                    <h3>Key Insights</h3>
                    <ul>
                        ${insights.map(insight => 
                            `<li><strong>${insight.title}:</strong> ${insight.message}</li>`
                        ).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    getPrintStyles() {
        return `
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Arial', sans-serif;
                line-height: 1.4;
                color: #333;
                font-size: 12px;
            }
            
            .print-header {
                text-align: center;
                margin-bottom: 2rem;
                border-bottom: 2px solid #333;
                padding-bottom: 1rem;
            }
            
            .print-header h1 {
                font-size: 24px;
                margin-bottom: 0.5rem;
                color: #2c3e50;
            }
            
            .print-section {
                margin-bottom: 2rem;
                page-break-inside: avoid;
            }
            
            .print-section h2 {
                color: #333;
                margin-bottom: 1rem;
                font-size: 18px;
                border-bottom: 1px solid #ddd;
                padding-bottom: 0.5rem;
            }
            
            .print-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 1rem;
                font-size: 10px;
            }
            
            .print-table th,
            .print-table td {
                border: 1px solid #333;
                padding: 6px;
                text-align: left;
                vertical-align: top;
            }
            
            .print-table th {
                background-color: #f0f0f0;
                font-weight: bold;
                font-size: 11px;
            }
            
            .print-card {
                border: 1px solid #ddd;
                padding: 1rem;
                margin-bottom: 1rem;
                border-radius: 4px;
                page-break-inside: avoid;
            }
            
            .print-card h3 {
                margin-bottom: 0.5rem;
                color: #2c3e50;
                font-size: 14px;
            }
            
            .print-card p {
                margin-bottom: 0.25rem;
                font-size: 11px;
            }
            
            .status-interested { background-color: #e3f2fd !important; }
            .status-applied { background-color: #f3e5f5 !important; }
            .status-interview { background-color: #fff3e0 !important; }
            .status-offer { background-color: #e8f5e8 !important; }
            .status-rejected { background-color: #ffebee !important; }
            .status-accepted { background-color: #e8f5e8 !important; }
            
            .page-break {
                page-break-before: always;
            }
            
            .analytics-summary ul {
                margin-left: 1rem;
                margin-bottom: 1rem;
            }
            
            .analytics-summary li {
                margin-bottom: 0.25rem;
            }
            
            @media print {
                body {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
            }
        `;
    }

    // Handle contact creation from applications
    handleContactFromApplication(formData) {
        // Check if contact already exists
        const existingContact = this.contacts.find(contact => 
            contact.email && contact.email.toLowerCase() === formData.contactEmail.toLowerCase() ||
            contact.name.toLowerCase() === formData.contactName.toLowerCase() && 
            contact.company && contact.company.toLowerCase() === formData.company.toLowerCase()
        );

        if (existingContact) {
            // Update existing contact with any new information
            let updated = false;
            if (formData.contactTitle && !existingContact.title) {
                existingContact.title = formData.contactTitle;
                updated = true;
            }
            if (formData.contactPhone && !existingContact.phone) {
                existingContact.phone = formData.contactPhone;
                updated = true;
            }
            if (formData.contactLinkedIn && !existingContact.linkedIn) {
                existingContact.linkedIn = formData.contactLinkedIn;
                updated = true;
            }
            if (!existingContact.company) {
                existingContact.company = formData.company;
                updated = true;
            }
            
            if (updated) {
                existingContact.dateModified = new Date().toISOString();
                this.showNotification('Contact updated with application info', 'success');
            }
        } else {
            // Create new contact
            const newContact = {
                id: this.generateId(),
                name: formData.contactName,
                title: formData.contactTitle || '',
                company: formData.company,
                email: formData.contactEmail || '',
                phone: formData.contactPhone || '',
                linkedIn: formData.contactLinkedIn || '',
                notes: `Contact added from application: ${formData.jobTitle} at ${formData.company}`,
                dateAdded: new Date().toISOString(),
                dateModified: new Date().toISOString()
            };
            this.contacts.push(newContact);
            this.showNotification('New contact created from application', 'success');
        }
    }

    // Utility Functions
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    capitalizeWords(str) {
        if (!str) return '';
        return str.toLowerCase().split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
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

    getInterviewDetailsHtml(app) {
        if (app.status !== 'interview' || !app.interviewDate) {
            return '';
        }
        
        const interviewDate = new Date(app.interviewDate);
        const now = new Date();
        const isToday = interviewDate.toDateString() === now.toDateString();
        const isTomorrow = interviewDate.toDateString() === new Date(now.getTime() + 24*60*60*1000).toDateString();
        
        let dateDisplay = '';
        if (isToday) {
            dateDisplay = 'Today';
        } else if (isTomorrow) {
            dateDisplay = 'Tomorrow';
        } else {
            dateDisplay = interviewDate.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
            });
        }
        
        const timeDisplay = app.interviewTime ? 
            new Date(`2000-01-01T${app.interviewTime}`).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }) : '';
            
        const typeIcons = {
            phone: 'phone',
            video: 'video',
            'in-person': 'map-marker-alt',
            panel: 'users',
            technical: 'code'
        };
        
        return `
            <div class="interview-details">
                <span class="interview-date"><i class="fas fa-calendar-alt"></i> <strong>Interview:</strong> ${dateDisplay}${timeDisplay ? ` at ${timeDisplay}` : ''}</span>
                ${app.interviewType ? `<span class="interview-type"><i class="fas fa-${typeIcons[app.interviewType] || 'question'}"></i> ${this.capitalizeWords(app.interviewType.replace('-', ' '))}${app.interviewDuration ? ` (${app.interviewDuration} min)` : ''}</span>` : ''}
                ${app.interviewLocation ? `<span class="interview-location"><i class="fas fa-${app.interviewType === 'video' ? 'link' : 'map-marker-alt'}"></i> ${app.interviewLocation.length > 40 ? app.interviewLocation.substring(0, 40) + '...' : app.interviewLocation}</span>` : ''}
            </div>
        `;
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
    
    // Initialize footer date/time
    updateFooterDateTime();
    setInterval(updateFooterDateTime, 1000);
});

// Update footer with current date and time and handle interview timing
function updateFooterDateTime() {
    const footerDatetime = document.getElementById('footer-datetime');
    if (footerDatetime) {
        const now = new Date();
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        };
        footerDatetime.textContent = now.toLocaleDateString('en-US', options);
        
        // Check for interview timing and apply clock styling
        const clockStatus = getInterviewClockStatus();
        footerDatetime.className = clockStatus;
    }
}

// Check interview timing and return appropriate clock styling
function getInterviewClockStatus() {
    if (!window.jobTracker || !window.jobTracker.applications) {
        return '';
    }
    
    const now = new Date();
    const interviews = window.jobTracker.applications.filter(app => 
        app.status === 'interview' && app.interviewDate && app.interviewTime
    );
    
    for (const interview of interviews) {
        const interviewDateTime = new Date(`${interview.interviewDate}T${interview.interviewTime}`);
        const duration = parseInt(interview.interviewDuration) || 60; // Default 60 minutes
        const oneHourBefore = new Date(interviewDateTime.getTime() - (60 * 60 * 1000));
        const interviewEnd = new Date(interviewDateTime.getTime() + (duration * 60 * 1000));
        
        // Red flash: 1 hour before interview
        if (now >= oneHourBefore && now < interviewDateTime) {
            return 'clock-warning';
        }
        
        // Green flash: During interview time
        if (now >= interviewDateTime && now <= interviewEnd) {
            return 'clock-active';
        }
    }
    
    return '';
}

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

