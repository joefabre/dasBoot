#!/bin/zsh
#
# brain_tree.sh - Interactive hierarchical tree management tool
# Created: $(date '+%Y-%m-%d')
#

# --- Configuration ---
BASE_DIR="$HOME/Documents/brain_trees"
CURRENT_TREE=""
TREE_DATA=""
MODIFIED=false

# Create base directory if it doesn't exist
mkdir -p "$BASE_DIR" 2>/dev/null

# --- ANSI Color Codes ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
RESET='\033[0m'
BOLD='\033[1m'

# --- Dependency Check ---
check_dependencies() {
  local missing=false
  
  if ! command -v jq &>/dev/null; then
    echo -e "${RED}Error: jq is not installed.${RESET}"
    echo "Please install jq for JSON processing (brew install jq)"
    missing=true
  fi
  
  if ! command -v pandoc &>/dev/null; then
    echo -e "${RED}Error: pandoc is not installed.${RESET}"
    echo "Please install pandoc for document conversion (brew install pandoc)"
    missing=true
  fi
  
  if $missing; then
    exit 1
  fi
}

# --- Helper Functions ---
generate_timestamp() {
  date '+%Y-%m-%d %H:%M:%S'
}

# Generate a random 4-digit ID that doesn't exist in the current tree
generate_id() {
  local id
  local exists=true
  
  # Only check for existing IDs if we have tree data
  if [[ -n "$TREE_DATA" ]]; then
    while $exists; do
      # Generate random 4-digit ID
      id=$(( 1000 + RANDOM % 9000 ))
      
      # Check if this ID already exists in the tree
      if ! echo "$TREE_DATA" | jq -e ".. | select(.id? == \"$id\")" > /dev/null; then
        exists=false
      fi
    done
  else
    # If no tree data, just generate a random ID
    id=$(( 1000 + RANDOM % 9000 ))
  fi
  
  echo "$id"
}

print_header() {
  clear
  echo -e "${BOLD}${BLUE}=== Brain Tree - Interactive Mind Mapping Tool ===${RESET}"
  
  # Display current tree name if one is loaded
  if [[ -n "${CURRENT_TREE}" ]]; then
    echo -e "${CYAN}Current Tree:${RESET} ${CURRENT_TREE}"
  else
    echo -e "${CYAN}Current Tree:${RESET} None"
  fi
  
  echo
}

ensure_base_dir() {
  if [[ ! -d "$BASE_DIR" ]]; then
    mkdir -p "$BASE_DIR"
    if [[ $? -ne 0 ]]; then
      echo -e "${RED}Error: Failed to create directory $BASE_DIR${RESET}"
      exit 1
    fi
    echo -e "${GREEN}Created directory $BASE_DIR${RESET}"
  fi
}

confirm_action() {
  local prompt="${1:-Are you sure? [y/N]}"
  local response
  
  echo -en "${YELLOW}$prompt ${RESET}"
  read -r response
  
  [[ "$response" =~ ^[Yy]$ ]]
  return $?
}

backup_file() {
  local file="$1"
  if [[ -f "$file" ]]; then
    local backup="${file}.bak"
    cp "$file" "$backup"
    echo -e "${GREEN}Backup created: $backup${RESET}"
  fi
}

validate_json() {
  local json="$1"
  
  if ! echo "$json" | jq . &>/dev/null; then
    return 1
  fi
  
  return 0
}

