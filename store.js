const redis = require('redis');
const REDIS_PORT = process.env.PORT || 6379;
const REDIS_LIST = 'users';

// Simulate time spent running server logic (1000ms)
const TIME_SPENT_PROCESSING = 1000

// Indicate when the processor is running or idle
let IS_PROCESSING = false;

// Initialize redis clients
const subscriber = redis.createClient(REDIS_PORT);
const publisher = redis.createClient(REDIS_PORT);

// Subscribe to LPUSH event.
const EVENT_SET = '__keyevent@0__:lpush';
subscriber.config('set', 'notify-keyspace-events', 'KEA');
subscriber.SUBSCRIBE(EVENT_SET);

// Add eventlistener to subscriber
subscriber.on('message', (channel, key) => {
    // If the queue is being processed, do nothing.
    if (IS_PROCESSING) return;

    // Else run the event handler.
    else listenToPushEvent(key)
});

function listenToPushEvent(key) {
    IS_PROCESSING = true;
    publisher.RPOP(key, (err, value) => {
        if (err) console.error(err);
        else processQueue(value);
    });
}

function processQueue(value) {
    setTimeout(() => {
        console.log(`${value} has been processed and removed from queue.`);
        publisher.LLEN(REDIS_LIST, (err, length) => {
            const hasMoreRequests = length > 0;
    
            // Continue processing the queue without blocking the queue.
            if (hasMoreRequests) {
                listenToPushEvent(REDIS_LIST);
            }

            // Stop the processor and let the event handler trigger processing.
            else IS_PROCESSING = false;
        })
    }, TIME_SPENT_PROCESSING);
}

module.exports = publisher;