#!/bin/bash
# Ensure we're in the project directory
cd "$(dirname "$0")"

# Source nvm and use Node.js 18
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 18

# Run the tests with any passed arguments
npm run test "$@"
