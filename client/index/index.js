let tmpList1 = ['Адидасы', 'Баскеты', 'Боксы', 'Липтоны', 'Маки', 'Мерсы', 'Найки', 'Рыбчики', 'Трофимчик', 'Шашлычная'];

Template.index.rendered = function () {
    app.swiper.create('.popular', {
        speed: 400,
        pagination: '.swiper-pagination',
        slidesPerView: 3
    });
};

Template.index.helpers({

    'block0': () => {
        return _.map(Coin.find({user_id: Meteor.userId()}, { sort: {_id: -1} }).fetch(), function (item, key) {

            let name = item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name;

            return {
                _id: item._id,
                name: name,
                img: '/asserts/img/' + tmpList1[key] + '.png'
            }
        })
    },

    'block1': () => {
        return _.map(_.shuffle(tmpList1), function (item) {
            return {
                name: item,
                img: '/asserts/img/' + item + '.png'
            }
        })
    },

    'block2': () => {
        return _.map(_.shuffle(tmpList1), function (item) {
            return {
                name: item,
                img: '/asserts/img/' + item + '.png'
            }
        })
    },

    'block3': () => {
        return _.map(_.shuffle(tmpList1), function (item) {
            return {
                name: item,
                img: '/asserts/img/' + item + '.png'
            }
        })
    }
});