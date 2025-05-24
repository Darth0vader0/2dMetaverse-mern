const express = require('express')
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true,
    }
});

const gameSocket = require('./src/config/gameSocket');
gameSocket(io);


const connectDb = require('./src/config/db');
const AuthController = require('./src/controllers/auth.controller');
const AuthMiddlware = require('./src/middleware/auth.middleware');
const SpaceController = require('./src/controllers/space.controller')
connectDb();
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Hello World!');
}
);

app.post('/api/signup', AuthController.signup);
app.post('/api/login', AuthController.login);
app.put('/api/save-avatar', AuthMiddlware.verifyToken, AuthController.saveAvatar);
app.post('/api/create-space', AuthMiddlware.verifyToken,SpaceController.createSpace);
app.get('/api/get-spaces', AuthMiddlware.verifyToken, SpaceController.getSpace);
app.post('/api/join-space', AuthMiddlware.verifyToken, SpaceController.joinSpaceByCode);
server.listen(5000, () => {
    console.log('Server is running on port 5000');
} )