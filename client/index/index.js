let tmpList1 = ['Адидасы', 'Баскеты', 'Боксы', 'Липтоны', 'Маки', 'Мерсы', 'Найки', 'Рыбчики', 'Трофимчик', 'Шашлычная'];


Template.index.rendered = function () {
    Meteor.setTimeout(() => {
        Meteor.defer(() => {
            let mySwiper = app.swiper.create('#important', {
                speed: 400,
                slidesPerView: 6,
                loop: true
            });
        })
    }, 333);
};

Template.index.helpers({

    'important_list': () => {

        let user_id = Meteor.userId(),
            list = [];

        _.each(Wallet.find({user_id: user_id}).fetch(), function (i, key) {

            let coin = Coin.findOne({_id: i.coin_id, owner: user_id});

            if (coin) {
                list.push({
                    _id: coin._id,
                    name: coin.name,
                    logo: coin.logo
                })
            }
        });

        return list;
    }
});