# --- Tree Operations ---
create_new_tree() {
  print_header
  echo -e "${BOLD}Create New Tree${RESET}"
  echo
  
  # Check for unsaved changes
  if [[ "$MODIFIED" == "true" && -n "$CURRENT_TREE" ]]; then
    if confirm_action "Unsaved changes will be lost. Continue? [y/N]"; then
      # Continue with new tree creation
      MODIFIED=false
    else
      return
    fi
  fi
  
  local name
  local root_content
  
  echo -n "Enter tree name: "
  read -r name
  
  if [[ -z "$name" ]]; then
    echo -e "${RED}Tree name cannot be empty.${RESET}"
    sleep 2
    return
  fi
  
  # Sanitize filename
  name=$(echo "$name" | tr -cd 'a-zA-Z0-9_-')
  
  echo -n "Enter root node content: "
  read -r root_content
  
  if [[ -z "$root_content" ]]; then
    echo -e "${RED}Root node content cannot be empty.${RESET}"
    sleep 2
    return
  fi
  
  local timestamp=$(generate_timestamp)
  local root_id=$(generate_id)
  
  # Create initial JSON structure
  TREE_DATA=$(cat <<EOF
{
  "metadata": {
    "name": "$name",
    "created": "$timestamp",
    "modified": "$timestamp"
  },
  "root": {
    "id": "$root_id",
    "content": "$root_content",
    "children": []
  }
}
EOF
)
  
  CURRENT_TREE="$name"
  MODIFIED=true
  
  echo -e "${GREEN}New tree '$name' created successfully.${RESET}"
  sleep 1
}

add_node() {
  print_header
  echo -e "${BOLD}Add Node${RESET}"
  echo
  
  if [[ -z "$TREE_DATA" ]]; then
    echo -e "${RED}No tree loaded. Please create or load a tree first.${RESET}"
    sleep 2
    return
  fi
  
  # Display current tree
  display_tree
  
  echo
  echo "Enter the ID of the parent node (or 'root' for the root node):"
  read -r parent_id
  
  if [[ -z "$parent_id" ]]; then
    echo -e "${RED}Parent ID cannot be empty.${RESET}"
    sleep 2
    return
  fi
  
  # If user entered "root", get the actual root node ID
  if [[ "$parent_id" == "root" ]]; then
    parent_id=$(echo "$TREE_DATA" | jq -r '.root.id')
  fi
  
  # Check if the parent node exists
  if ! echo "$TREE_DATA" | jq -e ".. | select(.id? == \"$parent_id\")" > /dev/null; then
    echo -e "${RED}Parent node with ID '$parent_id' not found.${RESET}"
    sleep 2
    return
  fi
  
  echo "Enter the content for the new node:"
  read -r content
  
  if [[ -z "$content" ]]; then
    echo -e "${RED}Node content cannot be empty.${RESET}"
    sleep 2
    return
  fi
  
  # Generate a unique ID for the new node
  local new_id=$(generate_id)
  
  # Function to add a node to the tree recursively
  add_node_to_tree() {
    local json="$1"
    local parent="$2"
    local id="$3"
    local content="$4"
    
    # If we're at the root and root is the parent
    if [[ "$parent" == "$(echo "$json" | jq -r '.root.id')" ]]; then
      echo "$json" | jq --arg id "$id" --arg content "$content" '.root.children += [{"id": $id, "content": $content, "children": []}]'
      return
    fi
    
    # Process the tree recursively
    echo "$json" | jq --arg pid "$parent" --arg id "$id" --arg content "$content" '
      def process(node):
        if node.id == $pid then
          node + {children: (node.children + [{"id": $id, "content": $content, "children": []}])}
        elif node.children then
          node + {children: [node.children[] | process]}
        else
          node
        end;
      
      if .root.id == $pid then
        .root.children += [{"id": $id, "content": $content, "children": []}]
      else
        . + {root: process(.root)}
      end
    '
  }
  
  # Add the new node
  TREE_DATA=$(add_node_to_tree "$TREE_DATA" "$parent_id" "$new_id" "$content")
  
  # Update modification timestamp
  TREE_DATA=$(echo "$TREE_DATA" | jq --arg ts "$(generate_timestamp)" '.metadata.modified = $ts')
  
  MODIFIED=true
  
  echo -e "${GREEN}Node added successfully.${RESET}"
  sleep 1
}

