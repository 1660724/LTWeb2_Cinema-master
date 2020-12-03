const Router = require('express-promise-router');
const router = Router();
const bodyParser = require('body-parser');
const bodyParserUrlEncoded = bodyParser.urlencoded({ extended: false });
const bcrypt = require('bcrypt');
const saltRounds = 10;
const users = require('../models/users');

router.post('/', bodyParserUrlEncoded, async (req, res) => {
    const { registerFullname, registerEmail, registerPhone, registerAddress, registerPassword, registerConfirmedPassword } = req.body;

    if (!registerFullname || !registerEmail || !registerPhone || !registerAddress || !registerPassword || !registerConfirmedPassword)
        return res.send('Please complete all fields.');

    let user = await users.findOne(
        { where: { email: registerEmail } }
    );

    if (user)
        return res.send('Your email is used');

    if (registerPassword !== registerConfirmedPassword)
        return res.send('Confirmed password does not match.');

    await bcrypt.hash(registerPassword, saltRounds).then(async (hash) => {
        await users.create({
            name: registerFullname,
            email: registerEmail,
            phone: registerPhone,
            address: registerAddress,
            password: hash,
            role: 'member'
        });
    });

    return res.send('Created account successfully!');
})

module.exports = router;