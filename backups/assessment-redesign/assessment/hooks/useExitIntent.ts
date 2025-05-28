import { useState, useEffect, useCallback } from 'react';
import { trackEvent } from '../utils/analytics';

interface UseExitIntentOptions {
  threshold?: number;
  eventThrottle?: number;
  triggerOnce?: boolean;
  onExit?: () => void;
}

export const useExitIntent = ({
  threshold = 20,
  eventThrottle = 500,
  triggerOnce = true,
  onExit,
}: UseExitIntentOptions = {}) => {
  const [showModal, setShowModal] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  let lastEventTime = 0;

  const handleMouseLeave = useCallback(
    (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastEventTime < eventThrottle) return;
      lastEventTime = now;

      if (triggerOnce && hasTriggered) return;

      // Check if the mouse is leaving from the top of the viewport
      if (e.clientY <= threshold) {
        trackEvent({
          category: 'Exit_Intent',
          action: 'Trigger',
          metadata: {
            triggerType: 'mouse_leave',
            mousePosition: { x: e.clientX, y: e.clientY },
            pageHeight: document.documentElement.scrollHeight,
            viewportHeight: window.innerHeight,
          },
        });

        setShowModal(true);
        setHasTriggered(true);
        onExit?.();
      }
    },
    [threshold, eventThrottle, triggerOnce, hasTriggered, onExit]
  );

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden && !hasTriggered) {
      trackEvent({
        category: 'Exit_Intent',
        action: 'Trigger',
        metadata: {
          triggerType: 'visibility_change',
          timestamp: Date.now(),
        },
      });

      setShowModal(true);
      setHasTriggered(true);
      onExit?.();
    }
  }, [hasTriggered, onExit]);

  const handleBackButton = useCallback(
    (e: PopStateEvent) => {
      if (!hasTriggered) {
        e.preventDefault();
        trackEvent({
          category: 'Exit_Intent',
          action: 'Trigger',
          metadata: {
            triggerType: 'back_button',
            timestamp: Date.now(),
          },
        });

        setShowModal(true);
        setHasTriggered(true);
        onExit?.();

        // Push a new state to prevent immediate back navigation
        window.history.pushState(null, '', window.location.pathname);
      }
    },
    [hasTriggered, onExit]
  );

  useEffect(() => {
    // Add state to prevent back button
    window.history.pushState(null, '', window.location.pathname);

    // Add event listeners
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('popstate', handleBackButton);

    // Track initialization
    trackEvent({
      category: 'Exit_Intent',
      action: 'Initialize',
      metadata: {
        threshold,
        eventThrottle,
        triggerOnce,
        timestamp: Date.now(),
      },
    });

    // Cleanup
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [handleMouseLeave, handleVisibilityChange, handleBackButton, threshold, eventThrottle, triggerOnce]);

  const closeModal = useCallback(() => {
    trackEvent({
      category: 'Exit_Intent',
      action: 'Modal_Close',
      metadata: {
        triggerType: hasTriggered ? 'user_action' : 'programmatic',
        timestamp: Date.now(),
      },
    });

    setShowModal(false);
  }, [hasTriggered]);

  const resetTrigger = useCallback(() => {
    setHasTriggered(false);
  }, []);

  return {
    showModal,
    closeModal,
    hasTriggered,
    resetTrigger,
  };
};

export default useExitIntent;