edit_node() {
  print_header
  echo -e "${BOLD}Edit Node${RESET}"
  echo
  
  if [[ -z "$TREE_DATA" ]]; then
    echo -e "${RED}No tree loaded. Please create or load a tree first.${RESET}"
    sleep 2
    return
  fi
  
  # Display current tree
  display_tree
  
  echo
  echo "Enter the ID of the node to edit:"
  read -r node_id
  
  if [[ -z "$node_id" ]]; then
    echo -e "${RED}Node ID cannot be empty.${RESET}"
    sleep 2
    return
  fi
  
  # If user entered "root", get the actual root node ID
  if [[ "$node_id" == "root" ]]; then
    node_id=$(echo "$TREE_DATA" | jq -r '.root.id')
  fi
  
  # Check if the node exists and get current content
  local current_content
  current_content=$(echo "$TREE_DATA" | jq -r ".. | select(.id? == \"$node_id\").content // empty")
  
  if [[ -z "$current_content" ]]; then
    echo -e "${RED}Node with ID '$node_id' not found.${RESET}"
    sleep 2
    return
  fi
  
  echo "Current content: $current_content"
  echo "Enter new content (leave empty to cancel):"
  read -r new_content
  
  if [[ -z "$new_content" ]]; then
    echo -e "${YELLOW}Edit cancelled.${RESET}"
    sleep 2
    return
  fi
  
  # Function to update a node in the tree recursively
  update_node_in_tree() {
    local json="$1"
    local node_id="$2"
    local content="$3"
    
    # If we're at the root
    if [[ "$node_id" == "$(echo "$json" | jq -r '.root.id')" ]]; then
      echo "$json" | jq --arg content "$content" '.root.content = $content'
      return
    fi
    
    # Process the tree recursively
    echo "$json" | jq --arg id "$node_id" --arg content "$content" '
      def process(node):
        if node.id == $id then
          node + {content: $content}
        elif node.children then
          node + {children: [node.children[] | process]}
        else
          node
        end;
      
      . + {root: process(.root)}
    '
  }
  
  # Update the node
  TREE_DATA=$(update_node_in_tree "$TREE_DATA" "$node_id" "$new_content")
  
  # Update modification timestamp
  TREE_DATA=$(echo "$TREE_DATA" | jq --arg ts "$(generate_timestamp)" '.metadata.modified = $ts')
  
  MODIFIED=true
  
  echo -e "${GREEN}Node updated successfully.${RESET}"
  sleep 1
}

delete_node() {
  print_header
  echo -e "${BOLD}Delete Node${RESET}"
  echo
  
  if [[ -z "$TREE_DATA" ]]; then
    echo -e "${RED}No tree loaded. Please create or load a tree first.${RESET}"
    sleep 2
    return
  fi
  
  # Display current tree
  display_tree
  
  echo
  echo "Enter the ID of the node to delete:"
  read -r node_id
  
  if [[ -z "$node_id" ]]; then
    echo -e "${RED}Node ID cannot be empty.${RESET}"
    sleep 2
    return
  fi
  
  # Check if trying to delete root
  local root_id=$(echo "$TREE_DATA" | jq -r '.root.id')
  if [[ "$node_id" == "$root_id" || "$node_id" == "root" ]]; then
    echo -e "${RED}Cannot delete the root node.${RESET}"
    sleep 2
    return
  fi
  
  # Check if the node exists
  if ! echo "$TREE_DATA" | jq -e ".. | select(.id? == \"$node_id\")" > /dev/null; then
    echo -e "${RED}Node with ID '$node_id' not found.${RESET}"
    sleep 2
    return
  fi
  
  # Confirm deletion
  if ! confirm_action "This will delete the node and all its children. Continue? [y/N]"; then
    echo -e "${YELLOW}Deletion cancelled.${RESET}"
    sleep 2
    return
  fi
  
  # Function to delete a node from the tree recursively
  delete_node_from_tree() {
    local json="$1"
    local node_id="$2"
    
    # Process the tree recursively
    echo "$json" | jq --arg id "$node_id" '
      def process(node):
        node + {children: [node.children[] | select(.id != $id) | process]};
      
      . + {root: process(.root)}
    '
  }
  
  # Delete the node
  TREE_DATA=$(delete_node_from_tree "$TREE_DATA" "$node_id")
  
  # Update modification timestamp
  TREE_DATA=$(echo "$TREE_DATA" | jq --arg ts "$(generate_timestamp)" '.metadata.modified = $ts')
  
  MODIFIED=true
  
  echo -e "${GREEN}Node deleted successfully.${RESET}"
  sleep 1
}

