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
        return _.map(_.shuffle(tmpList1), function (item) {
            return {
                name: item,
                img: '/asserts/img/' + item + '.png',
                count: _.random(102, 23432),
                isPublic: _.random(0, 1) > 0 ? true : false
            }
        })
    }
});