const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const session = require('express-session');
const db = require('./models/db');
const movies = require('./models/movies');
const cinemas = require('./models/cinemas');
const showings = require('./models/showings');
const rooms = require('./models/rooms');

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(__dirname + '/public'));
app.use(function (req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});
const RedisStore = require('connect-redis')(session);
const url = require('url');
const REDIS_URL = process.env.REDIS_URL || 'redis://:@localhost:6379';
const redisOptions = url.parse(REDIS_URL);
app.use(session({
    store: new RedisStore({
        host: redisOptions.hostname,
        port: redisOptions.port,
        pass: redisOptions.auth.split(':')[1],
    }),
    secret: process.env.SESSION_SECRET || 'secret',
    saveUninitialized: true,
    resave: false,
    unset: 'destroy',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 }
}));

const authentication = require('./routers/authentication');
const register = require('./routers/register');
const management = require('./routers/management');
const logout = require('./routers/logout');
const sendMail = require('./routers/send-mail');
const bookTicket = require('./routers/book-ticket');
const movieTrailer = require('./routers/movie-trailer');
const cinemaMap = require('./routers/cinema-map');
app.use('/authentication', authentication);
app.use('/register', register);
app.use('/management', management);
app.use('/logout', logout);
app.use('/send-mail', sendMail);
app.use('/book-ticket', bookTicket);
app.use('/movie-trailer', movieTrailer);
app.use('/cinema-map', cinemaMap);

app.get('/', async (req, res) => {

    let movieList = await movies.findAll();
    let cinemaList = await cinemas.findAll();
   
    let showingList = await showings.findAll({
        include: {
            model: rooms
        },
    });

    let showingDateList = await showings.findAll(
        {
            attributes: ['movieid', 'date'],
            group: ['movieid', 'date'],
            order: [
                ['date', 'ASC']
            ]
        }
    )
    if (req.session.email)
        return res.redirect('/authentication');
    let email = req.session.email;
    return res.render('index', { email, movieList, cinemaList, showingList, showingDateList });
});

db.sync().then(function () {
    app.listen(port);
    console.log(`Server is listening on port ${port}`)
}).catch(function (err) {
    console.error(err);
});