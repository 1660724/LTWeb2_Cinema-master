const Router = require('express-promise-router');
const router = Router();
const bodyParser = require('body-parser');
const bodyParserUrlEncoded = bodyParser.urlencoded({ extended: false });

router.get('/', (req, res) => {
    res.redirect('./');
});

router.post('/', bodyParserUrlEncoded, (req, res) => {
    let resetEmail = req.body.resetEmail;
    if(!resetEmail)
        return res.send('Email cannot be empty !');
    res.send('Please check email to reset your password !');
});

module.exports = router;