// Portable Data Manager Template
// Copy this file to any project folder and customize for your specific needs

class PortableDataManager {
    constructor(projectName) {
        this.projectName = projectName;
        this.dataFileName = `${projectName}-data.json`;
        this.data = null;
        this.autoSaveEnabled = true;
        
        // Try to load data on initialization
        this.loadData();
    }

    // Export data to a downloadable JSON file with instructions
    exportData() {
        const data = this.getAllData();
        const exportData = {
            ...data,
            metadata: {
                ...data.metadata,
                exported: new Date().toISOString(),
                version: '1.0.0'
            }
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
            type: 'application/json' 
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.dataFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Show instructions for file placement
        this.showFileInstructions();
        
        console.log(`Data exported to ${this.dataFileName}`);
        return true;
    }

    // Import data from a user-selected JSON file
    importData() {
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) {
                    reject('No file selected');
                    return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const importedData = JSON.parse(e.target.result);
                        
                        // Validate data structure
                        if (this.validateData(importedData)) {
                            this.data = importedData;
                            this.saveToLocalStorage();
                            console.log('Data imported successfully');
                            resolve(importedData);
                        } else {
                            reject('Invalid data format for this application');
                        }
                    } catch (error) {
                        reject('Error parsing JSON file');
                    }
                };
                
