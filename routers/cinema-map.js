const Router = require('express-promise-router');
const router = Router();
const bodyParser = require('body-parser');
const bodyParserUrlEncoded = bodyParser.urlencoded({ extended: false });
const cinemas = require('../models/cinemas');

router.post('/', bodyParserUrlEncoded, async (req, res) => {
    let { cinemaId } = req.body;
    let cinema = await cinemas.findOne({ where: { id: cinemaId } });
    res.send(cinema);
});

router.get('/', (req, res) => {
    res.redirect('/authentication');
});

module.exports = router;