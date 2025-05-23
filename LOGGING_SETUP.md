# 🔧 Logging Setup Guide

## Step 1: Create the Logs Table in Supabase

1. **Go to your Supabase Dashboard**
   - Navigate to **SQL Editor**
   - Copy the contents from `supabase/migrations/001_create_logs_table.sql`
   - Paste and run the SQL

2. **Verify the Table**
   - Go to **Table Editor** → `logs` table should appear
   - You should see columns: id, created_at, level, message, data, environment, source, user_session_id, user_agent, url

## Step 2: Test the Logging

1. **Refresh your app** - the 405 errors should be gone
2. **Check the logs table** in Supabase for new entries
3. **View logs** in Supabase Dashboard → Table Editor → logs

## Step 3: Key Data You'll Get

### **User Journey Tracking**
- **Assessment Start**: When users begin the process
- **Step Completion**: Each step they finish 
- **Step Abandonment**: Where they drop off
- **Assessment Completion**: Full completion rate

### **Error Monitoring**
- **Form Errors**: Validation failures
- **Calculation Errors**: Processing issues
- **Technical Errors**: App crashes or bugs

### **Performance Insights**
- **Step Duration**: How long each step takes
- **Calculation Performance**: Processing speed
- **User Behavior**: Navigation patterns

## Step 4: Adding More Logging (Optional)

You can add logging to your components like this:

```typescript
import { logger } from '@/utils/logger';

// When assessment starts
logger.assessmentStarted({ userId: user.id });

// When completing steps
logger.assessmentStepCompleted('company-info', { 
  companySize: formData.companySize 
});

// When users navigate
logger.pageView('assessment-step-3');

// For button clicks
logger.buttonClick('submit', 'company-info-form');

// For errors
logger.assessmentError('calculations', error, { 
  step: 'profitability-analysis' 
});
```

## Step 5: Analyzing the Data

Once you have data, you can query it in Supabase:

```sql
-- Completion rates by session
SELECT 
  COUNT(DISTINCT user_session_id) as total_sessions,
  COUNT(DISTINCT CASE WHEN message = 'Assessment completed' THEN user_session_id END) as completed_sessions
FROM logs;

-- Most common drop-off points
SELECT 
  message,
  COUNT(*) as abandonment_count
FROM logs 
WHERE message LIKE 'Assessment step abandoned%'
GROUP BY message
ORDER BY abandonment_count DESC;

-- Average time to complete
SELECT 
  user_session_id,
  MIN(created_at) as start_time,
  MAX(created_at) as end_time,
  MAX(created_at) - MIN(created_at) as duration
FROM logs
WHERE source = 'assessment'
GROUP BY user_session_id;
```

## ✅ What You've Solved

- **No more 405 errors** - logging works properly
- **User journey tracking** - see where people drop off
- **Error monitoring** - catch and fix issues
- **Data-driven improvements** - optimize based on real usage
- **Performance insights** - understand user behavior

Your assessment app now has professional-grade logging! 🎯 