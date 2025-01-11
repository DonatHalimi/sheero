const { BACKEND_PORT } = require('./dotenv');

const launchServer = (app) => {
    try {
        app.listen(BACKEND_PORT, () => {
            console.log(`✓ Server is running at \x1b[4mhttp://localhost:${BACKEND_PORT}\x1b[0m`);
        });
    } catch (error) {
        console.error('⚠️  Failed to start the server:', error);
    }
};

module.exports = launchServer;