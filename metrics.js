const client = require('prom-client');
const collectDefaultMetrics = client.collectDefaultMetrics;

// Probe every 5th second.
collectDefaultMetrics({ timeout: 5000 });

const numberOfRequests = new client.Counter({
    name: 'number_of_requests',
    help: 'Count the number of requests made to the server'
});

const numberOfTasksAddedtoQueue = new client.Counter({
    name: 'number_of_requests',
    help: 'Count the number of requests made added to the queue'
});

const numberOfTasksProcessed = new client.Counter({
    name: 'number_of_tasks',
    help: 'Count the number of processed in the queue'
});

const timeSpentOnQueuingTasks = new client.Histogram({
    name: 'time_spent_on_queuing',
    help: 'Evaluate the time (milliseconds) spent on queing requests in the redis queue',
    buckets: [1, 2, 5, 6, 10]
});

const timeSpentOnProcessingATask = new client.Histogram({
    name: 'time_spent_on_tasks',
    help: 'Evaluate the time (seconds) spent on processing each task in the queue',
    buckets: [1, 2, 5, 6, 10]
});

module.exports = {
    client,
    numberOfRequests,
    numberOfTasksAddedtoQueue,
    numberOfTasksProcessed,
    timeSpentOnQueuingTasks,
    timeSpentOnProcessingATask
}