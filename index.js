const express = require('express');
const port = 8000;
const app = express();
const path = require('path');
const layout = require('express-ejs-layouts');
const db = require('./config/mongoose');
const User = require('./model/user');
const posts = require('./model/posts');
const passport = require('passport');
const passportLocal = require('./config/passportLocalStrategy');
const passportJWT = require('./config/passportJWT');
const passportGoogle = require('./config/passportgoogle');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMiddleWare = require('./config/middleware');
const cors = require('cors');
const chatServer = require('http').Server(app);
const chatSocket = require('./config/chatSocket').chatSocket(chatServer);
chatServer.listen(5000);
console.log(`Chat Server Up At port 5000`)
app.use(sassMiddleware({
    src: './assets',
    dest: './assets',
    debug: false,
    outputStyle: 'extended',
    prefix: '/',
}));
app.use(cors())
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, 'assets')));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(layout);
app.use(session({
    name: 'codeialUsingPassport',
    secret: 'blahSomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100),
    },
    store: new MongoStore(
        {
            mongooseConnection: db,
            autoRemove: 'disabled'
        },
        function (err) {
            console.log(err || 'Connected to mongo-store');
        }
    )
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMiddleWare.setFlash);
app.use('/', require('./routes'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);
app.listen(port, (err) => {
    if (err) {
        console.error.bind(console, 'Error');
        return;
    }
    console.log('Server up at port', port);
})
