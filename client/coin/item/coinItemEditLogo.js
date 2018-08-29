coinItemEditLogoReinit = function() {
    let mySwiper = app.swiper.create('#coinItemEditLogoSwiper', {
        //speed: 400,
        //slidesPerView: 2,
        width: 200,
        height: 200,
        spaceBetween: 20
    });
};

colorWheel = false;

let selectedCoin = new ReactiveVar();

Template.coinItemEditLogo.rendered = function () {
    Meteor.setTimeout(() => {
        Meteor.defer(() => {
            coinItemEditLogoReinit();

            colorWheel = iro.ColorWheel("#colorWheel", {
                width: 320,
                height: 320,
                padding: 4,
                markerRadius: 8,
                color: "rgb(68, 255, 158)",
                css: {
                    ".coinLogo": {
                        "fill": "rgb"
                    }
                }
            });
        })
    }, 333);
};


Template.coinItemEditLogo.helpers({
    'standart_list': () => {

        let sel = selectedCoin.get(), result = [];
        
        for(let i = 1; i <= 25; i++) {
            result.push({type: 'standart', name: i, selected: sel == i});
        }
        
        return result;
    }
});

Template.coinItemEditLogo.events({
    'click .logoItem': (e) => {
        selectedCoin.set(e.currentTarget.dataset.name);
    },

    'click #saveLogo': (e) => {
        let sel = selectedCoin.get();
        Meteor.call('coin.setStandartLogo', Router.current().params._id, sel, $('.logoItem:eq(0)>svg').css('fill'))
        mainView.router.back('/coinItem');
    },
})