                reader.readAsText(file);
            };
            
            input.click();
        });
    }

    // Get all data (from memory, localStorage, or default)
    getAllData() {
        if (this.data) {
            return this.data;
        }
        
        // Fallback to localStorage
        const stored = localStorage.getItem(`${this.projectName}Data`);
        if (stored) {
            try {
                this.data = JSON.parse(stored);
                return this.data;
            } catch (error) {
                console.warn('Error parsing localStorage data');
            }
        }
        
        // Return default structure
        return this.getDefaultData();
    }

    // Save data (to memory and localStorage)
    saveData(newData) {
        this.data = {
            ...newData,
            metadata: {
                ...newData.metadata,
                lastModified: new Date().toISOString()
            }
        };
        this.saveToLocalStorage();
        
        if (this.autoSaveEnabled) {
            this.showAutoExportReminder();
        }
    }

    // Save to localStorage as backup
    saveToLocalStorage() {
        localStorage.setItem(`${this.projectName}Data`, JSON.stringify(this.data));
    }

    // Load data from project folder (if available) or localStorage
    async loadData() {
        // First try to load from project folder
        const projectData = await this.loadFromProjectFolder();
        if (projectData) {
            this.data = projectData;
            console.log(`Loaded data from project folder: ${this.dataFileName}`);
            return;
        }
        
        // Fallback to localStorage
        const stored = localStorage.getItem(`${this.projectName}Data`);
        if (stored) {
            try {
                this.data = JSON.parse(stored);
                console.log('Loaded data from localStorage (fallback)');
            } catch (error) {
                console.warn('Error loading data from localStorage');
                this.data = this.getDefaultData();
            }
        } else {
            this.data = this.getDefaultData();
            console.log('Using default data structure');
        }
    }
    
    // Try to load data from project folder
    async loadFromProjectFolder() {
        try {
            const response = await fetch(this.dataFileName);
            if (response.ok) {
                const data = await response.json();
                if (this.validateData(data)) {
                    return data;
                } else {
                    console.warn('Invalid data format in project file');
                }
            }
        } catch (error) {
            // File doesn't exist or can't be loaded - this is normal
            console.log(`No project data file found (${this.dataFileName}) - using localStorage or defaults`);
        }
        return null;
    }
    
    // Load data from localStorage (legacy method)
    loadFromLocalStorage() {
        const stored = localStorage.getItem(`${this.projectName}Data`);
        if (stored) {
            try {
                this.data = JSON.parse(stored);
            } catch (error) {
                console.warn('Error loading data from localStorage');
                this.data = this.getDefaultData();
            }
        } else {
            this.data = this.getDefaultData();
        }
    }

    // Validate imported data structure - CUSTOMIZE THIS FOR YOUR PROJECT
    validateData(data) {
        // Basic validation - override this method in specific implementations
        return data && typeof data === 'object' && data.metadata;
    }

    // Get default data structure - CUSTOMIZE THIS FOR YOUR PROJECT
    getDefaultData() {
        return {
            items: [],
            settings: {},
            metadata: {
                created: new Date().toISOString(),
                version: '1.0.0',
                projectType: this.projectName
            }
        };
    }

    // Show reminder to export data periodically
    showAutoExportReminder() {
        const lastReminder = localStorage.getItem(`${this.projectName}LastExportReminder`);
        const now = Date.now();
        const oneWeek = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
        
        if (!lastReminder || (now - parseInt(lastReminder)) > oneWeek) {
            setTimeout(() => {
                if (confirm('💾 Would you like to export your data as a backup file? This helps keep your data portable across devices.')) {
                    this.exportData();
                }
                localStorage.setItem(`${this.projectName}LastExportReminder`, now.toString());
            }, 2000);
        }
    }

    // Clear all data
    clearAllData() {
        if (confirm('⚠️ Are you sure you want to clear all data? This cannot be undone!')) {
            this.data = this.getDefaultData();
            this.saveToLocalStorage();
            localStorage.removeItem(`${this.projectName}LastExportReminder`);
            return true;
        }
        return false;
    }

    // Check if data exists
    hasData() {
        const data = this.getAllData();
        return data.items && data.items.length > 0;
    }

    // Show instructions for file placement
    showFileInstructions() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        
        modal.innerHTML = `
            <div style="
                background: white;
                padding: 30px;
                border-radius: 15px;
                max-width: 500px;
                margin: 20px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            ">
                <h2 style="margin: 0 0 20px 0; color: #2c3e50;">📁 File Downloaded!</h2>
                
                <div style="
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 10px;
                    border-left: 4px solid #007bff;
                    margin: 15px 0;
                ">
                    <h3 style="margin: 0 0 10px 0; color: #495057;">To make your data portable:</h3>
                    <ol style="margin: 10px 0; padding-left: 25px; color: #495057; line-height: 1.6;">
                        <li style="margin-bottom: 8px;">Go to your Downloads folder</li>
                        <li style="margin-bottom: 8px;">Find the file: <strong>${this.dataFileName}</strong></li>
                        <li style="margin-bottom: 8px;">Copy it to your project folder</li>
                        <li style="margin-bottom: 8px;">The file will be automatically loaded next time!</li>
                    </ol>
                </div>
                
                <div style="
                    background: #e8f5e8;
                    padding: 15px;
                    border-radius: 8px;
                    margin: 15px 0;
                ">
                    <strong style="color: #28a745;">✅ Benefits:</strong>
                    <ul style="margin: 5px 0; padding-left: 25px; color: #28a745;">
                        <li style="margin-bottom: 5px;">Data works on any computer</li>
                        <li style="margin-bottom: 5px;">Copy project folder anywhere</li>
                        <li style="margin-bottom: 5px;">No browser dependency</li>
                    </ul>
                </div>
                
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: #007bff;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                    width: 100%;
                    margin-top: 10px;
                ">Got it!</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Remove modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    // Migrate legacy localStorage data - CUSTOMIZE THIS FOR YOUR PROJECT
    migrateLegacyData(legacyKey) {
        const legacyData = localStorage.getItem(legacyKey);
        if (legacyData) {
            try {
                const oldData = JSON.parse(legacyData);
                const newData = this.getDefaultData();
                
                // Customize this migration logic for your specific data structure
                if (Array.isArray(oldData)) {
                    newData.items = oldData;
                } else if (oldData.items) {
                    newData.items = oldData.items;
                }
                
                newData.metadata.migrated = new Date().toISOString();
                newData.metadata.migratedFrom = legacyKey;
                
                this.saveData(newData);
                
                // Keep legacy data for safety
                localStorage.setItem(`${legacyKey}_backup`, legacyData);
                console.log(`Legacy data migrated from ${legacyKey} to new format`);
                return true;
            } catch (error) {
                console.warn('Error migrating legacy data');
            }
        }
        return false;
    }
}

// Usage Example:
/*
// 1. Initialize the data manager
const dataManager = new PortableDataManager('myProject');

// 2. Migrate any existing data (optional)
dataManager.migrateLegacyData('oldDataKey');

// 3. Get data
const myData = dataManager.getAllData();

// 4. Save data
const newData = {
    items: [...myData.items, newItem],
    settings: myData.settings,
    metadata: myData.metadata
};
dataManager.saveData(newData);

// 5. Add export/import buttons to your HTML:
<button onclick="dataManager.exportData()">💾 Export Data</button>
<button onclick="dataManager.importData().then(() => location.reload())">📂 Import Data</button>
<button onclick="if(dataManager.clearAllData()) location.reload()">🗑️ Clear Data</button>
*/

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortableDataManager;
}

