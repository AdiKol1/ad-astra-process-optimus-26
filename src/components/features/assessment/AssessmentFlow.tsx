import React from 'react';
import { useAssessment } from '@/contexts/assessment/AssessmentContext';
import { useUI } from '@/contexts/ui/UIProvider';
import { useAssessmentForm } from '@/contexts/assessment/FormProvider';
import QuestionRenderer from './flow/QuestionRenderer';
import LeadCapture from './LeadCapture';
import ProcessSection from './steps/ProcessSection';
import ErrorBoundary from '../../common/ErrorBoundary';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { telemetry } from '@/utils/monitoring/telemetry';
import { AssessmentStep, STEP_CONFIG } from '@/types/assessment/steps';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createPerformanceMonitor } from '@/utils/monitoring/performance';
import { TEST_IDS } from '@/test/utils/constants';

const performanceMonitor = createPerformanceMonitor('AssessmentFlow');

export const AssessmentFlow: React.FC = () => {
  const { 
    state, 
    isInitialized,
    getStepMetrics,
    canMoveToStep,
    getStepHistory,
    error 
  } = useAssessment();
  const { isLoading } = useUI();
  const { isValid } = useAssessmentForm();
  const currentStep = state.currentStep;

  // Performance monitoring for slow renders
  const renderTimeRef = React.useRef<number>(0);

  React.useEffect(() => {
    const mark = performanceMonitor.start('step_render');
    
    return () => {
      const renderTime = performanceMonitor.end(mark);
      if (renderTime > 100) { // 100ms threshold
        telemetry.track('assessment_flow_slow_render', {
          step: currentStep,
          renderTime,
          ...getStepMetrics()
        });
      }
    };
  }, [currentStep, getStepMetrics]);

  // Track step changes and validation state
  React.useEffect(() => {
    const stepHistory = getStepHistory();
    telemetry.track('assessment_flow_step_changed', { 
      step: currentStep,
      isValid,
      isInitialized,
      stepCount: stepHistory.length,
      canMoveForward: currentStep && STEP_CONFIG[currentStep]?.nextStep ? 
        canMoveToStep(STEP_CONFIG[currentStep].nextStep!) : 
        false
    });
  }, [currentStep, isValid, isInitialized, canMoveToStep, getStepHistory]);

  const renderStep = () => {
    // Don't render until assessment is initialized
    if (!isInitialized) {
      return (
        <Card className="p-6">
          <div 
            role="status"
            data-testid={TEST_IDS.LOADING_SPINNER}
            className="flex items-center justify-center"
          >
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        </Card>
      );
    }

    // Show error state if present
    if (error) {
      return (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription data-testid={TEST_IDS.ERROR_MESSAGE}>
            {error}
          </AlertDescription>
        </Alert>
      );
    }

    const mark = performanceMonitor.start('render_step_content');
    try {
      switch (currentStep as AssessmentStep) {
        case 'lead-capture':
          return (
            <div data-testid={TEST_IDS.LEAD_CAPTURE}>
              <LeadCapture />
            </div>
          );
        case 'process':
          return (
            <div data-testid={TEST_IDS.PROCESS_SECTION}>
              <ProcessSection />
            </div>
          );
        default:
          return (
            <Card className="p-6 space-y-4">
              <h1 className="text-2xl font-semibold tracking-tight">
                {STEP_CONFIG[currentStep]?.title || 'Welcome to the Assessment'}
              </h1>
              <Separator className="my-4" />
              <QuestionRenderer 
                step={currentStep}
                config={STEP_CONFIG[currentStep]}
              />
            </Card>
          );
      }
    } finally {
      performanceMonitor.end(mark);
    }
  };

  return (
    <div 
      data-testid={TEST_IDS.ASSESSMENT_FLOW}
      className={isLoading ? 'opacity-50 pointer-events-none' : ''}
    >
      <ErrorBoundary
        fallback={
          <Card className="p-4 bg-destructive/10 text-destructive">
            <p data-testid={TEST_IDS.ERROR_MESSAGE}>
              Something went wrong. Please refresh the page.
            </p>
          </Card>
        }
        onError={(error) => {
          telemetry.track('assessment_flow_error', {
            step: currentStep,
            error: error.message,
            ...getStepMetrics()
          });
        }}
      >
        {renderStep()}
      </ErrorBoundary>
    </div>
  );
};# Create these files in the root directory
cat > package.json << 'EOL'
{
  "name": "ad-astra-process-optimus",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "test": "vitest",
    "test:coverage": "vitest run --coverage",
    "format": "prettier --write \"src/**/*.{ts,tsx,scss}\""
  },
  "dependencies": {
    "@emotion/react": "^11.11.1",
    "@emotion/styled": "^11.11.0",
    "axios": "^1.6.2",
    "date-fns": "^2.30.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@emotion/babel-plugin": "^11.11.0",
    "@testing-library/jest-dom": "^6.1.4",
    "@testing-library/react": "^14.1.2",
    "@testing-library/user-event": "^14.5.1",
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.39",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.13.1",
    "@typescript-eslint/parser": "^6.13.1",
    "@vitejs/plugin-react": "^4.2.0",
    "@vitest/coverage-v8": "^0.34.6",
    "eslint": "^8.54.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.4",
    "jsdom": "^22.1.0",
    "prettier": "^3.1.0",
    "sass": "^1.69.5",
    "typescript": "^5.3.2",
    "vite": "^5.0.4",
    "vite-tsconfig-paths": "^4.2.1",
    "vitest": "^0.34.6"
  }
}
EOL

cat > vite.config.ts << 'EOL'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin']
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@utils': path.resolve(__dirname, './src/utils')
    }
  },
  server: {
    port: 3000,
    open: true,
    cors: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',
    target: 'esnext'
  }
});
EOL

cat > tsconfig.json << 'EOL'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@contexts/*": ["src/contexts/*"],
      "@utils/*": ["src/utils/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOL

cat > tsconfig.node.json << 'EOL'
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
EOL

# Create src directory structure
mkdir -p src/{components/features/assessment,contexts,utils,styles}

# Create main entry point
cat > src/main.tsx << 'EOL'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
EOL

# Create App component
cat > src/App.tsx << 'EOL'
import { AssessmentFlow } from './components/features/assessment/AssessmentFlow'

function App() {
  return (
    <div className="app">
      <AssessmentFlow />
    </div>
  )
}

export default App
EOL

# Create index.html
cat > index.html << 'EOL'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ad Astra Process Optimus</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOL