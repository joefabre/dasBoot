// Date and Time Display Functions
function updateDateTime() {
    const now = new Date();
    
    // Format date (e.g., "Wednesday, June 19, 2024")
    const dateOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    const formattedDate = now.toLocaleDateString('en-US', dateOptions);
    
    // Format time (e.g., "2:30:45 PM")
    const timeOptions = {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };
    const formattedTime = now.toLocaleTimeString('en-US', timeOptions);
    
    // Update the display elements
    const dateDisplay = document.getElementById('dateDisplay');
    const timeDisplay = document.getElementById('timeDisplay');
    
    if (dateDisplay) {
        dateDisplay.textContent = formattedDate;
    }
    
    if (timeDisplay) {
        timeDisplay.textContent = formattedTime;
    }
}

// Drag and Drop Functionality
let draggedElement = null;
let placeholder = null;

function initializeDragAndDrop() {
    console.log('Initializing drag and drop...');
    const cards = document.querySelectorAll('.app-card');
    const cardsGrid = document.querySelector('.cards-grid');
    
    console.log('Found', cards.length, 'cards');
    
    // Create placeholder element
    placeholder = document.createElement('div');
    placeholder.className = 'card-placeholder';
    placeholder.innerHTML = '<div class="placeholder-content">Drop here</div>';
    
    cards.forEach((card, index) => {
        console.log('Setting up card', index);
        
        // Make cards draggable
        card.draggable = true;
        card.setAttribute('tabindex', '0');
        card.dataset.originalIndex = index;
        card.style.cursor = 'grab';
        
        // Add drag handle indicator
        const dragHandle = document.createElement('div');
        dragHandle.className = 'drag-handle';
        dragHandle.innerHTML = '⋮⋮';
        dragHandle.setAttribute('aria-label', 'Drag to reorder');
        dragHandle.setAttribute('role', 'button');
        dragHandle.setAttribute('tabindex', '0');
        card.insertBefore(dragHandle, card.firstChild);
        
        // Drag events
        card.addEventListener('dragstart', function(e) {
            console.log('Drag start triggered on', this);
            handleDragStart.call(this, e);
        });
        
        card.addEventListener('dragend', function(e) {
            console.log('Drag end triggered on', this);
            handleDragEnd.call(this, e);
        });
        
        // Test if draggable is working
        card.addEventListener('mousedown', function(e) {
            console.log('Mouse down on card', index);
            this.style.cursor = 'grabbing';
        });
        
        card.addEventListener('mouseup', function(e) {
            this.style.cursor = 'grab';
        });
        
        // Keyboard support for reordering
        card.addEventListener('keydown', handleKeyboardReorder);
    });
    
    // Container events for drop zones
    cardsGrid.addEventListener('dragover', function(e) {
        console.log('Drag over container');
        handleDragOver.call(this, e);
    });
    
    cardsGrid.addEventListener('drop', function(e) {
        console.log('Drop on container');
        handleDrop.call(this, e);
    });
    
    cardsGrid.addEventListener('dragenter', function(e) {
        console.log('Drag enter container');
        handleDragEnter.call(this, e);
    });
    
    console.log('Drag and drop setup complete');
    
    // Load saved card order
    loadCardOrder();
    
    // Save initial order after a delay
    setTimeout(() => {
        saveCardOrder();
    }, 100);
}

function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    
    // Set drag effect
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.outerHTML);
    
    // Add visual feedback
    setTimeout(() => {
        this.style.opacity = '0.5';
    }, 0);
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    this.style.opacity = '1';
    
    // Remove any remaining placeholders
    const existingPlaceholders = document.querySelectorAll('.card-placeholder');
    existingPlaceholders.forEach(p => p.remove());
    
    // Save new order
    saveCardOrder();
    
    draggedElement = null;
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (!draggedElement) return;
    
    const afterElement = getDragAfterElement(this, e.clientY);
    
    // Remove existing placeholder
    const existingPlaceholder = document.querySelector('.card-placeholder');
    if (existingPlaceholder) {
        existingPlaceholder.remove();
    }
    
    if (afterElement == null) {
        this.appendChild(placeholder);
    } else {
        this.insertBefore(placeholder, afterElement);
    }
}

function handleDrop(e) {
    e.preventDefault();
    
    if (!draggedElement) return;
    
    const afterElement = getDragAfterElement(this, e.clientY);
    
    // Remove placeholder
    const existingPlaceholder = document.querySelector('.card-placeholder');
    if (existingPlaceholder) {
        existingPlaceholder.remove();
    }
    
    if (afterElement == null) {
        this.appendChild(draggedElement);
    } else {
        this.insertBefore(draggedElement, afterElement);
    }
}

