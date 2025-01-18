# Process Optimus - Business Process Assessment Tool

## Overview
Process Optimus is a modern web application built with React, TypeScript, and Vite that helps businesses assess and optimize their processes. The application provides industry insights, process automation recommendations, and efficiency scoring.

## Tech Stack
- Frontend: React 18 with TypeScript
- Styling: Tailwind CSS
- UI Components: Material-UI, Radix UI
- State Management: React Context
- Form Handling: React Hook Form with Zod validation
- Testing: Vitest
- Database: Supabase

## Getting Started

### Prerequisites
- Node.js 18+ or Bun runtime
- npm or bun package manager

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Install dependencies (using npm)
npm install

# Or using bun
bun install

# Start development server
npm run dev
# or
bun run dev
```

### Environment Variables
Copy `.env.example` to `.env` and fill in the required values:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

## Project Structure
```
src/
├── components/     # Reusable UI components
├── contexts/       # React contexts for state management
├── hooks/         # Custom React hooks
├── pages/         # Page components
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## Testing
```bash
# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## Contributing
1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## License
[License Type] - see LICENSE file for details

## Development Guidelines

### ⚠️ CRITICAL GUIDELINES - DO NOT IGNORE ⚠️

1. **ABSOLUTELY NO CHANGES WITHOUT EXPLICIT APPROVAL**
   - 🛑 NEVER make code changes without explaining what and why
   - ✋ ALWAYS get explicit approval before modifying ANY code
   - 🔍 ALWAYS analyze potential impacts on other components
   - ⏳ NEVER rush into changes without understanding the full system
   - 🧪 NEVER use the codebase as a testing ground

2. **Mandatory Change Management Process**
   - Step 1: Analyze the issue in detail
   - Step 2: Document ALL potential impacts
   - Step 3: Present a clear plan with alternatives
   - Step 4: Wait for EXPLICIT approval
   - Step 5: Make changes incrementally
   - Step 6: Verify each change thoroughly

3. **Code Modification Rules**
   - ALL changes must be justified
   - ALL impacts must be documented
   - ALL dependencies must be checked
   - NO experimental changes
   - NO "let's try this" approaches
   - NO rushing into solutions

### Violation of these guidelines will result in immediate rollback of changes.

## How can I edit this code?

There are several ways of editing your application.

**Use GPT Engineer**

Simply visit the GPT Engineer project at [GPT Engineer](https://gptengineer.app/projects/428b3a70-a2df-4d94-a777-c7316c456c84/improve) and start prompting.

Changes made via gptengineer.app will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in the GPT Engineer UI.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

All GPT Engineer projects can be deployed directly via the GPT Engineer app.

Simply visit your project at [GPT Engineer](https://gptengineer.app/projects/428b3a70-a2df-4d94-a777-c7316c456c84/improve) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.gptengineer.app/tips-tricks/custom-domain/)
