const client = require('prom-client');
const collectDefaultMetrics = client.collectDefaultMetrics;

// Probe every 5th second.
collectDefaultMetrics({ timeout: 5000 });

const numberOfRequests = new client.Counter({
  name: 'number_of_requests',
  help: 'Count the number of requests made to the server'
});

const numberOfRequestsAddedtoQueue = new client.Counter({
  name: 'number_of_requests',
  help: 'Count the number of requests made added to the queue'
});

const numberOfTasksProcessed = new client.Counter({
  name: 'number_of_tasks',
  help: 'Count the number of processed in the queue'
});

const timeSpentOnQueuingRequests = new client.Histogram({
  name: 'time_spent_on_queuing',
  help: 'Evaluate the time spent on queing requests in the redis queue',
});

const timeSpentOnProcessingATask = new client.Histogram({
  name: 'time_spent_on_tasks',
  help: 'Evaluate the time spent on processing each task in the queue',
});

module.exports = {
    numberOfRequests,
    numberOfRequestsAddedtoQueue,
    numberOfTasksProcessed,
    timeSpentOnQueuingRequests,
    timeSpentOnProcessingATask
}