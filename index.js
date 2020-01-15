const express = require('express');
const statusMonitor = require('express-status-monitor')();

const pullUsers = require('./pullUsers');
const { numberOfRequests, client } = require('./metrics');

// Initialize ports
const PORT = process.env.PORT || 4000;

// Initialize express server
const app = express();

// Add health check metrics to server
app.use(statusMonitor);

app.use(express.json());

// Expose a default get route tp check current server stats
app.get('/', statusMonitor.pageRoute);

// Get users from GitHub
app.get('/webhook', async (req, res) => {
    const users = await pullUsers();
    numberOfRequests.inc();
    res.json(users);
})

// Metrics endpoint
app.get('/metrics', (req, res) => {
    res.set('Content-Type', client.register.contentType)
    res.end(client.register.metrics())
})

// Run server.
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
