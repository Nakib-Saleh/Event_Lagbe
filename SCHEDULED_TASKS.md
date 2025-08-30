# 🕐 Scheduled Tasks System

## Overview
The Event Lagbe application includes an automated system to deactivate events when all their timeslots have ended. This ensures that expired events are automatically marked as inactive.

## 🎯 **Main Task: Event Deactivation**

### **What it does:**
1. **Fetches** all events with `isActive = true`
2. **Checks** each event's timeslots
3. **Deactivates** events where ALL timeslots have ended
4. **Keeps** events active if ANY timeslot is still in the future

### **Schedule:**
- **Frequency**: Daily at midnight (00:00:00)
- **Timezone**: Bangladesh (Asia/Dhaka)
- **Cron Expression**: `0 0 0 * * ?`

### **Logic:**
```
For each active event:
  ├── Get all timeslots for the event
  ├── Check if any timeslot end time > current time
  │   ├── YES → Keep event active
  │   └── NO → Deactivate event
  └── Update event status in database
```

## 🔧 **Implementation Details**

### **Files Created:**
1. **`ScheduledEventService.java`** - Main service with scheduled task
2. **`ScheduledTaskController.java`** - Manual trigger endpoint
3. **Updated `EventRepository.java`** - Added `findByIsActiveTrue()` method
4. **Updated `BackendApplication.java`** - Added `@EnableScheduling`

### **Key Methods:**

#### `deactivateExpiredEvents()`
- **Scheduled method** that runs automatically
- Fetches active events and processes each one
- Logs detailed information about the process

#### `checkIfEventShouldBeDeactivated(Event event)`
- **Private helper method**
- Checks all timeslots for a specific event
- Returns `true` if ALL timeslots have expired
- Returns `false` if ANY timeslot is still active

#### `runDeactivationTaskManually()`
- **Manual trigger method** for testing
- Can be called via API endpoint

## 🧪 **Testing**

### **Manual Testing:**
```bash
# Trigger the task manually
POST http://localhost:2038/api/scheduled-tasks/deactivate-expired-events
```

### **Expected Response:**
```json
{
  "success": true,
  "message": "Event deactivation task triggered successfully"
}
```

### **Console Logs:**
The task provides detailed console output:
```
🕐 Starting scheduled task: deactivateExpiredEvents at 2024-01-15T00:00:00
📋 Found 5 active events to check
✅ Event still active: Tech Conference (ID: abc123)
❌ Deactivated event: Old Workshop (ID: def456)
🎯 Scheduled task completed. Deactivated 1 events out of 5 checked
```

## ⚙️ **Configuration**

### **Cron Expression Breakdown:**
```
0 0 0 * * ?
│ │ │ │ │ │
│ │ │ │ │ └── Day of week (any)
│ │ │ │ └──── Day of month (any)
│ │ │ └────── Month (any)
│ │ └──────── Hour (0 = midnight)
│ └────────── Minute (0)
└──────────── Second (0)
```

### **Timezone:**
- **Zone**: `Asia/Dhaka`
- **Offset**: UTC+6 (Bangladesh Standard Time)

## 🔄 **Alternative Scheduling Options**

### **Different Frequencies:**
```java
// Every hour
@Scheduled(cron = "0 0 * * * ?", zone = "Asia/Dhaka")

// Every 6 hours
@Scheduled(cron = "0 0 */6 * * ?", zone = "Asia/Dhaka")

// Every 30 minutes
@Scheduled(cron = "0 */30 * * * ?", zone = "Asia/Dhaka")

// Every day at 6 AM
@Scheduled(cron = "0 0 6 * * ?", zone = "Asia/Dhaka")
```

### **Fixed Rate (Alternative to Cron):**
```java
// Run every 24 hours (86400000 milliseconds)
@Scheduled(fixedRate = 86400000)
```

## 🛡️ **Error Handling**

### **Built-in Safeguards:**
1. **Try-catch blocks** around all operations
2. **Null checks** for timeslot end times
3. **Graceful degradation** - errors don't stop the entire process
4. **Detailed logging** for debugging

### **Error Scenarios:**
- **No timeslots**: Event stays active
- **Null end time**: Event stays active
- **Database errors**: Logged but don't crash the task
- **Invalid dates**: Handled gracefully

## 📊 **Monitoring**

### **What to Monitor:**
1. **Console logs** for task execution
2. **Database** for event status changes
3. **Application performance** during task execution
4. **Error rates** in logs

### **Success Indicators:**
- ✅ Task runs daily at midnight
- ✅ Events are deactivated when appropriate
- ✅ No errors in console logs
- ✅ Database consistency maintained

## 🚀 **Deployment Considerations**

### **Single Instance:**
- ✅ Works perfectly with Spring Boot @Scheduled
- ✅ No additional configuration needed

### **Multiple Instances:**
- ⚠️ **Problem**: Multiple instances would run the task
- 🔧 **Solution**: Use Quartz Scheduler with database persistence
- 🔧 **Alternative**: Use distributed locks

### **Production Recommendations:**
1. **Monitor logs** for task execution
2. **Set up alerts** for task failures
3. **Consider backup scheduling** for critical events
4. **Test thoroughly** before deployment

## 🔮 **Future Enhancements**

### **Possible Improvements:**
1. **Email notifications** when events are deactivated
2. **Dashboard metrics** for task performance
3. **Configurable scheduling** via admin panel
4. **Event reactivation** capabilities
5. **Batch processing** for large datasets

### **Advanced Features:**
1. **Time zone handling** for international events
2. **Event reminders** before deactivation
3. **Analytics** on event lifecycle
4. **Custom deactivation rules** per event type

---

## 📝 **Summary**

The scheduled task system automatically manages event lifecycles by:
- ✅ **Running daily** at midnight Bangladesh time
- ✅ **Checking all active events** and their timeslots
- ✅ **Deactivating expired events** automatically
- ✅ **Providing detailed logging** for monitoring
- ✅ **Including manual triggers** for testing
- ✅ **Handling errors gracefully** without crashing

This ensures your Event Lagbe platform maintains accurate event status without manual intervention! 🎉
