# Performance Optimization Training Guide

## Core Web Vitals

### 1. Time to Interactive (TTI)
```typescript
// Example optimization
const OptimizedComponent: React.FC = () => {
  // 1. Code splitting
  const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

  // 2. Deferred loading
  const [shouldLoad, setShouldLoad] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShouldLoad(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // 3. Progressive enhancement
  return (
    <Suspense fallback={<Skeleton />}>
      {shouldLoad && <HeavyComponent />}
    </Suspense>
  );
};
```

### 2. Largest Contentful Paint (LCP)
```typescript
// Image optimization
const OptimizedImage: React.FC<ImageProps> = ({ src, alt }) => {
  // 1. Lazy loading
  const [isVisible, setIsVisible] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  // 2. Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting)
    );
    if (imageRef.current) {
      observer.observe(imageRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // 3. Progressive loading
  return (
    <div ref={imageRef}>
      {isVisible ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          srcSet={`${src}?w=300 300w, ${src}?w=600 600w`}
          sizes="(max-width: 600px) 300px, 600px"
        />
      ) : (
        <div className="placeholder" />
      )}
    </div>
  );
};
```

## State Management Optimization

### 1. Memoization
```typescript
// Example implementation
const MemoizedComponent: React.FC<Props> = memo(({ data, onAction }) => {
  // 1. Memoized calculations
  const processedData = useMemo(() => {
    return heavyCalculation(data);
  }, [data]);

  // 2. Memoized callbacks
  const handleAction = useCallback(() => {
    onAction(processedData);
  }, [onAction, processedData]);

  // 3. Memoized selectors
  const selectedData = useSelector(
    (state: RootState) => selectProcessedData(state),
    shallowEqual
  );

  return (
    <div onClick={handleAction}>
      {processedData.map(renderItem)}
    </div>
  );
}, arePropsEqual);
```

### 2. Virtual Lists
```typescript
// Implementation
const VirtualizedList: React.FC<ListProps> = ({ items }) => {
  const rowRenderer = useCallback(({ index, style }) => {
    const item = items[index];
    return (
      <div style={style}>
        <ListItem data={item} />
      </div>
    );
  }, [items]);

  return (
    <VirtualList
      height={400}
      rowCount={items.length}
      rowHeight={50}
      rowRenderer={rowRenderer}
      overscanRowCount={5}
    />
  );
};
```

## Network Optimization

### 1. Request Batching
```typescript
// Implementation
const useBatchedRequests = () => {
  const batchQueue = useRef<Request[]>([]);
  const batchTimeout = useRef<NodeJS.Timeout>();

  const addToBatch = useCallback((request: Request) => {
    batchQueue.current.push(request);
    
    if (batchTimeout.current) {
      clearTimeout(batchTimeout.current);
    }

    batchTimeout.current = setTimeout(() => {
      processBatch(batchQueue.current);
      batchQueue.current = [];
    }, 100);
  }, []);

  return { addToBatch };
};
```

### 2. Caching Strategy
```typescript
// Implementation
const useDataCache = <T,>(key: string, fetcher: () => Promise<T>) => {
  const cache = useRef<Map<string, { data: T; timestamp: number }>>(new Map());
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  const getData = useCallback(async () => {
    const cached = cache.current.get(key);
    const now = Date.now();

    if (cached && now - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    const data = await fetcher();
    cache.current.set(key, { data, timestamp: now });
    return data;
  }, [key, fetcher]);

  return { getData };
};
```

## Memory Management

### 1. Memory Leaks
```typescript
// Prevention example
const useMemorySafeSubscription = (eventSource: EventEmitter) => {
  useEffect(() => {
    const handler = (data: any) => {
      // Handle event
    };

    eventSource.on('event', handler);
    
    return () => {
      eventSource.off('event', handler);
      // Clean up any references
      handler.cleanup?.();
    };
  }, [eventSource]);
};
```

### 2. Resource Cleanup
```typescript
// Implementation
const useResourceCleanup = () => {
  const resources = useRef<Set<() => void>>(new Set());

  const registerCleanup = useCallback((cleanup: () => void) => {
    resources.current.add(cleanup);
  }, []);

  useEffect(() => {
    return () => {
      resources.current.forEach(cleanup => cleanup());
      resources.current.clear();
    };
  }, []);

  return { registerCleanup };
};
```

## Performance Monitoring

### 1. Metrics Collection
```typescript
// Implementation
const usePerformanceMetrics = () => {
  const collectMetrics = useCallback(() => {
    const metrics = {
      TTI: performance.now(),
      memory: performance.memory?.usedJSHeapSize,
      FCP: performance.getEntriesByType('paint')
        .find(entry => entry.name === 'first-contentful-paint')
        ?.startTime
    };

    monitoring.trackMetrics('performance', metrics);
  }, []);

  return { collectMetrics };
};
```

### 2. Performance Budget
```typescript
// Configuration
const performanceBudget = {
  metrics: {
    TTI: 3000,
    FCP: 1000,
    LCP: 2500
  },
  resources: {
    total: 500000,
    js: 200000,
    css: 50000,
    images: 200000
  }
};

// Monitoring
const checkBudget = async () => {
  const metrics = await monitoring.getMetrics();
  const resources = await monitoring.getResourceMetrics();

  return {
    metricsWithinBudget: Object.entries(metrics)
      .every(([key, value]) => value <= performanceBudget.metrics[key]),
    resourcesWithinBudget: Object.entries(resources)
      .every(([key, value]) => value <= performanceBudget.resources[key])
  };
};
```

## Practical Exercises

### 1. Performance Audit
```typescript
// Exercise template
const auditComponent = async (Component: React.ComponentType) => {
  // 1. Render metrics
  const renderMetrics = await monitoring.measureRender(Component);

  // 2. Memory usage
  const memoryMetrics = await monitoring.measureMemory(Component);

  // 3. Network impact
  const networkMetrics = await monitoring.measureNetwork(Component);

  return {
    renderMetrics,
    memoryMetrics,
    networkMetrics
  };
};
```

### 2. Optimization Challenge
```typescript
// Challenge template
interface Challenge {
  component: React.ComponentType;
  currentMetrics: PerformanceMetrics;
  targetMetrics: PerformanceMetrics;
  hints: string[];
}

const optimizationChallenge: Challenge = {
  component: UnoptimizedComponent,
  currentMetrics: {
    TTI: 5000,
    LCP: 3000,
    FID: 300
  },
  targetMetrics: {
    TTI: 3000,
    LCP: 2000,
    FID: 100
  },
  hints: [
    'Consider code splitting',
    'Implement memoization',
    'Optimize resource loading'
  ]
};
```
