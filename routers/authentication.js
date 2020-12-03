const Router = require('express-promise-router');
const router = Router();
const bodyParser = require('body-parser');
const bodyParserUrlEncoded = bodyParser.urlencoded({ extended: false });
const bcrypt = require('bcrypt');
const saltRounds = 10;
const users = require('../models/users');

router.post('/', bodyParserUrlEncoded, async (req, res) => {
    let { loginEmail, loginPassword } = req.body;

    let user = await users.findOne(
        { where: { email: loginEmail } }
    );

    if (user) {
        const passwordChecker = await bcrypt.compare(loginPassword, user.dataValues.password);
        if (passwordChecker) {
            req.session.email = loginEmail;

            const userid = await users.findOne({
                attributes: ['id'],
                where: {
                    email: loginEmail
                }
            });
            req.session.userid = userid.dataValues.id;
            return res.send('Logged in successfully!');
        }
    }

    return res.send('Logged in failed');
});

router.get('/', (req, res) => {
    if (req.session.email)
        return res.redirect('./management');

    return res.redirect('./');
})

module.exports = router;