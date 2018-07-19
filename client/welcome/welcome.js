Template.welcome.renderedF7 = function () {
    Meteor.defer(function () {
        let mySwiper = app.swiper.create('.welcome', {
            touchEventsTarget : 'wrapper',
            speed: 400,
            pagination: '.swiper-pagination',
            nextButton: '.next .button',
            on: {
                slideChangeTransitionStart: function () {
                    $('.welcome').removeClass('is-slide-0 is-slide-1 is-slide-2 is-slide-3');
                    $('.welcome').addClass('is-slide-' + mySwiper.activeIndex);

                    if(mySwiper.activeIndex == 3) {
                        $('.next .button').hide();
                    } else {
                        $('.next .button').show();
                    }
                },

                slideChangeTransitionEnd: function() {
                    //console.log(mySwiper.activeIndex);
                },
                slideChange: function() {
                    mySwiper.oldIndex = mySwiper.activeIndex
                }
            }
        });

        mySwiper.cntIndex = 3;

        $('.next .button').click(function () {
            if (mySwiper.activeIndex == mySwiper.cntIndex && mySwiper.oldIndex == mySwiper.cntIndex) {
                Router.go('signin');
            }
            mySwiper.oldIndex = mySwiper.activeIndex;
            mySwiper.slideNext(400);
        })
    });


};

