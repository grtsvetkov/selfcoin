let iro = require("@jaames/iro");


const IconCOUNT = 115;

coinItemEditLogoReinit = function(selected) {
    let mySwiper = app.swiper.create('#coinItemEditLogoSwiper', {
        width: 128 + 8,
        height: 128 + 8
    });
    
    if(selected !== null) {
        $('.logoItem[data-name='+selected+']').addClass('selected');
        let m = parseInt(selected);
        mySwiper.slideTo(m - 1, Math.exp( m / IconCOUNT  ) * 2000);
    }
};

colorWheel = false;

let selectedCoin = new ReactiveVar(),
    selectedColors = {};

Template.coinItemEditLogo.rendered = function () {
    Meteor.setTimeout(() => {
        Meteor.defer(() => {

            coinItemEditLogoReinit(null);

            colorWheel = new iro.ColorPicker("#colorWheel", {
                width: 200,
                height: 200,
                padding: 4,
                markerRadius: 8,
                color: "rgb(118, 144, 249)"
            });

            colorWheel.on("color:change", function(color) {
                selectedColors.start = color.hexString;
                $('.coinLogo>defs>linearGradient>stop[offset=0]').css({'stop-color': color.hexString});
            });
        })
    }, 333);
};


Template.coinItemEditLogo.helpers({
    'standart_list': () => {

        let result = [];
        
        for(let i = 1; i <= IconCOUNT; i++) {
            result.push({type: 'standart', name: i});
        }
        
        return result;
    }
});

Template.coinItemEditLogo.events({
    'click .logoItem': (e) => {
        selectedCoin.set(e.currentTarget.dataset.name);
        $('.logoItem').removeClass('selected');
        $(e.currentTarget).addClass('selected');
    },

    'click #saveLogo': (e) => {
        let sel = selectedCoin.get();

        if(!sel || !Router.current().params._id) {
            appAlert('Выберете иконку');
            return;
        }


        Meteor.call('coin.setStandartLogo', Router.current().params._id, sel, selectedColors)
        mainView.router.back('/coinItem');
    },

    'click #colorGrad>div': (e) => {
        $('#colorGrad>div').removeClass('selected');
        $(e.currentTarget).addClass('selected');
        $('.coinLogo>defs>linearGradient>stop[offset=1]').css({'stop-color': $(e.currentTarget).css('background-color')});
        selectedColors.stop = $(e.currentTarget).css('background-color');
    }
});