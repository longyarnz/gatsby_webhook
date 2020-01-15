const express = require('express');
const fetch = require('node-fetch');
const statusMonitor = require('express-status-monitor')();

// Initialize express server
const app = express();

// Add health check metrics to server
app.use(statusMonitor);

app.use(express.json());
const PORT = process.env.PORT || 4000;

// Expose a default get route tp check current server stats
app.get('/', statusMonitor.pageRoute);

async function pullUsers() {
    const names = ['longyarnz', 'gearon'];
    try {
        console.log('Pulling users from GitHub');
        const requests = names.map(async name => {
            const fetchUsers = await fetch(`https://api.github.com/users/${name}`);
            return await fetchUsers.json();
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
