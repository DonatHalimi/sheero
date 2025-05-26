const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./db');
const { BACKEND_PORT } = require('./dotenv');

const launchServer = (app) => {
    const server = http.createServer(app);

    const io = new Server(server, {
        path: '/socket.io',
        cors: {
            origin: app.get('corsOrigin'),
            credentials: true
        }
    });
    app.set('io', io);

    io.on('connection', socket => {
        const { userId } = socket.handshake.query;

        if (userId) {
            const room = `user:${userId}`;
            socket.join(room);
        }
    });

    connectDB();
    server.listen(BACKEND_PORT, () => {
        console.log(`✓ Server is running at \x1b[4mhttp://localhost:${BACKEND_PORT}\x1b[0m`);
        console.log(`✓ Socket.IO listening on \x1b[4mws://localhost:${BACKEND_PORT}/socket.io\x1b[0m`);
    });
};

module.exports = launchServer;