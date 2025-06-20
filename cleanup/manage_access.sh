#!/bin/bash

# Print usage instructions
print_usage() {
    echo "Usage: $0 [allow|deny] <file_path>"
    echo
    echo "Arguments:"
    echo "  allow|deny    - Action to perform (allow = readable, deny = non-readable)"
    echo "  file_path     - Path to the file to restrict"
    echo
    echo "Examples:"
    echo "  $0 allow /path/to/file.txt   # Make file readable"
    echo "  $0 deny /path/to/file.txt    # Make file non-readable"
    echo
    echo "To set up automatic time restrictions:"
    echo "  crontab -e"
    echo "Then add lines like:"
    echo "  0 11 * * * $0 allow /path/to/file.txt  # Allow at 11 AM"
    echo "  0 12 * * * $0 deny /path/to/file.txt   # Deny at 12 PM"
}

# Check if correct number of arguments is provided
if [ "$#" -ne 2 ]; then
    print_usage
    exit 1
fi

ACTION="$1"
FILE_PATH="$2"

# Validate the action argument
if [[ "$ACTION" != "allow" && "$ACTION" != "deny" ]]; then
    echo "Error: Invalid action. Must be 'allow' or 'deny'"
    print_usage
    exit 1
fi

# Check if file exists
if [ ! -f "$FILE_PATH" ]; then
    echo "Error: File not found: $FILE_PATH"
    exit 1
fi

# Check if we have permission to modify the file
if [ ! -w "$(dirname "$FILE_PATH")" ]; then
    echo "Error: No permission to modify file: $FILE_PATH"
    exit 1
fi

# Perform the requested action
case "$ACTION" in
    "allow")
        if chmod 644 "$FILE_PATH"; then
            echo "Access allowed: $FILE_PATH is now readable"
        else
            echo "Error: Failed to set permissions on $FILE_PATH"
            exit 1
        fi
        ;;
    "deny")
        if chmod 000 "$FILE_PATH"; then
            echo "Access denied: $FILE_PATH is now non-readable"
        else
            echo "Error: Failed to set permissions on $FILE_PATH"
            exit 1
        fi
        ;;
esac

