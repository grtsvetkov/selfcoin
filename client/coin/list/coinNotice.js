let tmpList1 = ['Адидасы', 'Баскеты', 'Боксы', 'Липтоны', 'Маки', 'Мерсы', 'Найки', 'Рыбчики', 'Трофимчик', 'Шашлычная'];

Template.coinNotice.helpers({
    'notice_list': () => {

        let list = [];

        _.each(Coin.find({user_id: Meteor.userId()}).fetch(), (i, key) => {

            i.img = '/asserts/img/' + tmpList1[key] + '.png';

            _.each(RequestEnroll.find({coin_id: i._id}).fetch(), (j, key) => {

                j.img = '/asserts/img/ava.png';

                j.text = '<strong>' + j.user_id + '</strong> создал запрос на <strong>'+ (j.type == 'enroll' ? 'зачисление' : 'списание') + '</strong> монеты <strong>'+ i.name + '</strong> за <strong>'+ j.name + '</strong>' +
                    ' стоимостью <strong>' + j.price + '</strong>';

                list.push({
                    coin: i,
                    request: j
                })
            })
        });

        return list;
    }
});

Template.coinNotice.events({
    'click .item-action': (e) => {
        e.preventDefault();

        app.actions.create({
            buttons: [
                {
                    text: 'Принять',
                    onClick: function () {
                        
                        let method = e.currentTarget.dataset.type == 'enroll' ? 'wallet.approveEnroll' : 'wallet.approveOffs';
                        let text = e.currentTarget.dataset.type ? 'Зачисление прошло успешно!' : 'Списание прошло успешно!';
                        
                        Meteor.call(method, e.currentTarget.dataset.id, function () {
                            appAlert(text);
                        });
                    },
                },
                {
                    text: 'Отклонить',
                    onClick: function () {

                    }
                }
            ]
        }).open();
    }
})