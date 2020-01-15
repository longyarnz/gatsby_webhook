const redis = require('redis');
const {
    numberOfTasksProcessed,
    timeSpentOnProcessingATask
} = require('./metrics');

const REDIS_PORT = process.env.PORT || 6379;
const REDIS_LIST = 'users';
const REDIS_PROCESSING_LIST = 'backup';

// Simulate time spent running server logic (1000ms)
const TIME_SPENT_PROCESSING = Math.round(Math.random() * 5000);

// Indicate when the processor is running or idle
let IS_PROCESSING = false;

// Initialize redis clients
const subscriber = redis.createClient(REDIS_PORT);
const publisher = redis.createClient(REDIS_PORT);

// Subscribe to LPUSH event.
const EVENT_LPUSH = '__keyevent@0__:lpush';

// Subscribe to RPUSH event.
const EVENT_RPUSH = '__keyevent@0__:rpush';
subscriber.config('set', 'notify-keyspace-events', 'KEA');
subscriber.SUBSCRIBE(EVENT_LPUSH, EVENT_RPUSH);

// Add eventlistener to subscriber
subscriber.on('message', (channel, key) => {
    // If the queue is being processed, do nothing.
    if (IS_PROCESSING) return;

    // Else run the event handler.
    else listenToPushEvent(key)
});

function listenToPushEvent(key) {
    IS_PROCESSING = true;

    // Remove the last task and process but store it in another list incase of failure from downtime.
    publisher.RPOPLPUSH(key, REDIS_PROCESSING_LIST, (err, value) => {
        if (err) console.error(err);
        else processQueue(value);
    });
}

function processQueue(value) {
    const startTime = Date.now();

    setTimeout(() => {
        // Execute log on the task.
        console.log(`${value} has been processed and removed from queue.`);

        // Count number of tasks processed.
        numberOfTasksProcessed.inc();

        // Remove task from the backup list because it has been successfully processed.
        publisher.RPOP(REDIS_PROCESSING_LIST);

        // Track time spent on processing task.
        const endTime = Date.now() - startTime;
        console.log(`Time spent on processing task is: ${endTime}`);
        timeSpentOnProcessingATask.observe(endTime)

        // Schedule a new task.
        scheduleNewTask();
    }, TIME_SPENT_PROCESSING);
}

function scheduleNewTask() {
    publisher.LLEN(REDIS_LIST, (err, length) => {
        const hasMoreTasks = length > 0;
        // Check if there are more tasks in the queue and continue processing.
        if (hasMoreTasks) {
            listenToPushEvent(REDIS_LIST);
        }
        else {
            publisher.LLEN(REDIS_PROCESSING_LIST, (err, length) => {
                const backupHasMoreTasks = length > 0;
                if (backupHasMoreTasks)
                listenToPushEvent(REDIS_PROCESSING_LIST);
                // Stop the processor and let the event handler trigger processing.
                else IS_PROCESSING = false;
            });
        }
    });
}

module.exports = publisher;