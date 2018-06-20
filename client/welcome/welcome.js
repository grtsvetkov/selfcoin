Template.welcome.rendered = function () {
    Meteor.defer(function () {
        app.swiper.create('#welcomeSlider', {
            speed: 400,
            pagination: '.swiper-pagination',
        });
    });
};