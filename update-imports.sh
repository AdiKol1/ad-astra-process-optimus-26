#!/bin/bash

# Update imports in all TypeScript/React files
find src -type f -name "*.tsx" -exec sed -i '' 's|from '\''.*contexts/assessment/AssessmentContext'\''|from '\''../../../hooks/useAssessment'\''|g' {} +

# Make the script executable
chmod +x update-imports.sh
