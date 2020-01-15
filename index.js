const express = require('express');
const redis = require('redis');
const fetch = require('node-fetch');
const statusMonitor = require('express-status-monitor')();

// Initialize ports
const PORT = process.env.PORT || 4000;
const REDIS_PORT = process.env.PORT || 6379;

// Initialize express server
const app = express();

// Initialize redis
const redisClient = redis.createClient(REDIS_PORT);

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
            let response = await fetch(`https://api.github.com/users/${name}`);
            response = await response.json();

            // Push fetch data into Redis
            redisClient.LPUSH('users', JSON.stringify(response));
            return response;
        });
        return await Promise.all(requests);
    } catch (error) {
        console.log(error);
        return 'Unable to fetch users';
    }
}

// Get users from GitHub
app.get('/users', async (req, res) => {
    const users = await pullUsers();
    res.json(users);
})

// Run server.
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
