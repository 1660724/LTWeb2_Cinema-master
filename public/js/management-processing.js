$(document).ready(() => {

    $.post('/management/qrcode',
        {
            type: 'user',
            value: ''
        }, res => {
            var qrcode = new QRCode(document.getElementById('qrcode'), {
                text: res,
                width: 95,
                height: 95,
                colorDark: "black",
                colorLight: "skyblue",
                correctLevel: QRCode.CorrectLevel.H
            });
            $('#qrcode').css({
                "display": "table",
                "margin": "0 auto",
                "margin-top": "13px",
                "margin-bottom": "10px",
                "border": "5px solid skyblue"
            });
        });

    $(".topShowingDate").click(() => {
        $(".topShowingDate").removeClass("active");
    });

    $(".normalShowingDate").click(() => {
        $(".normalShowingDate").removeClass("active");
    });

    $('#upload-avatar-icon').hide();
    $('.loader').hide();
    $('#divSidebar').hide();
    $('#divCinemaMovieRevenue').hide();
    $('#cinemaRevenueContent').hide();
    $('#movieRevenueContent').hide();
    $('#backButton').hide();
    $('.bookingSeat').hide();

    let chosenSeats = [];
    let bookedSeats = [];
    let chosenRoomId = 0;
    let price = 0;
    let topMovie = 1;

    $('#topMovieTab').click(() => {
        topMovie = 1;
    });

    $('.normal-movie').click(() => {
        topMovie = 0;
    })

    $('.movie-details').click((e) => {
        let temp = '#trailer-';
        if (topMovie === 1)
            temp = '#topTrailer-';
        let movieTrailer = $(temp + e.target.value);
        movieTrailer.empty();
        let movieId = e.target.value;
        $.post('/movie-trailer', { movieId }, data => {
            movieTrailer.append(data.trailer);
        });
    });

    $('#profile-avatar').on('mouseover', () => {
        $('#upload-avatar-icon').show();
    });
    $('#profile-avatar').on('mouseout', () => {
        $('#upload-avatar-icon').hide();
    });
    $('#upload-avatar-button').on('change', (e) => {
        $('#submit-upload-avatar').click();
    });

    let avatarUploadingStatus = $('#avatar-uploading-status');
    if (avatarUploadingStatus.text()) {
        let status = avatarUploadingStatus.text();
        avatarUploadingStatus.text('');
        $('#divSidebar').show();
        $('#divCinemaMovieRevenue').hide();
        $('#divBookTicket').hide();
        alert(status);
    }

    $('.finishBookingButton').click(e => {
        if (chosenSeats.length == 0) {
            alert('Please choose a seat');
            return false;
        }
        let arr = e.target.value.split('_');
        let temp = arr[0] + arr[1];

        let _showingTime = $('#bookingTime-' + temp).text().replace(/\s/g, '');
        if (topMovie)
            _showingTime = $('#topBookingTime-' + temp).text().replace(/\s/g, '');

        let _bookingRoom = $('#bookingRoom-' + temp).text().replace(/\s/g, '');
        if (topMovie)
            _bookingRoom = $('#topBookingRoom-' + temp).text().replace(/\s/g, '');

        let newBooking = {
            bookingMovieId: arr[0],
            showingDate: arr[1],
            showingTime: _showingTime,
            bookingRoom: chosenRoomId,
            bookingSeats: JSON.stringify(chosenSeats),
            bookingTotal: chosenSeats.length * price
        };
        $('.loader').show();
        $.post('/book-ticket', newBooking, data => {

            let bookingAlert = $('#booking-alert');
            bookingAlert.empty();
            let body = $('#booked-tickets-body');
            body.empty();

            if (data === 'Booking failed') {
                if (topMovie)
                    $('#closeTopBookingButton-' + newBooking.bookingMovieId).click();
                else $('#closeBookingButton-' + newBooking.bookingMovieId).click();
                $('.loader').hide();
                let alert = jQuery('<span style="color: lightcoral; font-weight: bold; font-size: 20px">There were some problems happened when booking. So your booking was failed and please try again. We are sorry about this :(</span>');
                bookingAlert.append(alert);
                return;
            }

            let tickets = JSON.parse(data.bookingSeats);
            let alert = jQuery('<span style="color: lightgreen; font-weight: bold; font-size: 20px">Thanks for your booking!</span>');
            bookingAlert.append(alert);
            tickets.forEach(item => {
                let ticketWrapper = jQuery('<div class="ticket-wrapper row"></div>');
                let ticket = jQuery('<div class="ticket col-sm-8"></div>');
                let logo = jQuery('<div class="ticket-logo"><img src="images/wings_2.png" style="height: 30px; width: 30px; margin-bottom: 5px" /><span style="color:skyblue">Wings<span style="font-weight:bold; color: white"> Cinema</span></span></div>');
                let img = jQuery('<img src="images/bg14.png" style="width: 130px; height: 130x; margin-top: -60px; float:right">');

                let movieName = '<span style="font-size:20px"><b>' + data.movieName + '</b></span>';
                let theater = '<br><span><i class="fas fa-map-marker-alt" style="font-size:20px; color:#B33A3A"></i> Location: <b>' + data.bookingCinema + '<b></span>';
                let cinema = '<b><span> (' + data.bookingRoom + ')</span></b>';
                let showingDate = jQuery('<br><span><i class="far fa-clock" style="font-size:18px"></i> Time: <b>' + data.showingDate + ' ' + data.showingTime + '</b></span>');
                let seat = jQuery('<br><span>Seat: <b>' + item + '</b></span>');
                let price = jQuery('<br><span>Price: <b>' + divideThousand(data.bookingTotal / tickets.length) + ' VND</b></span>');

                let ticketBarcode = jQuery('<div class="col-sm-4" style="padding:8px"></div>');

                // let code = new QRCode({
                //     text: "abc",
                //     width: "100%",
                //     height: "100%",
                //     colorDark: "black",
                //     colorLight: "skyblue",
                //     correctLevel: QRCode.CorrectLevel.H
                // });

                // ticketBarcode.append(code);

                // ticketBarcode.css({
                //     "display": "table",
                //     "margin": "0 auto",
                //     "margin-top": "13px",
                //     "margin-bottom": "10px",
                //     "border": "5px solid skyblue"
                // });

                ticket.append(logo);

                ticket.append(movieName);
                ticket.append(theater);
                ticket.append(cinema);
                ticket.append(showingDate);
                ticket.append(seat);
                ticket.append(price);

                ticket.append(img);
                ticketWrapper.append(ticket);
                ticketWrapper.append(ticketBarcode);
                body.append(ticketWrapper);
            });
            if (topMovie)
                $('#closeTopBookingButton-' + data.bookingMovieId).click();
            else $('#closeBookingButton-' + data.bookingMovieId).click();
            $('.loader').hide();
        });
    });

    $('.cinema-map-button').click(e => {
        let cinemaMap = $('#cinemaMap');
        cinemaMap.empty();
        let cinemaId = Number(e.target.value);
        $.post('/cinema-map', { cinemaId }, data => {
            cinemaMap.append(data.map);
        });
    });

    $('#tabCinemaInfo').click(() => {
        $('#cinemaMap').empty();
        let arr = $('.cinema-map-button');
        arr[0].click();
    })

    $('.showings').click(e => {
        let arr = e.target.value.split('_');
        chosenRoomId = arr[3];
        if (topMovie) {
            $('#topBookingCinemaTable-' + arr[0]).hide();
            $('#topBookingCinema-' + arr[0]).text($('#topBookingCinemaName-' + arr[0] + "_" + arr[1]).text() + ", " + arr[2]);
            $('#topBookingRoom-' + arr[0]).text(arr[5]);
            $('#topBookingSeat-' + arr[0]).show();
            $('#topBookingTime-' + arr[0]).text($(e.target).text());
            $('#topBookingTotal-' + arr[0]).text('0');
        } else {
            $('#bookingCinemaTable-' + arr[0]).hide();
            $('#bookingCinema-' + arr[0]).text($('#bookingCinemaName-' + arr[0] + "_" + arr[1]).text() + ", " + arr[2]);
            $('#bookingRoom-' + arr[0]).text(arr[5]);
            $('#bookingSeat-' + arr[0]).show();
            $('#bookingTime-' + arr[0]).text($(e.target).text());
            $('#bookingTotal-' + arr[0]).text('0');
        }
        price = Number(arr[4]);

        $('.loader').show();

        $.post('/management/booked-seats', { chosenRoomId }, data => {
            bookedSeats = data.map(item => { return item });
            loadSeats(9, 9, arr[0]);
            $('.loader').hide();
        });
    })

    $('.tabShowingDate').click(e => {
        if (topMovie) {
            $('#topBookingCinemaTable-' + e.target.value).show();
            $('#topBookingSeat-' + e.target.value).hide();
            $('#topChosenSeats-' + e.target.value).text("");
        } else {
            $('#bookingCinemaTable-' + e.target.value).show();
            $('#bookingSeat-' + e.target.value).hide();
            $('#chosenSeats-' + e.target.value).text("");
        }
        chosenSeats = [];
    })

    $('.backToCinemaButton').click(e => {
        if (topMovie) {
            $('#topBookingCinemaTable-' + e.target.value).show();
            $('#topBookingSeat-' + e.target.value).hide();
            $('#topChosenSeats-' + e.target.value).text("");
        } else {
            $('#bookingCinemaTable-' + e.target.value).show();
            $('#bookingSeat-' + e.target.value).hide();
            $('#chosenSeats-' + e.target.value).text("");
        }
        chosenSeats = [];
    })

    $('.booking').click(e => {
        if (topMovie)
            $('#tabTopShowingDate-' + e.target.value).click();
        else $('#tabShowingDate-' + e.target.value).click();
    });

    $('#tabBookTicket').click(() => {
        $('#divSidebar').hide();
        $('#divCinemaMovieRevenue').hide();
        $('#divBookTicket').show();
    })

    $('#tabHome').click(() => {
        $('#divSidebar').show();
        $('#divCinemaMovieRevenue').hide();
        $('#divBookTicket').hide();
    })

    $('#tabRevenue').click(() => {
        $('#divSidebar').hide();
        $('#divBookTicket').hide();
        $('#divCinemaMovieRevenue').show();
    });

    $('#cinemaRevenueButton').click(() => {
        $('#revenueOption').hide();
        $('#revenueTitleText').text('Cinemas Revenue');
        $('#backButton').show();
        $('#cinemaRevenueContent').show();
    });

    $('#movieRevenueButton').click(() => {
        $('#revenueOption').hide();
        $('#revenueTitleText').text('Movies Revenue');
        $('#backButton').show();
        $('#movieRevenueContent').show();
    });

    $('#backButton').click(() => {
        $('#revenueOption').show();
        $('#revenueTitleText').text('Revenue');
        $('#backButton').hide();
        $('#cinemaRevenueContent').hide();
        $('#movieRevenueContent').hide();
    });

    $('.formInput').keyup((e) => {
        if (!e.target.value) {
            $('#update-profile-button').attr('disabled', true);
            alert("Your data is not allowed");
        } else {
            $('#update-profile-button').attr('disabled', false);
        }
    });
    $('#update-profile-button').click(() => {
        $.post('/management/update-profile',
            {
                fullname: $('#profile-fullname').val(),
                phone: $('#profile-phone').val(),
                address: $('#profile-address').val(),
            }, res => {
                alert(res);
            });

    });

    $('#changePasswordButton').click(() => {
        $.post('/management/change-password',
            {
                oldPassword: $('#oldPassword').val(),
                newPassword: $('#newPassword').val(),
                confirmedNewPassword: $('#confirmedNewPassword').val()
            }, res => {
                alert(res);
            });
    })

    function divideThousand(number) {
        var parts = number.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return parts.join(".");
    }

    function loadSeats(width, height, movieid) {
        let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        let room = $('#seats-' + movieid);
        if (topMovie)
            room = $('#topSeats-' + movieid);
        room.empty();
        let left = 5;
        let top = 5;
        let index = 1;
        for (let i = 1; i <= width; i++) {
            for (let j = 1; j <= height; j++) {
                if (index > width)
                    index = 1;
                let letter = alphabet[(i - 1) % 24];
                let seat = jQuery('<button>' + letter + index + '</button>');
                seat.css({
                    "margin-left": left,
                    "margin-top": top,
                    "height": "30px",
                    "width": "30px",
                    "font-size": "14px",
                    "padding": "0"
                });
                if (bookedSeats.includes(seat.text())) {
                    seat.addClass('danger-button');
                    seat.attr('disabled', true);
                } else {
                    seat.addClass('light-button');
                    seat.click(() => {
                        let check = false;
                        chosenSeats.forEach(ele => {
                            if (ele === seat.text())
                                check = true;
                        });
                        if (check === false) {
                            seat.attr('class', 'success-button');
                            chosenSeats.push(seat.text());
                        } else {
                            chosenSeats = chosenSeats.filter(ele => ele !== seat.text());
                            seat.attr('class', 'light-button');
                        }
                        let seats = $('#chosenSeats-' + movieid);

                        if (topMovie)
                            seats = $('#topChosenSeats-' + movieid);

                        seats.empty();

                        chosenSeats.forEach(ele => {
                            let span = jQuery('<span style="margin-left: 5px">' + ele + '</span>');
                            seats.append(span);
                        });
                        let total = divideThousand(chosenSeats.length * price);
                        let bookTotal = $('#bookingTotal-' + movieid);
                        if (topMovie)
                            bookTotal = $('#topBookingTotal-' + movieid)
                        bookTotal.text(total);
                    });
                }
                room.append(seat);
                index++;
            }
            let br = jQuery('<br>');
            room.append(br);
        }
    }
});