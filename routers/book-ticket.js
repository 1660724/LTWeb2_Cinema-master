const Router = require('express-promise-router');
const router = Router();
const bodyParser = require('body-parser');
const bodyParserUrlEncoded = bodyParser.urlencoded({ extended: false });
const movies = require('../models/movies');
const showings = require('../models/showings');
const rooms = require('../models/rooms');
const cinemas = require('../models/cinemas');
const bookings = require('../models/bookings');
const tickets = require('../models/tickets');

router.post('/', bodyParserUrlEncoded, async (req, res) => {
    let newBooking = req.body;

    let _movieName = await movies.findOne({
        attributes: ['name'],
        where: {
            id: Number(newBooking.bookingMovieId)
        }
    });

    let bookedShowing = await showings.findOne({
        where: {
            movieid: Number(newBooking.bookingMovieId),
            roomid: Number(newBooking.bookingRoom),
            date: new Date(newBooking.showingDate)
        }
    });

    let bookedRoom = await rooms.findOne({
        where: {
            id: bookedShowing.dataValues.roomid
        }
    });

    let bookedCinema = await cinemas.findOne({
        where: {
            id: Number(bookedRoom.cinemaid)
        }
    });

    let booking = await bookings.create({
        userid: req.session.userid,
        showingid: bookedShowing.dataValues.id,
        date: new Date(),
        total: newBooking.bookingTotal
    });

    if (booking) {
        let seats = JSON.parse(newBooking.bookingSeats);
        seats.forEach(async (_seat) => {
            let seat = await tickets.create({
                bookingid: booking.dataValues.id,
                roomid: bookedRoom.dataValues.id,
                seat: _seat
            });
        });
    }

    let savedBooking = {
        bookingMovieId: bookedShowing.dataValues.movieid,
        showingDate: bookedShowing.dataValues.date,
        showingTime: bookedShowing.dataValues.starttime,
        bookingCinema: bookedCinema.dataValues.name + ', ' + bookedCinema.dataValues.address,
        bookingRoom: bookedRoom.dataValues.name,
        bookingSeats: newBooking.bookingSeats,
        bookingTotal: newBooking.bookingTotal,
        movieName: _movieName.dataValues.name,
    }

    res.send(savedBooking);
});

module.exports = router;