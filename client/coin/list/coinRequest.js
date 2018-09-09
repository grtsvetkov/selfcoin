let tmpList1 = ['Адидасы', 'Баскеты', 'Боксы', 'Липтоны', 'Маки', 'Мерсы', 'Найки', 'Рыбчики', 'Трофимчик', 'Шашлычная'];

Template.coinRequest.helpers({
    'request_list': () => {

        let list = [];

        _.each(Coin.find({user_id: Meteor.userId()}).fetch(), (i, key) => {

            i.img = '/assets/img/' + tmpList1[key] + '.png';

            _.each(RequestEnroll.find({coin_id: i._id}).fetch(), (j, key) => {

                j.img = '/assets/img/ava.png';

                j.text = '<strong>' + j.user_id + '</strong> создал запрос на <strong>'+ (j.type == 'enroll' ? 'зачисление' : 'списание') + '</strong> монеты <strong>'+ i.name + '</strong> за <strong>'+ j.name + '</strong>' +
                    ' стоимостью <strong>' + j.price + '</strong>';

                list.push({
                    type: 'requestEnroll',
                    coin: i,
                    request: j
                })
            })
        });


        _.each(Coin.find({request: Meteor.userId()}).fetch(), (i, key) => {

            i.img = '/assets/img/' + tmpList1[key] + '.png';

            let request = RequestForParty.findOne({from_user: i.user_id});

            request.img = '/assets/img/ava.png';

            request.text = '<strong>' + request.name + '</strong> приглашает стать участником монеты <strong>'+ i.name + '</strong>';

            list.push({
                type: 'requestParty',
                coin: i,
                request: request
            })
        });

        return list;
    }
});

Template.coinRequest.events({
    'click .request-action': (e) => {
        e.preventDefault();

        let dataset = e.currentTarget.dataset;

        switch(dataset.notice ) {
            case 'requestEnroll':
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
                            }
                        },
                        {
                            text: 'Отклонить',
                            onClick: function () {
                                let text = e.currentTarget.dataset.type ? 'Запрос на зачисление отклонён' : 'Запрос на списание отклонён';

                                Meteor.call('wallet.rejectEnroll', e.currentTarget.dataset.id, function () {
                                    appAlert(text);
                                });
                            }
                        }
                    ]
                }).open();
                break;

            case 'requestParty':
                app.actions.create({
                    buttons: [
                        {
                            text: 'Принять',
                            onClick: function () {
                                Meteor.call('requestForParty.approve', e.currentTarget.dataset.id, function () {
                                    appAlert('Запрос на приглашение успешно принят');
                                });
                            }
                        },
                        {
                            text: 'Отклонить',
                            onClick: function () {
                                Meteor.call('requestForParty.reject', e.currentTarget.dataset.id, function () {
                                    appAlert('Запрос на приглашение отклонён');
                                });
                            }
                        }
                    ]
                }).open();
                break;
        }


    }
})