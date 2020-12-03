const Router = require('express-promise-router');
const router = Router();
const bodyParser = require('body-parser');
const bodyParserUrlEncoded = bodyParser.urlencoded({ extended: false });
const movies = require('../models/movies');

router.post('/', bodyParserUrlEncoded, async (req, res) => {
    let { movieId } = req.body;
    movieId = Number(movieId);
    let movie = await movies.findOne({ where: { id: movieId } });
    res.send(movie);
});

router.get('/', (req, res) => {
    res.redirect('/authentication');
});

module.exports = router;