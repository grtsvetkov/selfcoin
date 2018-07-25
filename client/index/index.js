let tmpList1 = ['Адидасы', 'Баскеты', 'Боксы', 'Липтоны', 'Маки', 'Мерсы', 'Найки', 'Рыбчики', 'Трофимчик', 'Шашлычная'];

Template.index.rendered = function() {
    app.swiper.create('.popular', {
        speed: 400,
        pagination: '.swiper-pagination',
        slidesPerView: 3
    });
};

Template.index.helpers({
    'block1': () => {
        return _.map(_.shuffle(tmpList1), function(item){
            return {
                name: item,
                img: '/asserts/img/'+item+'.png'
            }
        })
    },

    'block2': () => {
        return _.map(_.shuffle(tmpList1), function(item){
            return {
                name: item,
                img: '/asserts/img/'+item+'.png'
            }
        })
    },

    'block3': () => {
        return _.map(_.shuffle(tmpList1), function(item){
            return {
                name: item,
                img: '/asserts/img/'+item+'.png'
            }
        })
    }
});