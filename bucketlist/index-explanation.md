# HTML Explanation: index.html

## Line-by-Line Explanation

- **Line 1:** `<!DOCTYPE html>` — Declares the document type as HTML5. This tells the browser to interpret the document using HTML5 standards.

- **Line 2:** `<html lang="en">` — The root HTML element with language attribute set to English. This helps screen readers and search engines understand the document's language.

- **Line 3:** `<head>` — Opens the head section, which contains metadata about the document that isn't displayed on the page.

- **Line 4:** `<meta charset="UTF-8">` — Sets the character encoding to UTF-8, ensuring proper display of special characters and international text.

- **Line 5:** `<meta name="viewport" content="width=device-width, initial-scale=1.0">` — Ensures responsive design by setting the viewport width to device width and initial zoom to 100%.

- **Line 6:** `<title>Terminal Bucket List Manager - Accessible Web Application</title>` — Sets the page title that appears in the browser tab and is used by search engines.

- **Line 7:** `<meta name="description" content="A terminal-style bucket list manager...">` — Provides a description for search engines and social media sharing.

- **Line 8:** `<meta name="keywords" content="bucket list, goals, terminal...">` — Lists keywords for SEO purposes (though less important in modern search algorithms).

- **Line 9:** `<meta name="author" content="FABREulous Technology">` — Identifies the author/creator of the web page.

- **Line 10:** `<link rel="stylesheet" href="style.css">` — Links to the external CSS stylesheet that contains all the visual styling rules.

- **Lines 11-13:** Font preconnect and import links — Preconnects to Google Fonts servers and imports the SF Mono font family for the terminal appearance.

- **Line 16:** `<main class="terminal-window" role="main" aria-label="Terminal Bucket List Manager">` — Main content area with semantic role and accessibility label for screen readers.

- **Lines 18-29:** Terminal Header Section — Creates the terminal window header with close/minimize/maximize buttons and a date/time display, mimicking a real terminal window.

- **Lines 32-50:** Welcome Message and ASCII Art — Displays the application welcome message with ASCII art banner, simulating terminal startup output.

- **Line 53:** `<section id="bucket-list-display" role="region" aria-label="Bucket list items" aria-live="polite">` — Dynamic content area for displaying bucket list items. 'aria-live="polite"' announces changes to screen readers.

- **Lines 56-66:** Command Input Section — Terminal-style command input field with proper labeling and accessibility attributes.

- **Lines 69-71:** Screen Reader Help — Hidden help text for screen readers listing available commands (class "sr-only" makes it invisible but accessible).

- **Lines 74-125:** Add Item Form — Hidden form for adding new bucket list items with fields for event, date, category, and priority. Includes accessibility labels and help text.

- **Lines 128-179:** Edit Item Form — Similar to add form but for editing existing items. Pre-populated with current values when activated.

- **Line 184:** `<div id="audio-status" style="display: none;">Audio enabled</div>` — Hidden element for tracking audio status (used by JavaScript for typewriter sound effects).

- **Line 186:** `<script src="script.js"></script>` — Links to the external JavaScript file that provides all the interactive functionality.

- **Line 188:** `</html>` — Closes the HTML document.
