const express = require('express');
const statusMonitor = require('express-status-monitor')();

// Initialize express server
const app = express();

// Add health check metrics to server
app.use(statusMonitor);

app.use(express.json());
const PORT = process.env.PORT || 4000;

// Expose a default get route tp check current server stats
app.get('/', statusMonitor.pageRoute);

// Run server.
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
