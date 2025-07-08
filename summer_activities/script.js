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
        this.currentSwitchType = 'blue';
        this.switchTypes = {
            blue: 'Cherry MX Blue (Clicky)',
            red: 'Cherry MX Red (Linear)',
            brown: 'Cherry MX Brown (Tactile)',
            typewriter: 'Vintage Typewriter'
        };
        
        this.initializeEventListeners();
        this.initializeWindowControls();
        this.autoMigrateIds();
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
            if (!['Shift', 'Control', 'Alt', 'Meta', 'Tab', 'CapsLock', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'].includes(e.key)) {
                this.playTypewriterSound();
            }
            
            if (e.key === 'Enter') {
                this.handleCommand(e.target.value.trim());
                e.target.value = '';
            }
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

        // Complete form buttons
        if (document.getElementById('complete-save-btn')) {
            document.getElementById('complete-save-btn').addEventListener('click', () => {
                this.saveCompletedActivity();
            });
        }

        if (document.getElementById('cancel-complete-btn')) {
            document.getElementById('cancel-complete-btn').addEventListener('click', () => {
                this.hideCompleteForm();
            });
        }

        // Add typewriter sound to all form inputs
        document.querySelectorAll('.terminal-input').forEach(input => {
            input.addEventListener('keydown', (e) => {
                if (!['Shift', 'Control', 'Alt', 'Meta', 'Tab', 'CapsLock', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'].includes(e.key)) {
                    this.playTypewriterSound();
                }
            });
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
        const closeBtn = document.querySelector('.button.close');
        const minimizeBtn = document.querySelector('.button.minimize');
        const maximizeBtn = document.querySelector('.button.maximize');
        
        this.isMinimized = false;
        this.originalBodyContent = null;
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.handleClose();
            });
            closeBtn.removeAttribute('tabindex');
        }
        
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', () => {
                this.handleMinimize();
            });
            minimizeBtn.removeAttribute('tabindex');
        }
        
        if (maximizeBtn) {
            maximizeBtn.addEventListener('click', () => {
                this.handleMaximize();
            });
            maximizeBtn.removeAttribute('tabindex');
        }
    }
    
    handleClose() {
        this.addOutput('🔴 Attempting to close window...');
        
        try {
            if (window.opener) {
                window.close();
                return;
            }
            
            window.close();
            
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
            this.handleMaximize();
            return;
        }
        
        this.addOutput('🟡 Minimizing window...');
        this.originalBodyContent = document.body.innerHTML;
        
        const minimizedHTML = `
            <div class="minimized-window">
                <div class="minimized-header">
                    <div class="minimized-icon">🏖️</div>
                    <div class="minimized-title">Summer Activities Planner - Minimized</div>
                    <button class="restore-btn" onclick="app.handleMaximize()" aria-label="Restore window">
                        <div class="button maximize"></div>
                    </button>
                </div>
            </div>
        `;
        
        document.body.innerHTML = minimizedHTML;
        this.isMinimized = true;
        document.body.style.height = '60px';
        document.body.style.overflow = 'hidden';
    }
    
    handleMaximize() {
        if (!this.isMinimized) {
            this.addOutput('🟢 Attempting to maximize browser window...');
            
            try {
                window.focus();
                
                if (window.screen && window.screen.availWidth) {
                    window.resizeTo(window.screen.availWidth, window.screen.availHeight);
                    window.moveTo(0, 0);
                }
                
                this.addOutput('✅ Browser window focused. Use F11 for true fullscreen.');
            } catch (error) {
                this.addOutput('⚠️ Browser window manipulation limited by security policies.');
            }
            return;
        }
        
        if (this.originalBodyContent) {
            document.body.innerHTML = this.originalBodyContent;
            document.body.style.height = '';
            document.body.style.overflow = '';
            
            window.app = new SummerActivitiesPlanner();
            this.isMinimized = false;
            
            setTimeout(() => {
                this.addOutput('🟢 Window restored from minimized state.');
            }, 100);
        }
    }

    playTypewriterSound() {
        if (!this.audioEnabled) return;
        
        try {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            
            if (this.audioContext.state !== 'running') return;
            
            const now = this.audioContext.currentTime;
            
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
        } catch (error) {
            console.log('Audio not supported');
        }
    }

    handleCommand(command) {
        const cmd = command.toLowerCase();
        const originalCommand = command;
        
        this.addOutput(`<span class="prompt">summer_activities@terminal ~ %</span> <span class="command">${command}</span>`);

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
                this.displayActivities();
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
                this.exportActivities();
                break;
            case 'import':
                this.importActivities();
                break;
            case 'exit':
                this.exitApp();
                break;
            default:
                if (originalCommand === './summer_activities.sh') {
                    this.showEasterEgg();
                } else if (cmd.startsWith('complete ')) {
                    const id = originalCommand.split(' ')[1];
                    this.showCompleteForm(id);
                } else if (cmd.startsWith('delete ')) {
                    const id = originalCommand.split(' ')[1];
                    this.deleteItem(id);
                } else if (cmd.startsWith('edit ')) {
                    const id = originalCommand.split(' ')[1];
                    this.showEditForm(id);
                } else if (cmd.startsWith('filter ')) {
                    const category = originalCommand.split(' ')[1];
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
        
        if (content.includes('✅') || content.includes('🎉') || content.includes('🗑') || content.includes('✏️') || content.includes('Error:')) {
            this.announceToScreenReader(output.textContent);
        }
    }
    
    announceToScreenReader(message) {
        if (!this.liveRegion) {
            this.liveRegion = document.createElement('div');
            this.liveRegion.setAttribute('aria-live', 'polite');
            this.liveRegion.setAttribute('aria-atomic', 'true');
            this.liveRegion.className = 'sr-only';
            document.body.appendChild(this.liveRegion);
        }
        
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
                    <span class="help-description">Plan a new summer activity</span>
                    <span class="help-command">clear</span>
                    <span class="help-description">Clear the terminal display</span>
                    <span class="help-command">complete [id]</span>
                    <span class="help-description">Mark activity as completed with feedback</span>
                    <span class="help-command">delete [id]</span>
                    <span class="help-description">Delete an activity</span>
                    <span class="help-command">edit [id]</span>
                    <span class="help-description">Edit an existing activity</span>
                    <span class="help-command">exit</span>
                    <span class="help-description">Close the application</span>
                    <span class="help-command">export</span>
                    <span class="help-description">Export activities to JSON</span>
                    <span class="help-command">filter [type]</span>
                    <span class="help-description">Filter by activity type</span>
                    <span class="help-command">help</span>
                    <span class="help-description">Show this help message</span>
                    <span class="help-command">list / ls</span>
                    <span class="help-description">Display all summer activities</span>
                    <span class="help-command">sort-by-date</span>
                    <span class="help-description">List activities sorted by date</span>
                    <span class="help-command">stats</span>
                    <span class="help-description">Show activity statistics</span>
                </div>
            </div>
        `;
        this.addOutput(helpContent);
    }

    showAddForm() {
        this.addForm.style.display = 'block';
        document.getElementById('event-input').focus();
        this.addOutput('Opening activity planning form...');
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
            this.addOutput('Error: Activity description is required.');
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
        // Remove existing activity grids before showing updated list
        const existingGrids = this.display.querySelectorAll('.bucket-items-grid');
        existingGrids.forEach(grid => grid.parentElement.remove());
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
        
        document.getElementById('edit-event-input').value = item.event;
        document.getElementById('edit-date-input').value = item.date || '';
        document.getElementById('edit-category-input').value = item.category;
        document.getElementById('edit-priority-input').value = item.priority;
        
        document.getElementById('edit-event-input').focus();
        this.addOutput(`Editing activity: "${item.event}"`);
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
            this.addOutput('Error: No activity being edited.');
            return;
        }

        const event = document.getElementById('edit-event-input').value.trim();
        const date = document.getElementById('edit-date-input').value;
        const category = document.getElementById('edit-category-input').value;
        const priority = document.getElementById('edit-priority-input').value;

        if (!event) {
            this.addOutput('Error: Activity description is required.');
            return;
        }

        const item = this.activityList.find(item => item.id === this.editingItemId);
        if (!item) {
            this.addOutput(`Error: Activity with ID ${this.editingItemId} not found.`);
            return;
        }

        item.event = event;
        item.date = date || null;
        item.category = category;
        item.priority = priority;
        item.updatedAt = new Date().toISOString();

        this.saveActivities();
        this.hideEditForm();
        this.addOutput(`✏️ Updated summer activity: "${event}"`);
        // Remove existing activity grids before showing updated list
        const existingGrids = this.display.querySelectorAll('.bucket-items-grid');
        existingGrids.forEach(grid => grid.parentElement.remove());
        this.displayActivities();
    }

    showCompleteForm(id) {
        const item = this.activityList.find(item => item.id === id);
        if (!item) {
            this.addOutput(`Error: Activity with ID ${id} not found.`);
            return;
        }

        if (item.completed) {
            this.addOutput(`Activity "${item.event}" is already completed.`);
            return;
        }

        this.completingItemId = id;
        this.completeForm.style.display = 'block';
        
        document.getElementById('activity-name').value = item.event;
        document.getElementById('liked-input').focus();
        this.addOutput(`Completing activity: "${item.event}"`);
    }

    hideCompleteForm() {
        this.completeForm.style.display = 'none';
        this.clearCompleteForm();
        this.completingItemId = null;
        this.addOutput('Completion cancelled.');
        this.focusInput();
    }

    saveCompletedActivity() {
        if (!this.completingItemId) {
            this.addOutput('Error: No activity being completed.');
            return;
        }

        const liked = document.getElementById('liked-input').value.trim();
        const improve = document.getElementById('improve-input').value.trim();
        const rating = document.getElementById('rating-input').value;

        if (!liked) {
            this.addOutput('Error: Please share what you liked about the activity.');
            return;
        }

        const item = this.activityList.find(item => item.id === this.completingItemId);
        if (!item) {
            this.addOutput(`Error: Activity with ID ${this.completingItemId} not found.`);
            return;
        }

        item.completed = true;
        item.completedAt = new Date().toISOString();
        item.feedback = {
            liked: liked,
            improve: improve || 'No suggestions',
            rating: rating
        };

        this.saveActivities();
        this.hideCompleteForm();
        this.addOutput(`🎉 Completed: "${item.event}" - ${this.getRatingEmoji(rating)} ${rating}!`);
        // Remove existing activity grids before showing updated list
        const existingGrids = this.display.querySelectorAll('.bucket-items-grid');
        existingGrids.forEach(grid => grid.parentElement.remove());
        this.displayActivities();
    }

    displayActivities(filteredList = null) {
        let items = filteredList || this.activityList;
        
        // Sort activities by date automatically
        items = [...items].sort((a, b) => {
            const hasDateA = a.date && a.date.trim() !== '';
            const hasDateB = b.date && b.date.trim() !== '';
            
            if (!hasDateA && !hasDateB) return 0;
            if (!hasDateA) return 1;
            if (!hasDateB) return -1;
            
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            
            const validA = !isNaN(dateA.getTime());
            const validB = !isNaN(dateB.getTime());
            
            if (!validA && !validB) return 0;
            if (!validA) return 1;
            if (!validB) return -1;
            
            return dateA.getTime() - dateB.getTime();
        });
        
        if (items.length === 0) {
            this.addOutput('No summer activities planned yet. Type "add" to plan your first activity!');
            return;
        }

        const listContent = items.map(item => {
            const categoryEmoji = this.getCategoryEmoji(item.category);
            const priorityClass = `priority-${item.priority}`;
            const priorityEmoji = this.getPriorityEmoji(item.priority);
            const dateStr = item.date ? new Date(item.date).toLocaleDateString() : 'No date set';
            const completedClass = item.completed ? 'completed' : '';
            const feedbackDisplay = item.completed && item.feedback ? 
                `<div class="feedback-summary">👍 ${item.feedback.liked.substring(0, 50)}${item.feedback.liked.length > 50 ? '...' : ''}</div>` : '';

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
                        ${item.completed ? `<span class="completion-rating">${this.getRatingEmoji(item.feedback?.rating)} ${item.feedback?.rating || 'completed'}</span>` : ''}
                    </div>
                    ${feedbackDisplay}
                    <div class="item-actions" role="group" aria-label="Actions for ${item.event}">
                        ${!item.completed ? `<button class="action-btn complete-btn" onclick="app.showCompleteForm('${item.id}')" aria-label="Complete ${item.event}">✓ Complete</button>` : ''}
                        <button class="action-btn edit-btn" onclick="app.showEditForm('${item.id}')" aria-label="Edit ${item.event}">✏️ Edit</button>
                        <button class="action-btn delete-btn" onclick="app.deleteItem('${item.id}')" aria-label="Delete ${item.event}">🗑 Delete</button>
                    </div>
                </article>
            `;
        }).join('');

        this.addOutput(`
            <div class="output">
                <strong>🏖️ Summer Activities (${items.length} total):</strong>
            </div>
            <div class="bucket-items-grid" role="list" aria-label="Summer activities">
                ${listContent}
            </div>
        `);
    }

    deleteItem(id) {
        const itemIndex = this.activityList.findIndex(item => item.id === id);
        if (itemIndex !== -1) {
            const deletedItem = this.activityList.splice(itemIndex, 1)[0];
            this.saveActivities();
            this.addOutput(`🗑 Deleted: "${deletedItem.event}"`);
            // Remove existing activity grids before showing updated list
            const existingGrids = this.display.querySelectorAll('.bucket-items-grid');
            existingGrids.forEach(grid => grid.parentElement.remove());
            this.displayActivities();
        } else {
            this.addOutput(`Error: Activity with ID ${id} not found.`);
        }
    }

    filterByCategory(category) {
        const filteredItems = this.activityList.filter(item => 
            item.category.toLowerCase() === category.toLowerCase()
        );
        
        if (filteredItems.length === 0) {
            this.addOutput(`No activities found in category: ${category}`);
        } else {
            this.addOutput(`Filtering by category: ${category}`);
            this.displayActivities(filteredItems);
        }
    }

    showStats() {
        const total = this.activityList.length;
        const completed = this.activityList.filter(item => item.completed).length;
        const pending = total - completed;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        const categories = {};
        this.activityList.forEach(item => {
            categories[item.category] = (categories[item.category] || 0) + 1;
        });

        const categoryStats = Object.entries(categories)
            .map(([cat, count]) => `${this.getCategoryEmoji(cat)} ${cat}: ${count}`)
            .join('<br>                ');

        const statsContent = `
            <div class="help-section">
                <div class="help-title">🏖️ Summer Activities Statistics</div>
                <div style="margin-top: 10px; line-height: 1.8;">
                    📝 Total Activities: ${total}<br>
                    ✅ Completed: ${completed}<br>
                    ⏳ Pending: ${pending}<br>
                    📈 Completion Rate: ${completionRate}%<br>
                    <br>
                    <strong>Activity Types:</strong><br>
                    ${categoryStats || 'No activities yet'}
                </div>
            </div>
        `;
        this.addOutput(statsContent);
    }

    sortByDate() {
        if (this.activityList.length === 0) {
            this.addOutput('No summer activities planned yet.');
            return;
        }

        const sortedItems = [...this.activityList].sort((a, b) => {
            const hasDateA = a.date && a.date.trim() !== '';
            const hasDateB = b.date && b.date.trim() !== '';
            
            if (!hasDateA && !hasDateB) return 0;
            if (!hasDateA) return 1;
            if (!hasDateB) return -1;
            
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            
            const validA = !isNaN(dateA.getTime());
            const validB = !isNaN(dateB.getTime());
            
            if (!validA && !validB) return 0;
            if (!validA) return 1;
            if (!validB) return -1;
            
            return dateA.getTime() - dateB.getTime();
        });

        this.addOutput('📅 Summer Activities sorted by date (ascending):');
        this.displayActivities(sortedItems);
    }

    exportActivities() {
        const dataStr = JSON.stringify(this.activityList, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `summer-activities-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.addOutput('📤 Summer activities exported to JSON file');
    }

    importActivities() {
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
                        this.activityList = importedData;
                        this.saveActivities();
                        this.addOutput('📥 Summer activities imported successfully');
                        this.displayActivities();
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

    clearCompleteForm() {
        document.getElementById('liked-input').value = '';
        document.getElementById('improve-input').value = '';
        document.getElementById('rating-input').selectedIndex = 0;
    }

    getCategoryEmoji(category) {
        const emojis = {
            outdoor: '🌳',
            beach: '🏖️',
            cultural: '🎭',
            food: '🍽️',
            entertainment: '🎬',
            sports: '⚽',
            relaxation: '🧘',
            exploration: '🗺️',
            shopping: '🛍️'
        };
        return emojis[category] || '📝';
    }

    getPriorityEmoji(priority) {
        const emojis = {
            high: '🔥',
            medium: '⭐',
            low: '💭'
        };
        return emojis[priority] || '⚪';
    }

    getRatingEmoji(rating) {
        const emojis = {
            amazing: '🤩',
            great: '😊',
            good: '🙂',
            okay: '😐',
            meh: '😕'
        };
        return emojis[rating] || '⭐';
    }

    generateShortId() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 5; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
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

    autoMigrateIds() {
        let updatedCount = 0;
        
        this.activityList.forEach(item => {
            const currentId = String(item.id);
            if (currentId.length > 5) {
                const newId = this.generateShortId();
                item.id = newId;
                updatedCount++;
            }
        });
        
        if (updatedCount > 0) {
            this.saveActivities();
            console.log(`Auto-migrated ${updatedCount} item(s) to new 5-character IDs`);
        }
    }

    showEasterEgg() {
        this.addOutput('🎉 Easter egg activated! Running summer_activities.sh...');
        
        // Create confetti modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(5px);
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            color: white;
            font-family: 'SF Mono', 'Monaco', 'Menlo', 'Consolas', monospace;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            position: relative;
            overflow: hidden;
            max-width: 500px;
            width: 90%;
        `;
        
        content.innerHTML = `
            <h2 style="margin: 0 0 20px 0; font-size: 2em;">🏖️ Summer Magic! 🏖️</h2>
            <p style="margin: 0 0 20px 0; font-size: 1.2em;">You discovered the secret summer script!</p>
            <p style="margin: 0 0 20px 0; opacity: 0.9;">✨ May your summer activities be as colorful as this confetti! ✨</p>
            <p style="margin: 0 0 30px 0; font-size: 1.1em; font-weight: bold; color: #FFD700;">🎁 Now go collect your prize from your father! 🎁</p>
            <button id="close-easter-egg" style="
                background: rgba(255, 255, 255, 0.2);
                border: 2px solid white;
                color: white;
                padding: 12px 24px;
                border-radius: 25px;
                font-family: inherit;
                font-size: 1em;
                cursor: pointer;
                transition: all 0.3s ease;
            " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">Close & Continue Planning</button>
        `;
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // Create confetti animation
        this.createConfetti(modal);
        
        // Close modal handler
        const closeBtn = document.getElementById('close-easter-egg');
        const closeModal = () => {
            modal.style.opacity = '0';
            modal.style.transform = 'scale(0.9)';
            setTimeout(() => {
                document.body.removeChild(modal);
                this.addOutput('🌟 Easter egg closed. Back to planning amazing summer activities!');
                this.focusInput();
            }, 300);
        };
        
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        // Auto-close after 10 seconds
        setTimeout(closeModal, 10000);
        
        // Smooth entrance animation
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.9)';
        modal.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.style.transform = 'scale(1)';
        }, 100);
    }
    
    createConfetti(container) {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
        const confettiCount = 100;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: absolute;
                width: ${Math.random() * 10 + 5}px;
                height: ${Math.random() * 10 + 5}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}%;
                top: -10px;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                opacity: 0.8;
                pointer-events: none;
                animation: confetti-fall ${Math.random() * 2 + 3}s linear infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
            
            container.appendChild(confetti);
        }
        
        // Add confetti animation CSS if not already added
        if (!document.getElementById('confetti-styles')) {
            const style = document.createElement('style');
            style.id = 'confetti-styles';
            style.textContent = `
                @keyframes confetti-fall {
                    0% {
                        transform: translateY(-10px) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    exitApp() {
        this.addOutput('👋 Goodbye! Thanks for using Summer Activities Planner!');
        this.saveActivities();
        
        setTimeout(() => {
            if (window.opener) {
                window.close();
            } else {
                window.close();
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
        this.audioEnabled = true;
        const context = this.getAudioContext();
        if (context) {
            console.log('Audio enabled - State:', context.state);
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
        
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        return this.audioContext;
    }

    startClock() {
        const updateDateTime = () => {
            const now = new Date();
            
            const timeString = now.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            
            const dateString = now.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
            
            const timeElement = document.getElementById('current-time');
            const dateElement = document.getElementById('current-date');
            
            if (timeElement) timeElement.textContent = timeString;
            if (dateElement) dateElement.textContent = dateString;
        };
        
        updateDateTime();
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
