// Summer Activities Planner App
class SummerActivitiesPlanner {
    constructor() {
        this.activityList = JSON.parse(localStorage.getItem('summerActivities')) || [];
        this.commandInput = document.getElementById('command-input');
        this.display = document.getElementById('activities-display');
        this.addForm = document.getElementById('add-form');
        this.editForm = document.getElementById('edit-form');
        this.completeForm = document.getElementById('complete-form');
        this.editingItemId = null;
        this.completingItemId = null;
        this.audioEnabled = false;
        this.currentSwitchType = 'blue'; // blue, red, brown, typewriter
        this.switchTypes = {
            blue: 'Cherry MX Blue (Clicky)',
            red: 'Cherry MX Red (Linear)',
            brown: 'Cherry MX Brown (Tactile)',
            typewriter: 'Vintage Typewriter'
        };
        
        this.initializeEventListeners();
        this.initializeWindowControls();
        this.autoMigrateIds(); // Automatically migrate old IDs on startup
        this.startClock(); // Start the real-time clock
        this.focusInput();
    }

    initializeEventListeners() {
        // Enable audio on first user interaction
        document.addEventListener('click', () => {
            this.enableAudio();
        }, { once: true });
        
        document.addEventListener('keydown', () => {
            this.enableAudio();
        }, { once: true });

        // Command input
        this.commandInput.addEventListener('keydown', (e) => {
            // Play typewriter sound for every keypress except special keys
            if (!['Shift', 'Control', 'Alt', 'Meta', 'Tab', 'CapsLock', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'].includes(e.key)) {
                this.playTypewriterSound();
            }
            
            if (e.key === 'Enter') {
                this.handleCommand(e.target.value.trim());
                e.target.value = '';
            }
        });

        // Typewriter sound on input
        this.commandInput.addEventListener('input', () => {
            this.playTypewriterSound();
        });

        // Form inputs typewriter sound
        document.querySelectorAll('.terminal-input').forEach(input => {
            input.addEventListener('keydown', (e) => {
                // Play typewriter sound for every keypress except special keys
                if (!['Shift', 'Control', 'Alt', 'Meta', 'Tab', 'CapsLock', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'].includes(e.key)) {
                    this.playTypewriterSound();
                }
            });
            
            input.addEventListener('input', () => {
                this.playTypewriterSound();
            });
        });

        // Form buttons
        document.getElementById('save-btn').addEventListener('click', () => {
            this.saveNewItem();
        });

        document.getElementById('cancel-btn').addEventListener('click', () => {
            this.hideAddForm();
        });
        
        // Edit form buttons
        document.getElementById('update-btn').addEventListener('click', () => {
            this.updateItem();
        });

        document.getElementById('cancel-edit-btn').addEventListener('click', () => {
            this.hideEditForm();
        });

        // Form submit on Enter
        document.querySelectorAll('#add-form .terminal-input').forEach(input => {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.saveNewItem();
                }
            });
        });
        