display_tree() {
  if [[ -z "$TREE_DATA" ]]; then
    echo -e "${RED}No tree loaded. Please create or load a tree first.${RESET}"
    return 1
  fi
  
  local tree_name=$(echo "$TREE_DATA" | jq -r '.metadata.name')
  local created=$(echo "$TREE_DATA" | jq -r '.metadata.created')
  local modified=$(echo "$TREE_DATA" | jq -r '.metadata.modified')
  
  echo -e "${BOLD}Tree: ${GREEN}$tree_name${RESET}"
  echo -e "Created: $created"
  echo -e "Modified: $modified"
  echo
  
  # Extract root node information
  local root_id=$(echo "$TREE_DATA" | jq -r '.root.id')
  local root_content=$(echo "$TREE_DATA" | jq -r '.root.content')
  
  # Print root node
  echo -e "${BOLD}${MAGENTA}[${root_id}] ${root_content}${RESET}"
  
  # Get children of root
  local children=$(echo "$TREE_DATA" | jq -c '.root.children[]?')
  
  # Print child nodes recursively
  print_children() {
    local node_json="$1"
    local prefix="$2"
    local last="$3"
    
    # Extract node information
    local id=$(echo "$node_json" | jq -r '.id')
    local content=$(echo "$node_json" | jq -r '.content')
    local has_children=$(echo "$node_json" | jq -e '.children | length > 0')
    
    # Determine branch characters
    local branch
    local new_prefix
    
    if [[ "$last" == "true" ]]; then
      branch="└── "
      new_prefix="$prefix    "
    else
      branch="├── "
      new_prefix="$prefix│   "
    fi
    
    # Print this node
    echo -e "$prefix$branch${CYAN}[${id}]${RESET} $content"
    
    # Process children if any
    if [[ "$has_children" == "0" ]]; then
      return
    fi
    
    # Get all children
    local children=$(echo "$node_json" | jq -c '.children[]?')
    local child_count=$(echo "$node_json" | jq '.children | length')
    local counter=0
    
    # Process each child
    while IFS= read -r child; do
      if [[ -n "$child" ]]; then
        ((counter++))
        local is_last=$([ "$counter" -eq "$child_count" ] && echo "true" || echo "false")
        print_children "$child" "$new_prefix" "$is_last"
      fi
    done <<< "$children"
  }
  
  # Process children of root
  local child_count=$(echo "$TREE_DATA" | jq '.root.children | length')
  local counter=0
  
  while IFS= read -r child; do
    if [[ -n "$child" ]]; then
      ((counter++))
      local is_last=$([ "$counter" -eq "$child_count" ] && echo "true" || echo "false")
      print_children "$child" "" "$is_last"
    fi
  done <<< "$children"
  
  echo
  return 0
}

save_tree() {
  print_header
  echo -e "${BOLD}Save Tree${RESET}"
  echo
  
  if [[ -z "$TREE_DATA" ]]; then
    echo -e "${RED}No tree loaded. Please create or load a tree first.${RESET}"
    sleep 2
    return
  fi
  
  local tree_name=$(echo "$TREE_DATA" | jq -r '.metadata.name')
  local file_path="$BASE_DIR/${tree_name}.json"
  
  if [[ -f "$file_path" ]]; then
    if ! confirm_action "Tree file already exists. Overwrite? [y/N]"; then
      echo -e "${YELLOW}Save cancelled.${RESET}"
      sleep 2
      return
    fi
    
    # Create backup
    backup_file "$file_path"
  fi
  
  # Ensure base directory exists
  ensure_base_dir
  
  # Write to a temporary file first
  local temp_file="$(mktemp)"
  echo "$TREE_DATA" | jq . > "$temp_file"
  
  # Move the temporary file to the final location
  if mv "$temp_file" "$file_path"; then
    chmod 600 "$file_path"  # Set secure permissions
    echo -e "${GREEN}Tree saved successfully to $file_path${RESET}"
    MODIFIED=false
  else
    echo -e "${RED}Failed to save tree to $file_path${RESET}"
    rm -f "$temp_file"  # Clean up temp file
  fi
  
  sleep 1
}

