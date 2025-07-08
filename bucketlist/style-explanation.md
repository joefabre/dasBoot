# CSS Explanation: style.css

## Line-by-Line Explanation

### Global Styles & Reset (Lines 1-6)

- **Line 1:** `/* Apple Terminal Styling with Accessibility */` — Comment describing the styling approach - mimicking Apple Terminal with a focus on accessibility features.

- **Lines 2-6:** `* { margin: 0; padding: 0; box-sizing: border-box; }` — Universal selector that resets all margins and paddings to zero, and sets box-sizing to border-box for predictable sizing.

### Accessibility Features (Lines 8-34)

- **Lines 9-19:** `.sr-only { position: absolute; width: 1px; height: 1px; ... }` — Screen reader only class that hides content visually but keeps it accessible to assistive technologies.

- **Lines 22-34:** Focus styling rules — Comprehensive focus management with cyan outline for keyboard navigation. Includes :focus-visible for modern browsers.

### Body & Terminal Window (Lines 36-55)

- **Lines 36-45:** `body { font-family: 'SF Mono', 'Monaco', 'Menlo', 'Consolas', monospace; ... }` — Sets monospace font stack, dark background (#1e1e1e), light text, and subtle grid pattern background.

- **Lines 47-55:** `.terminal-window { max-width: 1200px; ... }` — Main terminal window styling with rounded corners, shadow, and dark border to simulate a real terminal.

### Terminal Header (Lines 58-152)

- **Lines 58-64:** `.terminal-header { background: linear-gradient(180deg, #3c3c3c 0%, #2a2a2a 100%); ... }` — Creates a realistic terminal header with gradient background resembling macOS window chrome.

- **Lines 88-118:** Window control buttons (.button.close, .minimize, .maximize) — Styles the three window control buttons with authentic macOS colors (red, yellow, green) and hover effects.

- **Lines 129-152:** DateTime display styling — Positions and styles the real-time clock display in the terminal header with green terminal text color.

### Terminal Content Area (Lines 154-234)

- **Lines 154-160:** `.terminal-content { padding: 20px; min-height: 600px; ... }` — Main content area with black background and appropriate padding for terminal text display.

- **Lines 162-182:** Text styling (.output, .prompt, .command, .ascii-art) — Different text styles for terminal output, command prompts, commands, and ASCII art with improved contrast colors.

- **Lines 185-204:** High contrast mode support — Media query for users who prefer high contrast, adding text shadows and stronger outlines.

### Form Styling (Lines 207-279)

- **Lines 214-234:** `.terminal-input styling` — Styles input fields to look like terminal text with transparent background and cyan caret.

- **Lines 236-279:** Form sections and groups — Comprehensive form styling with dark backgrounds, proper spacing, and focus states.

### Bucket List Items (Lines 309-436)

- **Lines 309-327:** `.bucket-items-grid { display: grid; grid-template-columns: 1fr 1fr; ... }` — Creates a responsive grid layout for displaying bucket list items in two columns.

- **Lines 316-331:** `.bucket-item styling` — Individual item styling with dark background, border, and flexbox layout for proper content arrangement.

- **Lines 357-373:** Priority indicators (.priority-high, .priority-medium, .priority-low) — Color-coded priority badges using the same colors as the window control buttons (red, yellow, green).

- **Lines 403-435:** Action buttons styling — Hover effects for complete, edit, and delete buttons with appropriate color coding.

### Animations & Motion (Lines 469-489)

- **Lines 469-476:** `@keyframes typewriter animation` — Simple fade-in animation for typewriter effect on terminal output.

- **Lines 479-489:** `@media (prefers-reduced-motion: reduce)` — Respects user preference for reduced motion by disabling animations for accessibility.

### Responsive Design (Lines 570-620)

- **Lines 570-620:** `@media (max-width: 768px) { ... }` — Mobile-responsive adjustments including single-column grid, smaller fonts, and adjusted spacing for smaller screens.

- **Line 621:** `}` — Closing brace of the CSS file.