        // Edit form submit on Enter
        document.querySelectorAll('#edit-form .terminal-input').forEach(input => {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.updateItem();
                }
            });
        });
    }

    initializeWindowControls() {
        // Get window control buttons
        const closeBtn = document.querySelector('.button.close');
        const minimizeBtn = document.querySelector('.button.minimize');
        const maximizeBtn = document.querySelector('.button.maximize');
        
        // Store original window state
        this.isMinimized = false;
        this.originalBodyContent = null;
        
        // Close button functionality
        closeBtn.addEventListener('click', () => {
            this.handleClose();
        });
        
        // Minimize button functionality
        minimizeBtn.addEventListener('click', () => {
            this.handleMinimize();
        });
        
        // Maximize button functionality
        maximizeBtn.addEventListener('click', () => {
            this.handleMaximize();
        });
        
        // Remove tabindex=-1 to make buttons functional
        closeBtn.removeAttribute('tabindex');
        minimizeBtn.removeAttribute('tabindex');
        maximizeBtn.removeAttribute('tabindex');
    }
    
    handleClose() {
        // Check if this is the only tab or if there are other tabs
        // Note: Due to browser security, we can't reliably detect other tabs
        // So we'll attempt to close and provide fallback messaging
        
        this.addOutput('🔴 Attempting to close window...');
        
        // Try different close methods
        try {
            // Method 1: Close if opened by script
            if (window.opener) {
                window.close();
                return;
            }
            
            // Method 2: Try standard close
            window.close();
            
            // Method 3: If close didn't work, show instructions
            setTimeout(() => {
                if (!window.closed) {
                    this.addOutput('⚠️ Cannot close window automatically due to browser security.');
                    this.addOutput('Please use Ctrl+W (Cmd+W on Mac) or close the tab manually.');
                }
            }, 500);
            
        } catch (error) {
            this.addOutput('❌ Close operation blocked by browser. Please close tab manually.');
        }
    }
    
    handleMinimize() {
        if (this.isMinimized) {
            // Already minimized, restore
            this.handleMaximize();
            return;
        }
        
        this.addOutput('🟡 Minimizing window...');
        
        // Store current body content
        this.originalBodyContent = document.body.innerHTML;
        
        // Create minimized view
        const minimizedHTML = `
            <div class="minimized-window">
                <div class="minimized-header">
                    <div class="minimized-icon">📋</div>
                    <div class="minimized-title">Terminal Bucket List - Minimized</div>
                    <button class="restore-btn" onclick="app.handleMaximize()" aria-label="Restore window">
                        <div class="button maximize"></div>
                    </button>
                </div>
            </div>
        `;
        
        // Replace body content
        document.body.innerHTML = minimizedHTML;
        this.isMinimized = true;
        
        // Add minimized styles
        document.body.style.height = '60px';
        document.body.style.overflow = 'hidden';
    }
    
    handleMaximize() {
        if (!this.isMinimized) {
            // Not minimized, try to maximize browser window
            this.addOutput('🟢 Attempting to maximize browser window...');
            
            try {
                // Try to focus and bring window to front
                window.focus();
                
                // Note: Most browsers block programmatic window resizing for security
                if (window.screen && window.screen.availWidth) {
                    // Attempt to resize (may be blocked)
                    window.resizeTo(window.screen.availWidth, window.screen.availHeight);
                    window.moveTo(0, 0);
                }
                
                this.addOutput('✅ Browser window focused. Use F11 for true fullscreen.');
            } catch (error) {
                this.addOutput('⚠️ Browser window manipulation limited by security policies.');
            }
            return;
        }
        
        // Restore from minimized state
        if (this.originalBodyContent) {
            document.body.innerHTML = this.originalBodyContent;
            document.body.style.height = '';
            document.body.style.overflow = '';
            
            // Reinitialize the app
            window.app = new TerminalBucketList();
            this.isMinimized = false;
            
            // Add restoration message
            setTimeout(() => {
                this.addOutput('🟢 Window restored from minimized state.');
            }, 100);
        }
    }

    playTypewriterSound() {
        if (!this.audioEnabled) {
            return;
        }
        
        try {
            // Create a simple, reliable audio context approach
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            // Resume if suspended
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            
            if (this.audioContext.state !== 'running') {
                return;
            }
            
            // Create mechanical keyboard switch sound (inspired by keyboardsounds.net)
            const now = this.audioContext.currentTime;
            
            // Switch actuation click (sharp, crisp)
            const click = this.audioContext.createOscillator();
            const clickGain = this.audioContext.createGain();
            click.connect(clickGain);
            clickGain.connect(this.audioContext.destination);
            
            click.type = 'square';
            click.frequency.setValueAtTime(4000, now);
            click.frequency.exponentialRampToValueAtTime(1500, now + 0.002);
            clickGain.gain.setValueAtTime(0.3, now);
            clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.005);
            click.start(now);
            click.stop(now + 0.005);
            
            // Key bottom-out (tactile feedback)
            const bottomOut = this.audioContext.createOscillator();
            const bottomGain = this.audioContext.createGain();
            bottomOut.connect(bottomGain);
            bottomGain.connect(this.audioContext.destination);
            
            bottomOut.type = 'triangle';
            bottomOut.frequency.setValueAtTime(200, now + 0.003);
            bottomOut.frequency.exponentialRampToValueAtTime(80, now + 0.012);
            bottomGain.gain.setValueAtTime(0.2, now + 0.003);
            bottomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
            bottomOut.start(now + 0.003);
            bottomOut.stop(now + 0.015);
            
            // Spring return sound (subtle)
            const springReturn = this.audioContext.createOscillator();
            const springGain = this.audioContext.createGain();
            springReturn.connect(springGain);
            springGain.connect(this.audioContext.destination);
            
            springReturn.type = 'sine';
            springReturn.frequency.setValueAtTime(800, now + 0.008);
            springReturn.frequency.exponentialRampToValueAtTime(400, now + 0.018);
            springGain.gain.setValueAtTime(0.1, now + 0.008);
            springGain.gain.exponentialRampToValueAtTime(0.001, now + 0.020);
            springReturn.start(now + 0.008);
            springReturn.stop(now + 0.020);
            
            // Keycap resonance (plastic housing sound)
            const resonance = this.audioContext.createOscillator();
            const resonanceGain = this.audioContext.createGain();
            resonance.connect(resonanceGain);
            resonanceGain.connect(this.audioContext.destination);
            
            resonance.type = 'sawtooth';
            resonance.frequency.setValueAtTime(6000, now + 0.001);
            resonance.frequency.exponentialRampToValueAtTime(3000, now + 0.006);
            resonanceGain.gain.setValueAtTime(0.08, now + 0.001);
            resonanceGain.gain.exponentialRampToValueAtTime(0.001, now + 0.008);
            resonance.start(now + 0.001);
            resonance.stop(now + 0.008);
        } catch (error) {
            console.log('Audio not supported');
        }
    }
    
    getAudioContext() {
        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                return null;
            }
        }
        
        // Resume audio context if it's suspended (required by some browsers)
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        return this.audioContext;
    }

    handleCommand(command) {
        const cmd = command.toLowerCase();
        const originalCommand = command; // Preserve original case
        
        // Add command output to terminal
        this.addOutput(`<span class="prompt">bucket_list@terminal ~ %</span> <span class="command">${command}</span>`);

        switch (cmd) {
            case 'help':
                this.showHelp();
                break;
            case 'add':
                this.showAddForm();
                break;
            case 'list':
            case 'ls':
                this.clearDisplay();
                this.displayBucketList();
                break;
            case 'clear':
                this.clearDisplay();
                break;
            case 'stats':
                this.showStats();
                break;
            case 'sort-by-date':
                this.sortByDate();
                break;
            case 'export':
                this.exportBucketList();
                break;
            case 'import':
                this.importBucketList();
                break;
            case 'test-audio':
                this.testAudio();
                break;
            case 'print':
                this.printGoalsOnly();
                break;
            case 'migrate-ids':
                this.migrateOldIds();
                break;
            case 'exit':
                this.exitApp();
                break;
            default:
                if (cmd.startsWith('complete ')) {
                    const id = originalCommand.split(' ')[1]; // Use original case
                    this.completeItem(id);
                } else if (cmd.startsWith('delete ')) {
                    const id = originalCommand.split(' ')[1]; // Use original case
                    this.deleteItem(id);
                } else if (cmd.startsWith('edit ')) {
                    const id = originalCommand.split(' ')[1]; // Use original case
                    this.showEditForm(id);
                } else if (cmd.startsWith('filter ')) {
                    const category = originalCommand.split(' ')[1]; // Use original case for category too
                    this.filterByCategory(category);
                } else {
                    this.addOutput(`Command not found: ${command}. Type 'help' for available commands.`);
                }
        }
        
        this.focusInput();
    }

    addOutput(content) {
        const output = document.createElement('div');
        output.className = 'output';
        output.innerHTML = content;
        this.display.appendChild(output);
        output.scrollIntoView({ behavior: 'smooth' });
        
        // Announce important messages to screen readers
        if (content.includes('✅') || content.includes('🎉') || content.includes('🗑') || content.includes('✏️') || content.includes('Error:')) {
            this.announceToScreenReader(output.textContent);
        }
    }
    
    announceToScreenReader(message) {
        // Create a live region for screen reader announcements
        if (!this.liveRegion) {
            this.liveRegion = document.createElement('div');
            this.liveRegion.setAttribute('aria-live', 'polite');
            this.liveRegion.setAttribute('aria-atomic', 'true');
            this.liveRegion.className = 'sr-only';
            document.body.appendChild(this.liveRegion);
        }
        
        // Clear and set new message
        this.liveRegion.textContent = '';
        setTimeout(() => {
            this.liveRegion.textContent = message;
        }, 100);
    }

    showHelp() {
        const helpContent = `
            <div class="help-section">
                <div class="help-title">Available Commands:</div>
                <div class="help-commands">
                    <span class="help-command">add</span>
                    <span class="help-description">Add a new bucket list item</span>
                    <span class="help-command">clear</span>
                    <span class="help-description">Clear the terminal display</span>
                    <span class="help-command">complete [id]</span>
                    <span class="help-description">Mark item as completed</span>
                    <span class="help-command">delete [id]</span>
                    <span class="help-description">Delete an item</span>
                    <span class="help-command">edit [id]</span>
                    <span class="help-description">Edit an existing item</span>
                    <span class="help-command">exit</span>
                    <span class="help-description">Close the application/browser window</span>
                    <span class="help-command">export</span>
                    <span class="help-description">Export bucket list to JSON</span>
                    <span class="help-command">filter [category]</span>
                    <span class="help-description">Filter by category (adventure, travel, etc.)</span>
                    <span class="help-command">help</span>
                    <span class="help-description">Show this help message</span>
                    <span class="help-command">list / ls</span>
                    <span class="help-description">Display all bucket list items</span>
                    <span class="help-command">migrate-ids</span>
                    <span class="help-description">Update old long IDs to new 5-character format</span>
                    <span class="help-command">print</span>
                    <span class="help-description">Print goals in simple text format</span>
                    <span class="help-command">stats</span>
                    <span class="help-description">Show bucket list statistics</span>
                    <span class="help-command">sort-by-date</span>
                    <span class="help-description">List items sorted by due date (ascending)</span>
                </div>
            </div>
        `;
        this.addOutput(helpContent);
    }

    showAddForm() {
        this.addForm.style.display = 'block';
        document.getElementById('event-input').focus();
        this.addOutput('Opening add item form...');
    }

    hideAddForm() {
        this.addForm.style.display = 'none';
        this.clearForm();
        this.addOutput('Form cancelled.');
        this.focusInput();
    }

    saveNewItem() {
        const event = document.getElementById('event-input').value.trim();
        const date = document.getElementById('date-input').value;
        const category = document.getElementById('category-input').value;
        const priority = document.getElementById('priority-input').value;

        if (!event) {
            this.addOutput('Error: Event description is required.');
            return;
        }

        const newItem = {
            id: this.generateShortId(),
            event: event,
            date: date || null,
            category: category,
            priority: priority,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.activityList.push(newItem);
        this.saveActivities();
        this.hideAddForm();
        this.addOutput(`✅ Added new summer activity: "${event}"`);
        this.displayActivities();
    }

    showEditForm(id) {
        const item = this.activityList.find(item => item.id === id);
        if (!item) {
            this.addOutput(`Error: Activity with ID ${id} not found.`);
            return;
        }

        this.editingItemId = id;
        this.editForm.style.display = 'block';
        
        // Populate form with current values
        document.getElementById('edit-event-input').value = item.event;
        document.getElementById('edit-date-input').value = item.date || '';
        document.getElementById('edit-category-input').value = item.category;
        document.getElementById('edit-priority-input').value = item.priority;
        
        document.getElementById('edit-event-input').focus();
        this.addOutput(`Editing item: "${item.event}"`);
    }

    hideEditForm() {
        this.editForm.style.display = 'none';
        this.clearEditForm();
        this.editingItemId = null;
        this.addOutput('Edit cancelled.');
        this.focusInput();
    }

    updateItem() {
        if (!this.editingItemId) {
            this.addOutput('Error: No item being edited.');
            return;
        }

        const event = document.getElementById('edit-event-input').value.trim();
        const date = document.getElementById('edit-date-input').value;
        const category = document.getElementById('edit-category-input').value;
        const priority = document.getElementById('edit-priority-input').value;

        if (!event) {
            this.addOutput('Error: Event description is required.');
            return;
        }

        const item = this.bucketList.find(item => item.id === this.editingItemId);
        if (!item) {
            this.addOutput(`Error: Item with ID ${this.editingItemId} not found.`);
            return;
        }

        // Update the item
        item.event = event;
        item.date = date || null;
        item.category = category;
        item.priority = priority;
        item.updatedAt = new Date().toISOString();

        this.saveBucketList();
        this.hideEditForm();
        this.addOutput(`✏️ Updated bucket list item: "${event}"`);
        this.displayBucketList();
    }

    displayBucketList(filteredList = null) {
        const items = filteredList || this.bucketList;
        
        if (items.length === 0) {
            this.addOutput('No bucket list items found. Type "add" to create your first item!');
            return;
        }

        const listContent = items.map(item => {
            const categoryEmoji = this.getCategoryEmoji(item.category);
            const priorityClass = `priority-${item.priority}`;
            const priorityEmoji = this.getPriorityEmoji(item.priority);
            const dateStr = item.date ? new Date(item.date).toLocaleDateString() : 'No deadline';
            const completedClass = item.completed ? 'completed' : '';

            return `
                <article class="bucket-item ${completedClass}" role="listitem" aria-labelledby="item-title-${item.id}" aria-describedby="item-details-${item.id}">
                    <header class="item-header">
                        <h3 id="item-title-${item.id}" class="item-title">${item.event}</h3>
                        <span class="item-priority ${priorityClass}" aria-label="Priority: ${item.priority}">${priorityEmoji} ${item.priority.toUpperCase()}</span>
                    </header>
                    <div id="item-details-${item.id}" class="item-details">
                        <span class="item-category" aria-label="Category: ${item.category}">${categoryEmoji} ${item.category}</span>
                        <span class="item-date" aria-label="Due date: ${dateStr}">📅 ${dateStr}</span>
                        <span class="item-id" aria-label="Item ID: ${item.id}">ID: ${item.id}</span>
                    </div>
                    <div class="item-actions" role="group" aria-label="Actions for ${item.event}">
                        ${!item.completed ? `<button class="action-btn complete-btn" onclick="app.completeItem('${item.id}')" aria-label="Mark ${item.event} as complete">✓ Complete</button>` : ''}
                        <button class="action-btn edit-btn" onclick="app.showEditForm('${item.id}')" aria-label="Edit ${item.event}">✏️ Edit</button>
                        <button class="action-btn delete-btn" onclick="app.deleteItem('${item.id}')" aria-label="Delete ${item.event}">🗑 Delete</button>
                    </div>
                </article>
            `;
        }).join('');

        this.addOutput(`
            <div class="output">
                <strong>📋 Bucket List Items (${items.length} total):</strong>
            </div>
            <div class="bucket-items-grid" role="list" aria-label="Bucket list items">
                ${listContent}
            </div>
        `);
    }

    completeItem(id) {
        const item = this.bucketList.find(item => item.id === id);
        if (item) {
            item.completed = true;
            item.completedAt = new Date().toISOString();
            this.saveBucketList();
            this.addOutput(`🎉 Completed: "${item.event}"`);
            this.displayBucketList();
        } else {
            this.addOutput(`Error: Item with ID ${id} not found.`);
        }
    }

    deleteItem(id) {
        const itemIndex = this.bucketList.findIndex(item => item.id === id);
        if (itemIndex !== -1) {
            const deletedItem = this.bucketList.splice(itemIndex, 1)[0];
            this.saveBucketList();
            this.addOutput(`🗑 Deleted: "${deletedItem.event}"`);
            this.displayBucketList();
        } else {
            this.addOutput(`Error: Item with ID ${id} not found.`);
        }
    }

    filterByCategory(category) {
        const filteredItems = this.bucketList.filter(item => 
            item.category.toLowerCase() === category.toLowerCase()
        );
        
        if (filteredItems.length === 0) {
            this.addOutput(`No items found in category: ${category}`);
        } else {
            this.addOutput(`Filtering by category: ${category}`);
            this.displayBucketList(filteredItems);
        }
    }

    showStats() {
        const total = this.bucketList.length;
        const completed = this.bucketList.filter(item => item.completed).length;
        const pending = total - completed;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        const categories = {};
        this.bucketList.forEach(item => {
            categories[item.category] = (categories[item.category] || 0) + 1;
        });

        const categoryStats = Object.entries(categories)
            .map(([cat, count]) => `${this.getCategoryEmoji(cat)} ${cat}: ${count}`)
            .join('<br>                ');

        const statsContent = `
            <div class="help-section">
                <div class="help-title">📊 Bucket List Statistics</div>
                <div style="margin-top: 10px; line-height: 1.8;">
                    📝 Total Items: ${total}<br>
                    ✅ Completed: ${completed}<br>
                    ⏳ Pending: ${pending}<br>
                    📈 Completion Rate: ${completionRate}%<br>
                    <br>
                    <strong>Categories:</strong><br>
                    ${categoryStats || 'No categories yet'}
                </div>
            </div>
        `;
        this.addOutput(statsContent);
    }

    sortByDate() {
        if (this.bucketList.length === 0) {
            this.addOutput('No bucket list items found. Type "add" to create your first item!');
            return;
        }

        // Sort items by date - items with no date go to the end
        const sortedItems = [...this.bucketList].sort((a, b) => {
            // Handle items without dates or empty dates - put them at the end
            const hasDateA = a.date && a.date.trim() !== '';
            const hasDateB = b.date && b.date.trim() !== '';
            
            if (!hasDateA && !hasDateB) return 0;
            if (!hasDateA) return 1;
            if (!hasDateB) return -1;
            
            // Parse dates and compare
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            
            // Check for invalid dates
            const validA = !isNaN(dateA.getTime());
            const validB = !isNaN(dateB.getTime());
            
            if (!validA && !validB) return 0;
            if (!validA) return 1;
            if (!validB) return -1;
            
            // Compare valid dates (ascending order)
            return dateA.getTime() - dateB.getTime();
        });

        this.addOutput('📅 Bucket List Items sorted by due date (ascending):');
        this.displayBucketList(sortedItems);
    }

    exportBucketList() {
        const dataStr = JSON.stringify(this.bucketList, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `bucket-list-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.addOutput('📤 Bucket list exported to JSON file');
    }

    importBucketList() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const importedData = JSON.parse(e.target.result);
                        this.bucketList = importedData;
                        this.saveBucketList();
                        this.addOutput('📥 Bucket list imported successfully');
                        this.displayBucketList();
                    } catch (error) {
                        this.addOutput('❌ Error importing file: Invalid JSON format');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    clearDisplay() {
        this.display.innerHTML = '';
        this.addOutput('Terminal cleared.');
    }

    clearForm() {
        document.getElementById('event-input').value = '';
        document.getElementById('date-input').value = '';
        document.getElementById('category-input').selectedIndex = 0;
        document.getElementById('priority-input').selectedIndex = 0;
    }

    clearEditForm() {
        document.getElementById('edit-event-input').value = '';
        document.getElementById('edit-date-input').value = '';
        document.getElementById('edit-category-input').selectedIndex = 0;
        document.getElementById('edit-priority-input').selectedIndex = 0;
    }

    getCategoryEmoji(category) {
        const emojis = {
            adventure: '🏔️',
            travel: '✈️',
            learning: '📚',
            fitness: '💪',
            career: '💼',
            personal: '🎯',
            creative: '🎨',
            social: '👥',
            financial: '💰'
        };
        return emojis[category] || '📝';
    }

    getPriorityEmoji(priority) {
        const emojis = {
            high: '🔴',
            medium: '🟡',
            low: '🟢'
        };
        return emojis[priority] || '⚪';
    }

    generateShortId() {
        // Include uppercase A-Z, lowercase a-z, and numbers 0-9
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 5; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        // Ensure uniqueness by checking existing IDs
        while (this.activityList.some(item => item.id === result)) {
            result = '';
            for (let i = 0; i < 5; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
        }
        
        return result;
    }

    saveActivities() {
        localStorage.setItem('summerActivities', JSON.stringify(this.activityList));
    }

    printGoalsOnly() {
        if (this.bucketList.length === 0) {
            this.addOutput('No goals found.');
            return;
        }

        this.addOutput('📄 Goals (text only):');
        this.addOutput('─'.repeat(50));
        
        this.bucketList.forEach((item, index) => {
            const status = item.completed ? '[✓]' : '[ ]';
            this.addOutput(`${status} ${item.event}`);
        });
        
        this.addOutput('─'.repeat(50));
    }

    migrateOldIds() {
        let updatedCount = 0;
        
        this.bucketList.forEach(item => {
            // Convert ID to string and check if it's longer than 5 characters
            const currentId = String(item.id);
            if (currentId.length > 5) {
                const newId = this.generateShortId();
                item.id = newId;
                updatedCount++;
            }
        });
        
        if (updatedCount > 0) {
            this.saveBucketList();
            this.addOutput(`🔄 Migrated ${updatedCount} item(s) to new 5-character IDs`);
            this.addOutput('All IDs are now in the new format (A-Z, a-z, 0-9, 5 characters)');
        } else {
            this.addOutput('✅ All IDs are already in the correct 5-character format');
        }
    }

    testAudio() {
        const audioContext = this.getAudioContext();
        this.addOutput(`Audio Context State: ${audioContext ? audioContext.state : 'null'}`);
        
        if (audioContext) {
            this.addOutput('🔊 Playing test sound...');
            this.playTypewriterSound();
        } else {
            this.addOutput('❌ Audio context not available');
        }
    }

    autoMigrateIds() {
        let updatedCount = 0;
        
        this.bucketList.forEach(item => {
            // Convert ID to string and check if it's longer than 5 characters
            const currentId = String(item.id);
            if (currentId.length > 5) {
                const newId = this.generateShortId();
                item.id = newId;
                updatedCount++;
            }
        });
        
        if (updatedCount > 0) {
            this.saveBucketList();
            console.log(`Auto-migrated ${updatedCount} item(s) to new 5-character IDs`);
        }
    }

    exitApp() {
        this.addOutput('👋 Goodbye! Closing application...');
        
        // Save any pending changes
        this.saveBucketList();
        
        // Show exit message briefly before closing
        setTimeout(() => {
            // Try different methods to close the browser
            if (window.opener) {
                // If opened by another window, close this window
                window.close();
            } else {
                // If it's the main window, try to close it
                window.close();
                
                // If window.close() doesn't work (some browsers block it),
                // redirect to a blank page or show a message
                setTimeout(() => {
                    if (!window.closed) {
                        this.addOutput('⚠️ Browser security prevents automatic closing.');
                        this.addOutput('Please close this tab manually or press Ctrl+W (Cmd+W on Mac)');
                    }
                }, 500);
            }
        }, 1000);
    }

    enableAudio() {
        // Initialize audio context on user interaction
        this.audioEnabled = true;
        const context = this.getAudioContext();
        if (context) {
            console.log('Audio enabled - State:', context.state);
        }
    }

    startClock() {
        const updateDateTime = () => {
            const now = new Date();
            
            // Format time (HH:MM:SS)
            const timeString = now.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            
            // Format date (Mon DD, YYYY)
            const dateString = now.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
            
            // Update the display elements
            const timeElement = document.getElementById('current-time');
            const dateElement = document.getElementById('current-date');
            
            if (timeElement) timeElement.textContent = timeString;
            if (dateElement) dateElement.textContent = dateString;
        };
        
        // Update immediately
        updateDateTime();
        
        // Update every second
        setInterval(updateDateTime, 1000);
    }

    focusInput() {
        setTimeout(() => {
            this.commandInput.focus();
        }, 100);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new SummerActivitiesPlanner();
    
    // Show welcome message
    setTimeout(() => {
        document.getElementById('activities-display').innerHTML += `
            <div class="output">✨ Summer Activities Planner loaded successfully!</div>
            <div class="output">Type <span class="command">'help'</span> to see available commands or <span class="command">'add'</span> to plan your first summer activity.</div>
            <div class="output">Type <span class="command">'list'</span> or <span class="command">'ls'</span> to view your summer activities.</div>
            <div class="output">═══════════════════════════════════════════════════</div>
        `;
    }, 500);
});
