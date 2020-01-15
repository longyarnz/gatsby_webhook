const express = require('express');

// Initialize express server
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 4000;

// Run server.
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
