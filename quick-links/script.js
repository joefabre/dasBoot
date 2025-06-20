// Quick Links - JavaScript Functionality

class QuickLinksManager {
    constructor() {
        this.links = this.loadLinks();
        this.filteredLinks = [...this.links];
        this.init();
    }

    init() {
        this.updateDateTime();
        this.setupEventListeners();
        this.renderLinks();
        this.updateStats();
        
        // Update time every second
        setInterval(() => this.updateDateTime(), 1000);
    }

    updateDateTime() {
        const now = new Date();
        const dateDisplay = document.getElementById('dateDisplay');
        const timeDisplay = document.getElementById('timeDisplay');
        
        if (dateDisplay && timeDisplay) {
            dateDisplay.textContent = now.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            timeDisplay.textContent = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        }
    }

    setupEventListeners() {
        // Form submission
        const form = document.getElementById('addLinkForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleAddLink(e));
        }

        // Filter controls
        const categoryFilter = document.getElementById('categoryFilter');
        const searchInput = document.getElementById('searchLinks');
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.applyFilters());
        }
        
        if (searchInput) {
            searchInput.addEventListener('input', () => this.applyFilters());
        }
    }

    handleAddLink(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        
        const newLink = {
            id: Date.now().toString(),
            title: formData.get('title').trim(),
            url: formData.get('url').trim(),
            description: formData.get('description').trim(),
            category: formData.get('category'),
            dateAdded: new Date().toISOString(),
            clicks: 0
        };

        // Validate URL
        if (!this.isValidUrl(newLink.url)) {
            this.showMessage('Please enter a valid URL starting with http:// or https://', 'error');
            return;
        }

        // Add to links array
        this.links.push(newLink);
        this.saveLinks();
        this.applyFilters();
        this.updateStats();
        
        // Clear form
        form.reset();
        
        // Show success message
        this.showMessage('Link added successfully!', 'success');
        
        // Scroll to links section
        document.getElementById('links-heading').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    showMessage(text, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());

        // Create new message
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;

        // Insert at top of add-link-section
        const section = document.querySelector('.add-link-section');
        if (section) {
            section.insertBefore(message, section.firstChild);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (message.parentNode) {
                    message.remove();
                }
            }, 5000);
        }
    }

    applyFilters() {
        const categoryFilter = document.getElementById('categoryFilter');
        const searchInput = document.getElementById('searchLinks');
        
        let filtered = [...this.links];

        // Apply category filter
        if (categoryFilter && categoryFilter.value !== 'all') {
            filtered = filtered.filter(link => link.category === categoryFilter.value);
        }

        // Apply search filter
        if (searchInput && searchInput.value.trim()) {
            const searchTerm = searchInput.value.trim().toLowerCase();
            filtered = filtered.filter(link => 
                link.title.toLowerCase().includes(searchTerm) ||
                link.description.toLowerCase().includes(searchTerm) ||
                link.url.toLowerCase().includes(searchTerm)
            );
        }

        this.filteredLinks = filtered;
        this.renderLinks();
    }

    renderLinks() {
        const container = document.getElementById('linksContainer');
        const emptyState = document.getElementById('emptyState');
        
        if (!container) return;

        // Clear existing content except empty state
        const linkCards = container.querySelectorAll('.link-card');
        linkCards.forEach(card => card.remove());

        if (this.filteredLinks.length === 0) {
            if (emptyState) {
                emptyState.style.display = 'block';
            }
            return;
        }

        if (emptyState) {
            emptyState.style.display = 'none';
        }

        // Render links
        this.filteredLinks
            .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
            .forEach(link => {
                const linkCard = this.createLinkCard(link);
                container.appendChild(linkCard);
            });
    }

    createLinkCard(link) {
        const card = document.createElement('div');
        card.className = 'link-card new';
        card.setAttribute('role', 'listitem');
        
        const dateAdded = new Date(link.dateAdded);
        const formattedDate = dateAdded.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        card.innerHTML = `
            <div class="link-header">
                <div>
                    <h3 class="link-title">${this.escapeHtml(link.title)}</h3>
                </div>
                <span class="link-category ${link.category}">${link.category}</span>
            </div>
            
            ${link.description ? `<p class="link-description">${this.escapeHtml(link.description)}</p>` : ''}
            
            <a href="${this.escapeHtml(link.url)}" class="link-url" target="_blank" rel="noopener noreferrer" 
               onclick="linkManager.incrementClick('${link.id}')" 
               aria-label="Open ${this.escapeHtml(link.title)} in new tab">
                ${this.escapeHtml(link.url)}
            </a>
            
            <div class="link-actions">
                <button class="link-action copy" onclick="linkManager.copyToClipboard('${this.escapeHtml(link.url)}')" 
                        aria-label="Copy link URL to clipboard" title="Copy URL">
                    📋
                </button>
                <button class="link-action delete" onclick="linkManager.deleteLink('${link.id}')" 
                        aria-label="Delete this link" title="Delete Link">
                    🗑️
                </button>
            </div>
            
            <div class="link-meta">
                Added: ${formattedDate} • Clicks: ${link.clicks}
            </div>
        `;

        // Remove animation class after animation completes
        setTimeout(() => {
            card.classList.remove('new');
        }, 500);

        return card;
    }

    incrementClick(linkId) {
        const link = this.links.find(l => l.id === linkId);
        if (link) {
            link.clicks++;
            this.saveLinks();
            this.updateStats();
        }
    }

    async copyToClipboard(url) {
        try {
            await navigator.clipboard.writeText(url);
            this.showMessage('URL copied to clipboard!', 'success');
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showMessage('URL copied to clipboard!', 'success');
        }
    }

    deleteLink(linkId) {
        if (confirm('Are you sure you want to delete this link?')) {
            this.links = this.links.filter(link => link.id !== linkId);
            this.saveLinks();
            this.applyFilters();
            this.updateStats();
            this.showMessage('Link deleted successfully!', 'success');
        }
    }

    updateStats() {
        const totalLinks = document.getElementById('totalLinks');
        const categoriesCount = document.getElementById('categoriesCount');
        const recentlyAdded = document.getElementById('recentlyAdded');

        if (totalLinks) {
            totalLinks.textContent = this.links.length;
        }

        if (categoriesCount) {
            const uniqueCategories = [...new Set(this.links.map(link => link.category))];
            categoriesCount.textContent = uniqueCategories.length;
        }

        if (recentlyAdded) {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            
            const recentLinks = this.links.filter(link => 
                new Date(link.dateAdded) > oneWeekAgo
            );
            recentlyAdded.textContent = recentLinks.length;
        }
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    loadLinks() {
        try {
            const stored = localStorage.getItem('quickLinks');
            return stored ? JSON.parse(stored) : this.getDefaultLinks();
        } catch (error) {
            console.error('Error loading links:', error);
            return this.getDefaultLinks();
        }
    }

    saveLinks() {
        try {
            localStorage.setItem('quickLinks', JSON.stringify(this.links));
        } catch (error) {
            console.error('Error saving links:', error);
            this.showMessage('Error saving links. Please try again.', 'error');
        }
    }

    getDefaultLinks() {
        return [
            {
                id: '1',
                title: 'GitHub',
                url: 'https://github.com',
                description: 'Version control and collaboration platform',
                category: 'tools',
                dateAdded: new Date().toISOString(),
                clicks: 0
            },
            {
                id: '2',
                title: 'Stack Overflow',
                url: 'https://stackoverflow.com',
                description: 'Programming Q&A community',
                category: 'education',
                dateAdded: new Date().toISOString(),
                clicks: 0
            },
            {
                id: '3',
                title: 'MDN Web Docs',
                url: 'https://developer.mozilla.org',
                description: 'Web development documentation',
                category: 'education',
                dateAdded: new Date().toISOString(),
                clicks: 0
            }
        ];
    }

    // Export/Import functionality
    exportLinks() {
        const dataStr = JSON.stringify(this.links, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `quick-links-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showMessage('Links exported successfully!', 'success');
    }

    importLinks(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedLinks = JSON.parse(e.target.result);
                
                if (Array.isArray(importedLinks)) {
                    // Merge with existing links, avoiding duplicates by URL
                    const existingUrls = new Set(this.links.map(link => link.url));
                    const newLinks = importedLinks.filter(link => !existingUrls.has(link.url));
                    
                    this.links.push(...newLinks);
                    this.saveLinks();
                    this.applyFilters();
                    this.updateStats();
                    
                    this.showMessage(`Successfully imported ${newLinks.length} new links!`, 'success');
                } else {
                    throw new Error('Invalid file format');
                }
            } catch (error) {
                console.error('Import error:', error);
                this.showMessage('Error importing links. Please check the file format.', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize the application
let linkManager;

document.addEventListener('DOMContentLoaded', () => {
    linkManager = new QuickLinksManager();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('searchLinks');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Ctrl/Cmd + N to focus title input
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        const titleInput = document.getElementById('linkTitle');
        if (titleInput) {
            titleInput.focus();
        }
    }
});

