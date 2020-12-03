const sequelize = require('sequelize');
const Router = require('express-promise-router');
const router = Router();
const bodyParser = require('body-parser');
const bodyParserUrlEncoded = bodyParser.urlencoded({ extended: false });
const bcrypt = require('bcrypt');
const saltRounds = 10;

const users = require('../models/users');
const movies = require('../models/movies');
const cinemas = require('../models/cinemas');
const showings = require('../models/showings');
const rooms = require('../models/rooms');
const tickets = require('../models/tickets');

const path = require('path');
const multer = require('multer');
const diskStorage = multer.diskStorage({
    destination: './public/images/user-avatars/',
    filename: function (req, file, cb) {
        cb(null, req.session.email + path.extname(file.originalname));
    }
});

const uploadAvatar = multer({
    storage: diskStorage,
    limits: { filesize: 700 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('upload-avatar');

function checkFileType(file, cb) {
    //Define allowed extension
    const fileTypes = /jpeg|jpg|png|gif/;
    //Check extension
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    //Check MIME
    const mimeType = fileTypes.test(file.mimetype);

    if (mimeType && extname) {
        return cb(null, cb);
    } else {
        cb('Upload avatar failed');
    }
}

router.post('/upload-avatar', (req, res) => {
    uploadAvatar(req, res, async err => {
        let email = req.session.email;
        let avatarUploadingStatus = '';
        if (err)
            avatarUploadingStatus = 'Upload avatar failed';
        else {
            if (req.file == undefined)
                avatarUploadingStatus = 'No image was selected';
            else {
                const result = await users.update(
                    { avatar: req.file.filename },
                    { where: { email: req.session.email } }
                );
                avatarUploadingStatus = 'Changed avatar successfully!';
            }
        }
        return res.redirect('/management?avatarUploadingStatus=' + avatarUploadingStatus);
    });
});

router.get('/booked-seats', (req, res) => {
    res.redirect('/authentication');
});

router.post('/booked-seats', bodyParserUrlEncoded, async (req, res) => {
    let _roomId = req.body.chosenRoomId;

    let bookedSeats = await tickets.findAll({
        where: {
            roomid: _roomId,
            createdAt: {
                [sequelize.Op.lte]: new Date()
            }
        }
    });

    let seats = [];
    if(bookedSeats){
        
        bookedSeats.forEach(item => {
            seats.push(item.dataValues.seat);
        });
    }
    res.send(seats);
});

router.get('/upload-avatar', (req, res) => {
    res.redirect('/authenication');
});

router.get('/', async (req, res) => {
    if (req.session.email) {
        let { avatarUploadingStatus } = req.query;
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
        );
        let email = req.session.email;
        let user = await users.findOne({ where: { email: email } });
        return res.render('management', { email, user, movieList, cinemaList, showingList, showingDateList, avatarUploadingStatus });
    }

    return res.redirect('./authentication');
});

router.post('/update-profile', bodyParserUrlEncoded, async (req, res) => {
    let { fullname, phone, address } = req.body;
    let email = req.session.email;
    await users.update(
        {
            name: fullname,
            phone: phone,
            address: address
        },
        {
            where: { email: email }
        }
    );
    res.send('Updated profile successfully!');
});

router.get('/update-profile', (req, res) => {
    res.redirect('/authentication');
});

router.get('/change-password', (req, res) => {
    res.redirect('/authentication');
});

router.post('/change-password', bodyParserUrlEncoded, async (req, res) => {
    let { oldPassword, newPassword, confirmedNewPassword } = req.body;
    let email = req.session.email;

    if (!oldPassword || !newPassword || !confirmedNewPassword)
        return res.send('Please complete all fields');

    if (newPassword !== confirmedNewPassword)
        return res.send('Confirmed password does not match');

    let user = await users.findOne({ where: { email: email } });
    await bcrypt.compare(oldPassword, user.dataValues.password).then(matched => {
        if (matched) {
            bcrypt.hash(newPassword, saltRounds).then(async hash => {
                await users.update(
                    { password: hash },
                    { where: { email: email } }
                );
                res.send('Changed password successfully!');
            });
        }
        else
            res.send('Your password is not correct!');
    });
});

router.post('/qrcode', bodyParserUrlEncoded, (req, res) => {
    let { type, value } = req.body;
    if (type === 'user') {
        let email = req.session.email;
        return res.send(email);
    }
});

router.get('/qrcode', (req, res) => {
    res.redirect('/authentication');
});


module.exports = router;