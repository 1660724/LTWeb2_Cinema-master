$(document).ready(() => {

    $('.loader').hide();
    $('#divResetPassword').hide();

    let topMovie = 1;

    $('#topMovieTab').click(() => {
        topMovie = 1;
    });

    $('.normal-movie').click(() => {
        topMovie = 0;
    })

    $('.movie-details').click((e) => {
        let temp = '#trailer-';
        if(topMovie === 1)
            temp = '#topTrailer-';
        let movieTrailer = $(temp + e.target.value);
        movieTrailer.empty();
        let movieId = e.target.value;
        $.post('/movie-trailer', { movieId }, data => {
            movieTrailer.append(data.trailer);
        });
    });

    $('#forgotPasswordLink').click(() => {
        $('.formInput').val('');
        $('#divSignIn').hide();
        $('#divResetPassword').show();
        $('#resetPasswordAlert').text('');
    });

    $('.cinema-map-button').click(e => {
        let cinemaMap = $('#cinemaMap');
        cinemaMap.empty();
        let cinemaId = Number(e.target.value);
        $.post('/cinema-map', { cinemaId }, data => {
            cinemaMap.append(data.map);
        });
    });

    $('#backToSignInLink').click(() => {
        $('#divSignIn').show();
        $('#divResetPassword').hide();
        $('#authAlert').text('');
    });

    $('#sendMailButton').click(() => {
        $.post('/send-mail',
            {
                resetEmail: $('#resetEmail').val()
            }, (data) => {
                $('#resetPasswordAlert').text(data);
                if (data == 'Please check email to reset your password !') {
                    $('#resetPasswordAlert').css({
                        "color": "lightgreen"
                    });
                } else {
                    $('#resetPasswordAlert').css({
                        "color": "lightcoral"
                    });
                }
            });
    });

    $('#tabCinemaInfo').click(() => {
        $('#cinemaMap').empty();
        let arr = $('.cinema-map-button');
        arr[0].click();
    })

    $('#tabSignIn').click(() => {
        $('#authAlert').text('');
        $('.formInput').val('');
        $('#backToSignInLink').click();
    });

    $('#tabSignUp').click(() => {
        $('#registerAlert').text('');
        $('.formInput').val('');
    });

    $('#createAccountLink').click(() => {
        $('#closeSignInFormButton').click();
    });

    $('#signInLink').click(() => {
        $('#closeSignUpFormButton').click();
    });

    $('#loginButton').click(() => {
        $.post('/authentication',
            {
                loginEmail: $('#loginEmail').val(),
                loginPassword: $('#loginPassword').val()
            },
            data => {
                if (data !== 'Logged in successfully!') {
                    $('#authAlert').css({
                        "color": "lightcoral"
                    })
                    $('#authAlert').text(data);
                }
                else
                    window.location.href = './management';
            })
    });

    $('#registerButton').click(() => {
        $.post('/register',
            {
                registerFullname: $('#registerFullname').val(),
                registerEmail: $('#registerEmail').val(),
                registerPhone: $('#registerPhone').val(),
                registerAddress: $('#registerAddress').val(),
                registerPassword: $('#registerPassword').val(),
                registerConfirmedPassword: $('#registerConfirmedPassword').val()
            },
            data => {
                if (data != 'Created account successfully!') {
                    $('#registerAlert').css({
                        "color": "lightcoral"
                    });
                }
                else {
                    $('#registerAlert').css({
                        "color": "lightgreen"
                    });
                }
                $('#registerAlert').text(data);
            })
    });
})