# PSEUDO CODE
This app solves the problem when multiple requests overload a server.

## Step 1
- Create a nodejs app using express.
- Create a route to receive a post request from a service eg GitHub webhooks.

## Step 2
- Install Redis for caching the requests in memory.
- The Redis service captures the payload of the webhook and persists to the storage.
- Create a task queue to process the requests from Redis.

## Step 3
- Install Prometheus.
- Import Prometheus client into the app.
- Create the metrics we want to capture.
  - Number of requests.
  - Time taken to cache each request in Redis.
  - Time taken to process each request.