const fetch = require('node-fetch');
const redisClient = require('./store');
const {
    numberOfTasksAddedtoQueue,
    timeSpentOnQueuingTasks,
} = require('./metrics');

// Method for fetching users from GitHub
async function pullUsers() {
    const names = ['longyarnz', 'gearon'];
    
    try {
        const requests = names.map(async name => {
            // Simulate receiving a payload from a GitHub webhook by fetching data from GitHub API
            let response = await fetch(`https://api.github.com/users/${name}`);
            response = await response.json();
            
            const startTime = Date.now();
            // Push fetch data into Redis
            redisClient.LPUSH('users', response.login, err => {
                if (err) console.error(err);
                else console.log(`${response.login} has been added to queue.`);
                // Count number of tasks added to queue.
                numberOfTasksAddedtoQueue.inc();
                
                // Track time spent on queuing tasks.
                const endTime = Date.now() - startTime;
                console.log(startTime, Date.now());
                console.log(`Time spent on queing task is: ${endTime}`);
                timeSpentOnQueuingTasks.observe(endTime);
            });

            return response;
        });
        return await Promise.all(requests);
    } catch (error) {
        console.error(error);
        return 'Unable to fetch users';
    }
}

module.exports = pullUsers;