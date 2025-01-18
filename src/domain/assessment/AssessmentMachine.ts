import { createMachine, interpret } from 'xstate';
import { 
  AssessmentData, 
  AssessmentEvent, 
  AssessmentStatus,
  StepId,
  ValidationError
} from './types';

export const createAssessmentMachine = (initialData: AssessmentData) => {
  return createMachine({
    id: 'assessment',
    initial: 'idle',
    context: {
      data: initialData,
      error: null as Error | null,
      validation: [] as ValidationError[]
    },
    states: {
      idle: {
        on: {
          START: 'loading',
          RESTORE: 'loading'
        }
      },
      loading: {
        invoke: {
          src: 'loadAssessment',
          onDone: { target: 'ready', actions: 'updateAssessmentData' },
          onError: { target: 'error', actions: 'setError' }
        }
      },
      ready: {
        on: {
          VALIDATE_STEP: 'validating',
          SAVE: 'saving',
          SUBMIT: 'submitting',
          UPDATE_DATA: { actions: 'updateData' }
        }
      },
      validating: {
        invoke: {
          src: 'validateStep',
          onDone: [
            {
              target: 'ready',
              cond: 'isValidationSuccessful',
              actions: 'clearValidationErrors'
            },
            {
              target: 'ready',
              actions: 'setValidationErrors'
            }
          ],
          onError: { target: 'error', actions: 'setError' }
        }
      },
      saving: {
        invoke: {
          src: 'saveAssessment',
          onDone: { target: 'ready' },
          onError: { target: 'error', actions: 'setError' }
        }
      },
      submitting: {
        invoke: {
          src: 'submitAssessment',
          onDone: { target: 'completed' },
          onError: { target: 'error', actions: 'setError' }
        }
      },
      completed: {
        type: 'final'
      },
      error: {
        on: {
          RETRY: 'ready',
          RESET: 'idle'
        }
      }
    }
  }, {
    guards: {
      isValidationSuccessful: (context, event) => {
        return context.validation.length === 0;
      }
    },
    actions: {
      updateAssessmentData: (context, event) => {
        context.data = event.data;
      },
      setError: (context, event) => {
        context.error = event.data;
      },
      updateData: (context, event) => {
        context.data = {
          ...context.data,
          ...event.data,
          lastUpdated: new Date().toISOString()
        };
      },
      setValidationErrors: (context, event) => {
        context.validation = event.data;
      },
      clearValidationErrors: (context) => {
        context.validation = [];
      }
    }
  });
};

export class AssessmentService {
  private machine: ReturnType<typeof createAssessmentMachine>;
  private service: any;

  constructor(
    private storage: StorageStrategy,
    private network: NetworkStrategy,
    private analytics: AnalyticsStrategy
  ) {
    this.machine = createAssessmentMachine({
      id: crypto.randomUUID(),
      currentStep: 'process',
      steps: this.initializeSteps(),
      answers: {},
      validation: [],
      lastUpdated: new Date().toISOString(),
      version: 1
    });

    this.service = interpret(this.machine)
      .onTransition((state) => {
        this.analytics.trackEvent('assessment_state_change', {
          from: state.history?.value,
          to: state.value
        });
      })
      .start();
  }

  private initializeSteps(): Record<StepId, Step> {
    return {
      process: {
        id: 'process',
        title: 'Process Information',
        isComplete: false,
        isValid: false,
        canNavigateTo: true
      },
      details: {
        id: 'details',
        title: 'Process Details',
        isComplete: false,
        isValid: false,
        canNavigateTo: false
      },
      review: {
        id: 'review',
        title: 'Review',
        isComplete: false,
        isValid: false,
        canNavigateTo: false
      },
      report: {
        id: 'report',
        title: 'Report',
        isComplete: false,
        isValid: false,
        canNavigateTo: false
      }
    };
  }

  public async validateStep(stepId: StepId): Promise<ValidationError[]> {
    try {
      const validation = await this.network.validate({
        ...this.service.state.context.data,
        currentStep: stepId
      });

      this.service.send({ type: 'VALIDATE_STEP', validation });
      return validation;
    } catch (error) {
      this.analytics.trackError(error as Error);
      throw error;
    }
  }

  public async saveProgress(): Promise<void> {
    try {
      await this.storage.save(this.service.state.context.data);
      this.service.send('SAVE');
    } catch (error) {
      this.analytics.trackError(error as Error);
      throw error;
    }
  }

  public async submit(): Promise<void> {
    try {
      await this.network.submit(this.service.state.context.data);
      this.service.send('SUBMIT');
    } catch (error) {
      this.analytics.trackError(error as Error);
      throw error;
    }
  }

  public updateData(data: Partial<AssessmentData>): void {
    this.service.send({ type: 'UPDATE_DATA', data });
  }

  public subscribe(callback: (state: AssessmentStatus) => void): () => void {
    return this.service.subscribe(state => {
      callback({
        status: state.value as AssessmentStatus['status'],
        ...(state.context.error && { error: state.context.error })
      });
    });
  }

  public getState(): AssessmentData {
    return this.service.state.context.data;
  }

  public destroy(): void {
    this.service.stop();
  }
}
