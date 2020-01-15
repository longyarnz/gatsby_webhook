# PSEUDO CODE
This app solves the problem when multiple requests overload a server.

## Step 1
- Create a nodejs app using express.
- Create a route to receive a post request from a service eg GitHub webhooks.

## Step 2
- Install Redis for caching the requests in memory.
- The Redis service captures the payload of the webhook and persists to the storage.
- Create a task queue to process the requests from Redis.
- Create a subscriber client and a publisher client.
- Initialize 4 variables to control the operation of redis cilents:
  - REDIS_PORT,
  - REDIS_LIST, 
  - TIME_SPENT_PROCESSING, 
  - IS_PROCESSING.
- Create an event listener for the LPUSH redis command.
- Create a processor function to run tasks in the redis queue.
- If the processor function is not running, invoke it in the event listener.
- If the processor function is running, don't invoke it until it finishes processing the queue.
- Add a processing queue that receives a task that is currently being processed.

## Step 3
- Install Prometheus.
- Import Prometheus client into the app.
- Create the metrics we want to capture.
  - Number of requests.
  - Time taken to cache each request in Redis.
  - Time taken to process each request.

  Execute redis functions
- Extract redis to a store file.
- Create a subscriber client and a publisher client.
- Initialize 4 variables to control the operation of redis cilents: REDIS_PORT, REDIS_LIST, TIME_SPENT_PROCESSING, IS_PROCESSING.
- Create an event listener for the LPUSH redis command.
- Create a processor function to run tasks in the redis queue.
- If the processor function is not running, invoke it in the event listener.
- If the processor function is running, don't invoke it until it finishes processing the queue.