const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const cors = require('cors');
const corsOptions = require('./config/cors');
const express = require('express');
const launchServer = require('./config/server');
const routes = require('./routes');
const passport = require('./config/passport');
const session = require('express-session');
const { NODE_ENV, SESSION_SECRET } = require('./config/dotenv');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// Session middleware for Passport (Google and Facebook login)
app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/uploads', express.static('uploads'));
app.use('/api', routes);

connectDB();
launchServer(app);