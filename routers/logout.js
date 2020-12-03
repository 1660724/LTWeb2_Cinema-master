const Router = require('express-promise-router');
const router = Router();
const bodyParser = require('body-parser');
const bodyParserUrlEncoded = bodyParser.urlencoded({ extended: false });

router.get('/', bodyParserUrlEncoded, (req, res) => {
    if(req.session.email)
        delete req.session.email;
    
    return res.redirect('./');
})

module.exports = router;