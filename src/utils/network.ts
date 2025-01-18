interface RetryOptions {
  maxRetries?: number;
  delayMs?: number;
  shouldRetry?: (error: Error) => boolean;
}

const defaultRetryOptions: Required<RetryOptions> = {
  maxRetries: 3,
  delayMs: 1000,
  shouldRetry: (error: Error) => {
    // Retry on network errors or 5xx server errors
    return error.message.includes('network') || 
           error.message.includes('500') ||
           error.message.includes('timeout');
  }
};

export async function fetchWithRetry(
  input: RequestInfo | URL,
  init?: RequestInit,
  options: RetryOptions = {}
): Promise<Response> {
  const { maxRetries, delayMs, shouldRetry } = { ...defaultRetryOptions, ...options };
  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(input, {
        ...init,
        headers: {
          ...init?.headers,
          'X-Retry-Attempt': attempt.toString()
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries - 1 || !shouldRetry(lastError)) {
        throw lastError;
      }

      await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(2, attempt)));
    }
  }

  throw lastError!;
}