function handleDragEnter(e) {
    e.preventDefault();
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.app-card:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Keyboard support for reordering
function handleKeyboardReorder(e) {
    if (e.ctrlKey || e.metaKey) {
        const cardsGrid = document.querySelector('.cards-grid');
        const cards = [...cardsGrid.querySelectorAll('.app-card')];
        const currentIndex = cards.indexOf(this);
        
        let newIndex = currentIndex;
        
        switch(e.key) {
            case 'ArrowUp':
            case 'ArrowLeft':
                newIndex = Math.max(0, currentIndex - 1);
                e.preventDefault();
                break;
            case 'ArrowDown':
            case 'ArrowRight':
                newIndex = Math.min(cards.length - 1, currentIndex + 1);
                e.preventDefault();
                break;
            case 'Home':
                newIndex = 0;
                e.preventDefault();
                break;
            case 'End':
                newIndex = cards.length - 1;
                e.preventDefault();
                break;
        }
        
        if (newIndex !== currentIndex) {
            // Move the card
            if (newIndex === 0) {
                cardsGrid.insertBefore(this, cards[0]);
            } else if (newIndex === cards.length - 1) {
                cardsGrid.appendChild(this);
            } else {
                const targetCard = cards[newIndex];
                if (currentIndex < newIndex) {
                    cardsGrid.insertBefore(this, targetCard.nextSibling);
                } else {
                    cardsGrid.insertBefore(this, targetCard);
                }
            }
            
            // Maintain focus
            this.focus();
            
            // Save new order
            saveCardOrder();
            
            // Announce change to screen readers
            announceReorder(this, newIndex + 1, cards.length);
        }
    }
}

// Save card order to localStorage
function saveCardOrder() {
    const cards = document.querySelectorAll('.app-card');
    const order = [];
    
    cards.forEach(card => {
        const title = card.querySelector('.card-title').textContent;
        order.push(title);
    });
    
    localStorage.setItem('dashboardCardOrder', JSON.stringify(order));
}

// Load saved card order
function loadCardOrder() {
    const savedOrder = localStorage.getItem('dashboardCardOrder');
    if (!savedOrder) return;
    
    try {
        const order = JSON.parse(savedOrder);
        const cardsGrid = document.querySelector('.cards-grid');
        const cards = [...cardsGrid.querySelectorAll('.app-card')];
        
        // Sort cards according to saved order
        const sortedCards = [];
        order.forEach(title => {
            const card = cards.find(c => c.querySelector('.card-title').textContent === title);
            if (card) {
                sortedCards.push(card);
            }
        });
        
        // Add any new cards that weren't in the saved order
        cards.forEach(card => {
            if (!sortedCards.includes(card)) {
                sortedCards.push(card);
            }
        });
        
        // Reorder DOM elements
        sortedCards.forEach(card => {
            cardsGrid.appendChild(card);
        });
    } catch (e) {
        console.warn('Could not load saved card order:', e);
    }
}

// Container drag event handlers
function handleContainerDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (!draggedElement) return;
    
    const afterElement = getDragAfterElement(this, e.clientY);
    
    // Remove existing placeholder
    const existingPlaceholder = document.querySelector('.card-placeholder');
    if (existingPlaceholder) {
        existingPlaceholder.remove();
    }
    
    if (afterElement == null) {
        this.appendChild(placeholder);
    } else {
        this.insertBefore(placeholder, afterElement);
    }
}

function handleContainerDrop(e) {
    e.preventDefault();
    
    if (!draggedElement) return;
    
    const afterElement = getDragAfterElement(this, e.clientY);
    
    // Remove placeholder
    const existingPlaceholder = document.querySelector('.card-placeholder');
    if (existingPlaceholder) {
        existingPlaceholder.remove();
    }
    
    if (afterElement == null) {
        this.appendChild(draggedElement);
    } else {
        this.insertBefore(draggedElement, afterElement);
    }
}

function handleContainerDragEnter(e) {
    e.preventDefault();
}

// Announce reorder to screen readers
function announceReorder(card, newPosition, totalCards) {
    const title = card.querySelector('.card-title').textContent;
    const announcement = `${title} moved to position ${newPosition} of ${totalCards}`;
    
    // Create temporary announcement element
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'assertive');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'visually-hidden';
    announcer.textContent = announcement;
    
    document.body.appendChild(announcer);
    
    // Remove after announcement
    setTimeout(() => {
        document.body.removeChild(announcer);
    }, 1000);
}

// Initialize page
function initializePage() {
    // Update date and time immediately
    updateDateTime();
    
    // Update time every second
    setInterval(updateDateTime, 1000);
    
    // Initialize drag and drop functionality
    initializeDragAndDrop();
    
    // Show cards with animation
    setTimeout(() => {
        const cards = document.querySelectorAll('.app-card');
        cards.forEach(card => {
            card.style.opacity = '1';
        });
    }, 100);
}

// Handle page load
document.addEventListener('DOMContentLoaded', initializePage);

// Handle visibility change (when user switches tabs)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        updateDateTime();
    }
});

// Optional: Add some interactive feedback
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('card-button')) {
        // Add a subtle click effect
        e.target.style.transform = 'scale(0.98)';
        setTimeout(() => {
            e.target.style.transform = '';
        }, 100);
    }
});

// Handle keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        // Ensure focus is visible on card buttons
        setTimeout(() => {
            const focused = document.activeElement;
            if (focused && focused.classList.contains('card-button')) {
                focused.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, 0);
    }
});

