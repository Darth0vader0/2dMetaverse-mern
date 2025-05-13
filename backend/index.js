const express = require('express')
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDb = require('./src/config/db');
const AuthController = require('./src/controllers/auth.controller');
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
app.listen(5000, () => {
    console.log('Server is running on port 5000');
} )