load_tree() {
  print_header
  echo -e "${BOLD}Load Tree${RESET}"
  echo
  
  # Check for unsaved changes
  if [[ "$MODIFIED" == "true" && -n "$CURRENT_TREE" ]]; then
    if ! confirm_action "Unsaved changes will be lost. Continue? [y/N]"; then
      echo -e "${YELLOW}Load cancelled.${RESET}"
      sleep 2
      return
    fi
  fi
  
  # Ensure base directory exists
  ensure_base_dir
  
  # List available trees
  echo "Available trees:"
  local tree_files=("$BASE_DIR"/*.json)
  
  if [[ ! -e "${tree_files[0]}" ]]; then
    echo -e "${YELLOW}No saved trees found.${RESET}"
    sleep 2
    return
  fi
  
  local i=1
  for file in "${tree_files[@]}"; do
    if [[ -f "$file" ]]; then
      local name=$(basename "$file" .json)
      echo "[$i] $name"
      ((i++))
    fi
  done
  
  echo
  echo "Enter the number of the tree to load (or 'q' to cancel):"
  read -r selection
  
  if [[ "$selection" == "q" || -z "$selection" ]]; then
    echo -e "${YELLOW}Load cancelled.${RESET}"
    sleep 2
    return
  fi
  
  # Validate selection
  if ! [[ "$selection" =~ ^[0-9]+$ ]] || [ "$selection" -lt 1 ] || [ "$selection" -gt "${#tree_files[@]}" ]; then
    echo -e "${RED}Invalid selection.${RESET}"
    sleep 2
    return
  fi
  
  local file="${tree_files[$((selection-1))]}"
  
  if ! [[ -f "$file" ]]; then
    echo -e "${RED}Selected file does not exist.${RESET}"
    sleep 2
    return
  fi
  
  # Load file content
  local file_content
  file_content=$(cat "$file")
  
  # Validate JSON
  if ! validate_json "$file_content"; then
    echo -e "${RED}Invalid tree file format.${RESET}"
    sleep 2
    return
  fi
  
  # Extract tree name
  local tree_name
  tree_name=$(echo "$file_content" | jq -r '.metadata.name')
  
  # Set current tree
  TREE_DATA="$file_content"
  CURRENT_TREE="$tree_name"
  MODIFIED=false
  
  echo -e "${GREEN}Tree '$tree_name' loaded successfully.${RESET}"
  sleep 1
}

export_to_word() {
  print_header
  echo -e "${BOLD}Export to Word Document${RESET}"
  echo
  
  if [[ -z "$TREE_DATA" ]]; then
    echo -e "${RED}No tree loaded. Please create or load a tree first.${RESET}"
    sleep 2
    return
  fi
  
  local tree_name=$(echo "$TREE_DATA" | jq -r '.metadata.name')
  local created=$(echo "$TREE_DATA" | jq -r '.metadata.created')
  local modified=$(echo "$TREE_DATA" | jq -r '.metadata.modified')
  local output_file="$HOME/Documents/${tree_name}.docx"
  
  # Ask for custom filename
  echo -e "Enter output filename (default: ${tree_name}.docx):"
  read -r custom_filename
  
  if [[ -n "$custom_filename" ]]; then
    # Sanitize filename
    custom_filename=$(echo "$custom_filename" | tr -cd 'a-zA-Z0-9_-.')
    
    # Ensure .docx extension
    if ! [[ "$custom_filename" =~ \.docx$ ]]; then
      custom_filename="${custom_filename}.docx"
    fi
    
    output_file="$HOME/Documents/$custom_filename"
  fi
  
  if [[ -f "$output_file" ]]; then
    if ! confirm_action "File already exists. Overwrite? [y/N]"; then
      echo -e "${YELLOW}Export cancelled.${RESET}"
      sleep 2
      return
    fi
  fi
  
  # Create temporary markdown file
  local temp_md=$(mktemp)
  
  # Write header
  cat > "$temp_md" << EOF
# ${tree_name}

Created: ${created}  
Modified: ${modified}

## Tree Structure

EOF
  
  # Function to generate markdown recursively
  generate_markdown() {
    local node_json="$1"
    local level="$2"
    
    # Extract information
    local content=$(echo "$node_json" | jq -r '.content')
    local children=$(echo "$node_json" | jq -c '.children[]?')
    
    # Create proper markdown indentation
    local indent=""
    for ((i=0; i<level; i++)); do
      indent="$indent  "
    done
    
    # Write this node
    echo "${indent}- ${content}" >> "$temp_md"
    
    # Process children
    while IFS= read -r child; do
      if [[ -n "$child" ]]; then
        generate_markdown "$child" $((level+1))
      fi
    done <<< "$children"
  }
  
  # Get root content and write it
  local root_content=$(echo "$TREE_DATA" | jq -r '.root.content')
  echo "- ${root_content}" >> "$temp_md"
  
  # Process children of root
  local children=$(echo "$TREE_DATA" | jq -c '.root.children[]?')
  
  while IFS= read -r child; do
    if [[ -n "$child" ]]; then
      generate_markdown "$child" 1
    fi
  done <<< "$children"
  
  # Convert to Word using pandoc
  if pandoc -f markdown -t docx "$temp_md" -o "$output_file"; then
    echo -e "${GREEN}Tree exported successfully to $output_file${RESET}"
  else
    echo -e "${RED}Failed to export tree to Word document.${RESET}"
  fi
  
  # Clean up
  rm -f "$temp_md"
  
  sleep 2
}

# --- Signal Handling ---
cleanup() {
  echo
  
  # Check if we have unsaved changes and a tree is loaded
  if [[ "${MODIFIED}" == "true" && -n "${CURRENT_TREE}" ]]; then
    if confirm_action "You have unsaved changes. Save before exiting? [y/N]"; then
      save_tree
    fi
  fi
  
  echo -e "${GREEN}Thank you for using Brain Tree!${RESET}"
  exit 0
}

# Set up signal trapping
trap cleanup SIGINT SIGTERM

# --- Main Menu and Program Loop ---
main_menu() {
  while true; do
    print_header
    
    echo -e "${BOLD}Main Menu${RESET}"
    echo
    echo -e "[${BOLD}1${RESET}] Create New Tree     [${BOLD}2${RESET}] Add Node"
    echo -e "[${BOLD}3${RESET}] Edit Node           [${BOLD}4${RESET}] Delete Node"
    echo -e "[${BOLD}5${RESET}] Display Tree        [${BOLD}6${RESET}] Save Tree"
    echo -e "[${BOLD}7${RESET}] Load Tree           [${BOLD}8${RESET}] Export to Word"
    echo -e "[${BOLD}Q${RESET}] Quit"
    echo
    
    echo -n "Enter your choice: "
    read -r choice
    
    case "$choice" in
      1) create_new_tree ;;
      2) add_node ;;
      3) edit_node ;;
      4) delete_node ;;
      5) 
         print_header
         echo -e "${BOLD}Tree Display${RESET}"
         echo
         display_tree
         echo
         echo -e "Press Enter to continue..."
         read -r
         ;;
      6) save_tree ;;
      7) load_tree ;;
      8) export_to_word ;;
      [qQ]) cleanup ;;
      *) 
         echo -e "${RED}Invalid choice. Please try again.${RESET}"
         sleep 1
         ;;
    esac
  done
}

# --- Main Execution ---

# Reset variables to ensure clean state
CURRENT_TREE=""
TREE_DATA=""
MODIFIED=false

# Check for dependencies
check_dependencies

# Ensure base directory exists
ensure_base_dir

# Start the main menu
main_menu
