const express = require('express');
const fetch = require('node-fetch');
const statusMonitor = require('express-status-monitor')();
const redisClient = require('./store');
const {
    numberOfRequests,
    numberOfRequestsAddedtoQueue,
    numberOfTasksProcessed,
    timeSpentOnQueuingRequests,
    timeSpentOnProcessingATask
} = require('./metrics');

// Initialize ports
const PORT = process.env.PORT || 4000;

// Initialize express server
const app = express();

// Add health check metrics to server
app.use(statusMonitor);

app.use(express.json());

// Expose a default get route tp check current server stats
app.get('/', statusMonitor.pageRoute);

// Method for fetching users from GitHub
async function pullUsers() {
    const names = ['longyarnz', 'gearon'];

    try {
        const requests = names.map(async name => {
            // Simulate receiving a payload from a GitHub webhook by fetching data from GitHub API
            let response = await fetch(`https://api.github.com/users/${name}`);
            response = await response.json();

            // Push fetch data into Redis
            redisClient.LPUSH('users', response.login, err => {
                if (err) console.error(err);
                else console.log(`${response.login} has been added to queue.`);            });

            return response;
        });
        return await Promise.all(requests);
    } catch (error) {
        console.error(error);
        return 'Unable to fetch users';
    }
}

// Get users from GitHub
app.get('/webhook', async (req, res) => {
    const users = await pullUsers();
    res.json(users);
})

// Run server.
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
