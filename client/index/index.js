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

        let list = [];

        _.each(Wallet.find({user_id: Meteor.userId()}).fetch(), function(i, key){
            let coin = Coin.findOne({_id: i.coin_id});
            list.push({name: coin.name, img: '/asserts/img/' + tmpList1[key] + '.png'})
        });

        _.each(_.shuffle(tmpList1), function (item) {

            let name = item.length > 12 ? item.substr(0, 10) + '...' : item;

            list.push({
                name: name,
                img: '/asserts/img/' + item + '.png',
            })
        });

        return list;
    }
});